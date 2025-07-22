import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.delwarp, async (origin, firstArgs, secondArgs) => {

  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  
  if(!firstArgs || !secondArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.delwarp} ${messages.helpArg.admin.delwarp}`))
  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === firstArgs)

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(team.warp.length === 0) return player.sendMessage(messageSyntax(messages.warps.none))
  if(!team.warp.some(w => w.name.toLowerCase() === secondArgs.toLowerCase())) return player.sendMessage(messageSyntax(messages.warp.nowarp))
  
  team.warp = team.warp.filter(warp => warp.name.toLowerCase() !== secondArgs.toLowerCase())
  player.sendMessage(messageSyntax(messages.delwarp.success))
  db.store("team", teams)

  return 0
})