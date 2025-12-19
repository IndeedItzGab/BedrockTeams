import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.home, async (origin, firstArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  if(!firstArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.home} ${messages.helpArg.admin.home}`))

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