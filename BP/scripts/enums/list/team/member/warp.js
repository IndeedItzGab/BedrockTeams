import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.warp, (origin, argsFirst, argsSecond) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  let warp = team.warp.find(w => w.name.toLowerCase() === argsFirst?.toLowerCase())
  let combatData = db.fetch("bedrockteams:combatData", true).find(d => d.name === player.name)
  
  if(combatData?.time >= system.currentTick) return player.sendMessage(messageSyntax(messages.notAllowedInCombat))
  if(team.warp.length === 0) return player.sendMessage(messageSyntax(messages.warps.none))
  if(!argsFirst) return player.sendMessage(messageSyntax(messages.warps.syntax.replace("{0}", team.warp.map(m => m.name).join(", "))))
  if(!warp) return player.sendMessage(messageSyntax(messages.warp.nowarp))
  if(warp.password !== argsSecond) return player.sendMessage(messages.warp.invalidPassword)
  
  system.run(() => {
    const dimension = world.getDimension(warp.dimension)
    const teleport = player.tryTeleport({x: warp.x, y: warp.y, z: warp.z}, {dimension})
    if(!teleport) return player.sendMessage(`${setting.teams["chatName"]} §4The location of that warp could not be found`)
  })
  player.sendMessage(messageSyntax(messages.warp.success))
  return 0
})