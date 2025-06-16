import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("home", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(messageSyntax(messages.home.noHome))
  
  system.run(() => {
    const dimension = world.getDimension(team.home.dimension)
    player.tryTeleport({x: team.home.x, y: team.home.y, z: team.home.z}, {dimension: dimension})
  })
  
  player.sendMessage(messageSyntax(messages.home.success))
  return 0
})