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
    return player.sendMessage(`§c${messages.cooldown.wait?.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!setting.teams["allowToggleTeamChat"]) return player.sendMessage(`/team ${messages.command.allychat} ${messages.helpArg.allychat}`)
    const mode = player.getDynamiProperty("bedrockteams:chatMode") === "ally"
    if(mode) {
      player.setDynamicProperty("bedrockteams:chatMode", null)
    } else {
      player.setDynamicProperty("bedrockteams:chatMode", "ally")
    }

    player.sendMessage(messageSyntax(mode ? messages.allychat.disabled : messages.allychat.enabled));
  } else {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    const alliances = db.fetch("alliances", true)
    const allyTeams = alliances.filter(d => d.teams.includes(team.name))

    for(const member of team.members.concat(team.leader)) {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", args))
    }

    for(const admin of world.getPlayers().filter(p => p.getDynamicProperty("bedrockteams:chatspy"))) {
      admin.sendMessage(messages.spy.ally.replace("{0}", setting.teams["chatName"]).replace("{1}", rank + player.name).replace("{2}", args))
    }

    for(const d of teams) {
      if(d.name === team.name || !allyTeams.some(a => a.teams.includes(d.name))) continue;
      for(const member of d.members.concat(d.leader)) {
        world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", args))
      }
    }
  }
  return 0
})