import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"

import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.leave, async (origin, args) => {
  const player = origin.sourceEntity
  const teams = db.fetch("team", true)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(player.isLeader() && team.leader.length === 1) return player.sendMessage(messageSyntax(messages.leave.lastOwner))
  
  if(player.isLeader()) {
    team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase())
  } else {
    team.members = team.members.filter(member => member.name !== player.name.toLowerCase())
  }
  
  system.run(() => {
    player.nameTag = player.name
  })
  
  // Global Announcement
  if(setting.teams["announceTeamLeave"]) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.leave.replace("{0}", player.name).replace("{1}", specifiedTeam.name)))
    })
  }
  
  player.sendMessage(messageSyntax(messages.leave.success))
  await db.store("team", teams)
  return 0
})