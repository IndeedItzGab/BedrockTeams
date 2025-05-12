import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("home", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(`${chatName} §6Your team has not set a home`)
  
  system.run(() => {
    const teleport = player.tryTeleport({x: team.home.x, y: team.home.y, z: team.home.z}, {dimension: team.dimension})
    if(!teleport) return player.sendMessage(`${chatName} §4Your team home could not be found`)
  })
  player.sendMessage(`${chatName} §6You have been teleported`)
  return 0
})