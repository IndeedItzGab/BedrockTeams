import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("delhome", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isAdmin) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`) // Not finished message

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(`${chatName} §4Your team has not set a home`)
  team.home = {}
  
  player.sendMessage(`${chatName} §6Your team home has been deleted`)
  db.store("team", teams)
  return 0
})