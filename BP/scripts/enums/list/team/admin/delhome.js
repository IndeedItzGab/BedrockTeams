import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.delhome, (origin) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isAdmin) return player.sendMessage(messageSyntax(messages.needAdmin))

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(messageSyntax(messages.delhome.noHome))
  team.home = {}
  
  player.sendMessage(messageSyntax(messages.delhome.success))
  db.store("team", teams)
  return 0
})