import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const namespace = config.commands.namespace
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("description", (origin, args) => {
    
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === player.hasTeam().name)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.description.noPerm))
  
  if(!args) {
    if(!team?.description) return player.sendMessage(messageSyntax(messages.description.noDesc))
    return player.sendMessage(messageSyntax(messages.description.view.replace("{0}", team?.description)))
  }
  
  team.description = args
  
  player.sendMessage(messageSyntax(messages.description.success))
  db.store("team", teams)
  return 0
})