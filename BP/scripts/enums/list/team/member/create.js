import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
import "../../../../utilities/updateDisplayTop.js"

enumRegistry(messages.command.create, async (origin, args) => {
  
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${config.commands.namespace}:team ${messages.command.create} ${messages.helpArg.create}`)

  let teams = db.fetch("team", true)
  if(player.hasTeam()) return player.sendMessage(messageSyntax(messages.notInTeam))
  if(config.BedrockTeams.maxTeamLength < args.length) return player.sendMessage(messageSyntax(messages.create.maxLength))
  if(config.BedrockTeams.minTeamLength > args.length) return player.sendMessage(messageSyntax(messages.create.minLength))
  if(config.BedrockTeams.bannedChars.split('').some(char => args.includes(char)) || ![...args].every(char => config.BedrockTeams.allowedChars.includes(char))) return player.sendMessage(messageSyntax(messages.bannedChar))
  if(config.BedrockTeams.blacklist.includes(args)) return player.sendMessage(messageSyntax(messages.create.banned))
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
    color: config.BedrockTeams.defaultColor,
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
    player.nameTag = `§${config.BedrockTeams.defaultColor}${args.replace("/§[1234567890abcdefklmnori]/g", "")}§r ${player.name}`
  })
  
  player.enableTeamPvp(teamGeneratedId)
  player.sendMessage(messageSyntax(messages.create.success))
  await db.store("team", teams)
  updateDisplayTop()
  //return 0
})