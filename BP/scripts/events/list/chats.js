import { world, system } from "@minecraft/server"
import { config } from "../../config.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/messageSyntax.js"

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender
  const teams = db.fetch("team", true)
  const team = player.hasTeam()
  const message = event.message
  
  if(!team) {
    if(player.hasTag("chat:team")) return player.removeTag("chat:team")
    return;
  } 
  
  if(player.hasTag("chat:team")) {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    team.members.concat(team.leader).forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())?.sendMessage(messages.chat.syntax.replace("{0}", rank + player.name).replace("{1}", message))
    })
    world.getPlayers().filter(p => p.hasTag("bedrockteams:chatspy")).forEach(p => {
      // Admin chat spy
      p.sendMessage(messages.spy.team.replace("{0}", config.BedrockTeams.chatName).replace("{1}", rank + player.name).replace("{2}", message))
    })
  } else if(player.hasTag("chat:ally")) {
    const alliances = db.fetch("alliances", true)
    const allyTeams = alliances.filter(a => a.teams.includes(team.name))
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    team.members.concat(team.leader).forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", message))
    })
    world.getPlayers().filter(p => p.hasTag("bedrockteams:chatspy")).forEach(p => {
      // Admin chat spy
      p.sendMessage(messages.spy.ally.replace("{0}", config.BedrockTeams.chatName).replace("{1}", rank + player.name).replace("{2}", message))
    })
    for(const d of teams) {
      if(d.name === team.name || !allyTeams.some(a => a.teams.includes(d.name))) continue;
      d.members.concat(d.leader).forEach(m => {
        world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", message))
      })
    }
  } else {
    const color = !config.BedrockTeams.colorTeamName ? "" : team?.color
    world.sendMessage(`§i[§r§${color}${team?.name}§i]§r <${player.name}> ${message}`)
    system.run(() => system.sendScriptEvent("discordcc:sendChat", JSON.stringify({message: {content: message}, username: `[${team?.name}] ${player.name}`})))
  }
  event.cancel = true
})