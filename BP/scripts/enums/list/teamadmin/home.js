import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("home", async (origin, firstArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1


  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === firstArgs)

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(messageSyntax(messages.admin.home.noHome))

  system.run(() => {
    const dimension = world.getDimension(team.home.dimension)
    player.tryTeleport({x: team.home.x, y: team.home.y, z: team.home.z}, {dimension: dimension})
  })
  
  player.sendMessage(messageSyntax(messages.admin.home.success))

  
  return 0
})