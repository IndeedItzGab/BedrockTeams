import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("sethome", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.sethome.noPerm))

  let team = teams.find(t => t.name === player.hasTeam().name)
  team.home = {
    dimension: player.dimension.id,
    x: player.location.x,
    y: player.location.y,
    z: player.location.z
  }
  
  player.sendMessage(messageSyntax(messages.sethome.success))
  db.store("team", teams)
  return 0
})