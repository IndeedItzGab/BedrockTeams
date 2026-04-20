import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.list, (origin) => {
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
  let message = messageSyntax(messages.list.header)
  let count = 1
  teams.forEach(team => {
    message += `\n${messageSyntax(messages.list.body.replace("{0}", count).replace("{1}", team.name))}`
    count++
  })
  
  player.sendMessage(message)
  return 0
})