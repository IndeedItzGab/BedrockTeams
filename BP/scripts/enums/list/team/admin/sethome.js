import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("sethome", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isAdmin) return player.sendMessage(`${chatName} §6Your are not a high enough rank to set your team home`) // Not finished message

  let team = teams.find(t => t.name === player.hasTeam().name)
  team.home = {
    dimension: player.dimension.id,
    x: player.location.x,
    y: player.location.y,
    z: player.location.z
  }
  
  player.sendMessage(`${chatName} §6Your team home has been set`)
  db.store("team", teams)
  return 0
})