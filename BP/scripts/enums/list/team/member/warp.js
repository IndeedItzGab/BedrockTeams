import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const namespace = config.commands.namespace
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("warp", (origin, argsFirst, argsSecond) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  let warp = team.warp.find(w => w.name.toLowerCase() === argsFirst?.toLowerCase())
  if(team.warp.length === 0) return player.sendMessage(`${chatName} §4Your team has no warps set`)
  if(!argsFirst) return player.sendMessage(`${chatName} §6Warps: §b${team.warp.map(m => m.name).join(", ")}`)
  if(!warp) return player.sendMessage(`${chatName} §4That warp does not exist`)
  if(warp.password !== argsSecond) return player.sendMessage(`${chatName} §4Invalid password for that warp`)
  
  system.run(() => {
    const dimension = world.getDimension(warp.dimension)
    const teleport = player.tryTeleport({x: warp.x, y: warp.y, z: warp.z}, {dimension})
    if(!teleport) return player.sendMessage(`${chatName} §4The location of that warp could not be found`)
  })
  player.sendMessage(`${chatName} §6You have been teleported`)
  return 0
})