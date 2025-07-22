import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"
import "../../../utilities/updateDisplayTop.js"

enumAdminRegistry(messages.command.create, async (origin, args) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  
  if(!args) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.create} ${messages.helpArg.admin.create}`))
  let teams = db.fetch("team", true)
  
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
    leader: [],
    pvp: false,
    version: "1.0.2",
    home: {},
    warp: [],
    banned: [],
    members: []
  })

  await db.store("team", teams)
  updateDisplayTop()
  player.sendMessage(messageSyntax(messages.admin.create.success))
  return 0
})