import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.top, (origin) => {
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
  
  player.sendMessage(messageSyntax(messages.loading))
  let message = messageSyntax(messages.top.leaderboard)
  let count = 1
  teams.sort((a, b) => b.score - a.score)
  teams.forEach(team => {
    message += `\n${messageSyntax(messages.top.syntax.replace("{0}", count).replace("{1}", team.name).replace("{2}", team.score))}`
    count++
  })
  
  player.sendMessage(message)
  return 0
})