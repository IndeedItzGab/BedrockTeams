import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.delwarp, (origin, argsFirst, argsSecond) => {
  const player = origin.sourceEntity
  if(!argsFirst) return player.sendMessage(`/team ${messages.command.delwarp} ${messages.helpArg.delwarp}`)
  let teams = db.fetch("team", true)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

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