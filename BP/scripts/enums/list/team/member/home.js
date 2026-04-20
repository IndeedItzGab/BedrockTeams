import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.home, (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  let combatData = db.fetch("bedrockteams:combatData", true).find(d => d.name === player.name)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))   
  if(combatData?.time >= system.currentTick) return player.sendMessage(messageSyntax(messages.notAllowedInCombat))

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(messageSyntax(messages.home.noHome))
  
  system.run(() => {
    const dimension = world.getDimension(team.home.dimension)
    player.tryTeleport({x: team.home.x, y: team.home.y, z: team.home.z}, {dimension: dimension})
  })
  
  player.sendMessage(messageSyntax(messages.home.success))
  return 0
})