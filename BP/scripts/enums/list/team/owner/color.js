import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import "../../../../utilities/chatColor.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry(messages.command.color, (origin, args) => {

  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${config.commands.namespace}:team ${messages.command.color} ${messages.helpArg.color}`)

  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
  if(config.BedrockTeams.bannedColors.split('').some(char => args.includes(char))) return player.sendMessage(messageSyntax(messages.color.banned))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(args.length > 1) {
    if(!chatColor[args.toUpperCase()]) return player.sendMessage(messageSyntax(messages.color.fail))
    team.color = chatColor[args.toUpperCase()]
  } else {
    if(!"1234567890abcdefi".split('').some(d => args.includes(d))) return player.sendMessage(messageSyntax(messages.color.fail))
    team.color = args
  }
  
  team.members.concat(team.leader).forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember ? targetMember.nameTag = `§${team.color}${team.tag}§r ${targetMember.name}` : null
    })
  })

  player.sendMessage(messageSyntax(messages.color.success))
  db.store("team", teams)
  
  return 0
})