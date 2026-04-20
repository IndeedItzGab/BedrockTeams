import { system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"

let cooldowns = new Map()
EnumRegistry(messages.command.setwarp, (origin, argsFirst, argsSecond) => {
  const player = origin.sourceEntity
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  if(!argsFirst) return player.sendMessage(`/team ${messages.command.setwarp} ${messages.helpArg.setwarp}`)
  let teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  if(setting.teams(bannedChars).split('').some(char => argsFirst?.includes(char)) || ![...argsFirst].every(char => setting.teams["allowedChars"]?.includes(char))) return player.sendMessage(messageSyntax(messages.setwarp.char))

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(team.warp.some(w => w.name.toLowerCase() === argsFirst?.toLowerCase())) return player.sendMessage(messageSyntax(messages.setwarp.exist))
  if(team.warp.length + 1 > player.teamPerks(team.name).maxWarps) return player.sendMessage(messageSyntax(messages.setwarp.max))
  team.warp.push({
    name: argsFirst.replace("/§[1234567890abcdefklmnori]/g", ""),
    password: argsSecond,
    dimension: player.dimension.id,
    x: player.location.x,
    y: player.location.y,
    z: player.location.z
  })
  
  player.sendMessage(messageSyntax(messages.setwarp.success))
  db.store("team", teams)
  return 0
})