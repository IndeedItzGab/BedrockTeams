import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const namespace = config.commands.namespace
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("warp", (origin, args) => {
  const argsFirst = args?.split(" ")[0]
  const argsSecond = args?.split(" ")[1]
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  let warp = team.warp.find(w => w.name.toLowerCase() === argsFirst?.toLowerCase())
  if(team.warp.length === 0) return player.sendMessage(messageSyntax(messages.warps.none))
  if(!argsFirst) return player.sendMessage(messageSyntax(messages.warps.syntax.replace("{0}", team.warp.map(m => m.name).join(", "))))
  if(!warp) return player.sendMessage(messageSyntax(messages.warp.nowarp))
  if(warp.password !== argsSecond) return player.sendMessage(messages.warp.invalidPassword)
  
  system.run(() => {
    const dimension = world.getDimension(warp.dimension)
    const teleport = player.tryTeleport({x: warp.x, y: warp.y, z: warp.z}, {dimension})
    if(!teleport) return player.sendMessage(`${chatName} §4The location of that warp could not be found`)
  })
  player.sendMessage(messageSyntax(messages.warp.success))
  return 0
})