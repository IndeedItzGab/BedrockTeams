import { world } from "@minecraft/server"
import { config } from "../../config.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const team = event.player.hasTeam()
  if(!team) return;
  const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : team.color
  
  event.player.nameTag = `§${team.color}${team.tag}§r ${event.player.name}`
})