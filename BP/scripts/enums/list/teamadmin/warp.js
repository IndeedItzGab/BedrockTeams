import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("warp", async (origin, args) => {
  const firstArgs = args?.split(" ")[0]
  const secondArgs = args?.split(" ")[1]
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  
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