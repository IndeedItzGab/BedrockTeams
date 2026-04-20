import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.open, (origin) => {
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
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  if(team.inviteOnly) {
    team.inviteOnly = false
    player.sendMessage(messageSyntax(messages.open.successopen))
  } else {
    team.inviteOnly = true
    player.sendMessage(messageSyntax(messages.open.successclose))
  }
  db.store("team", teams)
  
  return 0
})