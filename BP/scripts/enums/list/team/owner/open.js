import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry(messages.command.open, (origin) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  if(team.inviteOnly) {
    team.inviteOnly = false
    player.sendMessage(messageSyntax(messages.open.successopen))
  } else {
    team.inviteOnly = true
    player.sendMessage(messageSyntax(messages.open.successclose))
  }
  db.store("team", teams)
  
  return 0
})