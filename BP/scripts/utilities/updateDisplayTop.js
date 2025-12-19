import { world, system } from "@minecraft/server"
import * as db from "./DatabaseHandler.js"
import { config } from "../config.js"
import { messages } from "../messages.js"

globalThis.updateDisplayTop = () => {
  if(config.BedrockTeams.displayTopTeams) {
    system.run(async () => {   
      let objectiveData = await world.scoreboard.getObjective("bedrockteams:displayTop")
      objectiveData ? await world.scoreboard.removeObjective("bedrockteams:displayTop") : null
      await world.scoreboard.addObjective("bedrockteams:displayTop", messages.displayTopTeams.header)
      const teams = db.fetch("team", true)
      for(const team of teams) {
        objectiveData.setScore(messages.displayTopTeams.body.replace("{0}", team.color).replace("{1}", team.name).replace("{2}", config.BedrockTeams.levels.filter(d => !d?.price || d.price <= team.score).length), team.score)
      }

      world.scoreboard.setObjectiveAtDisplaySlot("Sidebar", {
        objective: objectiveData,
        sortOrder: 1
      })
    })
  } else {
    system.run(() => world.scoreboard.clearObjectiveAtDisplaySlot("Sidebar"))
  }
}