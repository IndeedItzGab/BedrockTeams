import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.description, (origin, args) => {
    
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === player.hasTeam().name)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.description.noPerm))
  
  if(!args) {
    if(!team?.description) return player.sendMessage(messageSyntax(messages.description.noDesc))
    return player.sendMessage(messageSyntax(messages.description.view.replace("{0}", team?.description)))
  }
  
  team.description = args
  
  player.sendMessage(messageSyntax(messages.description.success))
  db.store("team", teams)
  return 0
})