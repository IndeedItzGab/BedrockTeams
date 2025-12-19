import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.warp, async (origin, firstArgs, secondArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  
  if(!firstArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.warp} ${messages.helpArg.admin.warp}`))

  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === firstArgs)
  let warp = team?.warp?.find(w => w.name.toLowerCase() === secondArgs?.toLowerCase())

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(team.warp.length === 0) return player.sendMessage(messageSyntax(messages.admin.warps.none))
  if(!secondArgs) return player.sendMessage(messageSyntax(messages.warps.syntax.replace("{0}", team.warp.map(m => m.name).join(", "))))
  if(!warp) return player.sendMessage(messageSyntax(messages.warp.nowarp))

  system.run(() => {
    const dimension = world.getDimension(warp.dimension)
    const teleport = player.tryTeleport({x: warp.x, y: warp.y, z: warp.z}, {dimension})
    if(!teleport) return player.sendMessage(`${chatName} §4The location of that warp could not be found`)
  })
  player.sendMessage(messageSyntax(messages.warp.success))
  return 0
})