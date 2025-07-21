import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("description", async (origin, args) => {
  const firstArgs = args[0]
  const secondArgs = args[1]
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === firstArgs)

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(!secondArgs) {
    if(!team?.description) return player.sendMessage(messageSyntax(messages.description.noDesc))
    return player.sendMessage(messageSyntax(messages.description.view.replace("{0}", team?.description)))
  }

  team.description = secondArgs

  player.sendMessage(messageSyntax(messages.admin.description.success))
  db.store("team", teams)

  return 0
})