import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

system.run(() => {
  const teams = db.fetch("team", true)

  if(teams.some(d => d.version !== "1.0.2")) {
    teams.forEach((team, index) => {
      if(teams.version === "1.0.2") return;
      team.id = `team${index + 1}`
      team.leader = !Array.isArray(team.leader) ? [{name: team.leader}] : team.leader
      team.pvp = false
      team.version = "1.0.2"
    })
    db.store("team", teams)
  }
})
