import { world } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player
  let teamPlayerList = db.fetch("teamPlayerList", true)
  if(!teamPlayerList.some(p => p.name.toLowerCase() === player.name.toLowerCase())) {
    teamPlayerList.push({
      name: player.name.toLowerCase()
    })
    db.store("teamPlayerList", teamPlayerList)
  }
})