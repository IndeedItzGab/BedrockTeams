import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const namespace = config.commands.namespace

enumRegistry("delwarp", (origin, args) => {
  const argsFirst = args?.split(" ")[0]
  const argsSecond = args?.split(" ")[1]
  const player = origin.sourceEntity
  if(!argsFirst) return player.sendMessage(`/${namespace}:team setwarp <name> [password]`)
  let teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))

  let team = teams.find(t => t.name === player.hasTeam().name)
  let warp = team.warp.find(w => w.name.toLowerCase() === argsFirst.toLowerCase())
  if(team.warp.length === 0) return player.sendMessage(messageSyntax(messages.warps.none))
  if(!warp) return player.sendMessage(messageSyntax(messages.warp.nowarp))
  if(!player.isLeader() && warp.passwrord !== argsSecond) return player.sendMessage(messageSyntax(messages.warp.invalidPassword))
  
  team.warp = team.warp.filter(warp => warp.name.toLowerCase() !== argsFirst.toLowerCase())
  player.sendMessage(messageSyntax(messages.delwarp.success))
  db.store("team", teams)
  return 0
})