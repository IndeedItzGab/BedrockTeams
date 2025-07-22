import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.tag, (origin, args) => {
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${config.commands.namespace}:team ${messages.command.tag} ${messages.helpArg.tag}`)

  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.tag.noPerm))
  if(config.BedrockTeams.blacklist.includes(args)) return player.sendMessage(messageSyntax(messages.tag.banned))
  if(config.BedrockTeams.bannedChars.split('').some(char => args.includes(char)) || ![...args].every(char => config.BedrockTeams.allowedChars.includes(char))) return player.sendMessage(messageSyntax(messages.bannedChar))
  if(config.BedrockTeams.maxTagLength < args.length) return player.sendMessage(messageSyntax(messages.tag.maxLength))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  team.tag = args.replace("/§[1234567890abcdefklmnori]/g", "")
  const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : team.color
  team.members.concat(team.leader).forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember ? targetMember.nameTag = `§${color}${team.tag}§r ${targetMember.name}` : null
    })
  })
  player.sendMessage(messageSyntax(messages.tag.success))
  db.store("team", teams)
  return 0
})