import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const namespace = config.commands.namespace
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("description", (origin, args) => {
    
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${namespace}:team description <string>`)

  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You do not have permission to edit the description`) // Not finished message
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  team.description = args
  
  player.sendMessage(`${chatName} §6You have changed the team description`)
  db.store("team", teams)
  return 0
})