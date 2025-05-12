import { world } from "@minecraft/server"
import { config } from "../../config.js"

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender
  const team = player.hasTeam()
  const message = event.message
  
  if(!team) {
    if(player.hasTag("chat:team")) return player.removeTag("chat:team")
    return;
  } 
  
  if(player.hasTag("chat:team")) {
    team.members.push({name: team.leader}) // Makes sure owner is included
    team.members.forEach(member => {
      world.getPlayers().find(player => player.name.toLowerCase() === member.name.toLowerCase()).sendMessage(`§b[Team]§r **${player.name}: ${message}`)
    })
    event.cancel = true
  } else {
    const color = !config.BedrockTeams.colorTeamName ? "" : team?.color
    world.sendMessage(`§i[§r§${color}${team?.name}§i]§r <${player.name}> ${message}`)
    event.cancel = true
  }
})