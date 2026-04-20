import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
import "../../../../utilities/updateDisplayTop.js"


let cooldowns = new Map()
EnumRegistry(messages.command.create, async (origin, args) => {
  
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/team ${messages.command.create} ${messages.helpArg.create}`)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  let teams = db.fetch("team", true)
  if(player.hasTeam()) return player.sendMessage(messageSyntax(messages.notInTeam))
  if(setting.teams["maxTeamLength"] < args.length) return player.sendMessage(messageSyntax(messages.create.maxLength))
  if(setting.teams["minTeamLength"] > args.length) return player.sendMessage(messageSyntax(messages.create.minLength))
  if(setting.teams["bannedChars"].split('').some(char => args.includes(char)) || ![...args].every(char => setting.teams["allowedChars"].includes(char))) return player.sendMessage(messageSyntax(messages.bannedChar))
  if(setting.teams["blacklist"].includes(args)) return player.sendMessage(messageSyntax(messages.create.banned))
  if(teams.some(team => team.name === args)) return player.sendMessage(messageSyntax(messages.create.exists))
  
  let teamGeneratedId;
  for (let i = 1; i <= 500; i++) {
    if(!teams.some(t => t.id === `team${i}`)) {
      teamGeneratedId = `team${i}`
      break;
    }
  }
  
  teams.push({
    name: args.replace("/§[1234567890abcdefklmnori]/g", ""),
    id: teamGeneratedId,
    color: setting.teams["defaultColor"],
    tag: args.replace("/§[1234567890abcdefklmnori]/g", ""),
    description: "",
    inviteOnly: true,
    score: 0,
    level: 1,
    leader: [{
      name: player.name.toLowerCase()
    }],
    pvp: false,
    version: "1.0.2",
    home: {},
    warp: [],
    banned: [],
    members: []
  })
  
  system.run(() => {
    player.nameTag = `§${setting.teams["defaultColor"]}${args.replace("/§[1234567890abcdefklmnori]/g", "")}§r ${player.name}`
  })
  
  player.sendMessage(messageSyntax(messages.create.success))
  await db.store("team", teams)
  updateDisplayTop()
  //return 0
})