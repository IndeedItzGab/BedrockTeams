import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"
import { TagHandler } from "../../utilities/TagHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const team = event.player.hasTeam()
  if(!team) {
    TagHandler.remove(event.player.id)
    return;
  };

  const setting = db.fetch("bedrockteams:setting")
  const color = setting.teams["colorTeamName"] ? setting.teams["defaultColor"] : team.color
  TagHandler.add(event.player.id, `§${color}${team.tag}§r`)
})