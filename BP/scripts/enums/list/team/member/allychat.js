import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import "../../../../utilities/chatColor.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.allychat, (origin, args) => {
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
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!setting.teams["allowToggleTeamChat"]) return player.sendMessage(`/team ${messages.command.allychat} ${messages.helpArg.allychat}`)
    const tag = player.hasTag("chat:ally")
    system.run(() => {
      if(tag) {
        player.removeTag("chat:ally")
      } else {
        player.removeTag("chat:team")
        player.addTag("chat:ally")
      }
    })
    player.sendMessage(messageSyntax(tag ? messages.allychat.disabled : messages.allychat.enabled));
  } else {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    const alliances = db.fetch("alliances", true)
    const allyTeams = alliances.filter(d => d.teams.includes(team.name))
    team.members.concat(team.leader).forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", args))
    })
    world.getPlayers().filter(p => p.hasTag("bedrockteams:chatspy")).forEach(p => {
      // Admin chat spy
      p.sendMessage(messages.spy.ally.replace("{0}", setting.teams["chatName"]).replace("{1}", rank + player.name).replace("{2}", args))
    })
    for(const d of teams) {
      if(d.name === team.name || !allyTeams.some(a => a.teams.includes(d.name))) continue;
      d.members.concat(d.leader).forEach(m => {
        world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", args))
      })
    }
  }
  return 0
})