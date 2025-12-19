import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.pvp, (origin) => {
  const player = origin.sourceEntity
  const teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  team.pvp = !team.pvp
  
  const message = team.pvp ? messageSyntax(messages.pvp.enabled) : messageSyntax(messages.pvp.disabled)
  player.sendMessage(message)
  db.store("team", teams)
  return 0
})