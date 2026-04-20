import { world } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const team = event.player.hasTeam()
  if(!team) return;
  const setting = db.fetch("bedrockteams:setting")
  const color = setting.teams["colorTeamName"] ? setting.teams["defaulColor"] : team.color
  
  event.player.nameTag = `§${color}${team.tag}§r ${event.player.name}`
})