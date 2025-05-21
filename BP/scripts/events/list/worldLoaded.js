import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"

system.run(() => {
  const teams = db.fetch("team", true)

  if(teams.some(d => d.version !== "1.0.1")) {
    teams.forEach((team, index) => {
      team.id = `team${index + 1}`
      team.pvp = false
      team.version = "1.0.1"
    })
    db.store("team", teams)
  }
})
