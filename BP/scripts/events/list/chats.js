import { world } from "@minecraft/server"
import { config } from "../../config.js"
import { messages } from "../../messages.js"
import "../../utilities/messageSyntax.js"

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender
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
  } else {
    const color = !config.BedrockTeams.colorTeamName ? "" : team?.color
    world.sendMessage(`§i[§r§${color}${team?.name}§i]§r <${player.name}> ${message}`)
  }
  event.cancel = true
})