import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.description, async (origin, firstArgs, secondArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  if(!firstArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.description} ${messages.helpArg.admin.description}`))
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