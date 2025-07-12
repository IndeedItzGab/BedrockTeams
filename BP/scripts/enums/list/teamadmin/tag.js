import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("tag", async (origin, args) => {
  const firstArgs = args?.split(" ")[0]
  const secondArgs = args?.split(" ")[1]
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === firstArgs)

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(config.BedrockTeams.blacklist.includes(secondArgs)) return player.sendMessage(messageSyntax(messages.tag.banned))
  if(config.BedrockTeams.bannedChars.split('').some(char => secondArgs.includes(char)) || ![...secondArgs].every(char => config.BedrockTeams.allowedChars.includes(char))) return player.sendMessage(messageSyntax(messages.bannedChar))
  if(config.BedrockTeams.maxTagLength < secondArgs.length) return player.sendMessage(messageSyntax(messages.tag.maxLength))
  
  team.tag = secondArgs.replace("/§[1234567890abcdefklmnori]/g", "")
  const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : team.color
  team.members.concat(team.leader).forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember ? targetMember.nameTag = `§${color}${team.tag}§r ${targetMember.name}` : null
    })
  })
  player.sendMessage(messageSyntax(messages.admin.tag.success))
  db.store("team", teams)
  
  return 0
})