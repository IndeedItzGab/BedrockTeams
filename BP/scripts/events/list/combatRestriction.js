import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.beforeEvents.entityHurt.subscribe((event) => {
  if(event.damageSource.damagingEntity?.typeId === "minecraft:player" && event.hurtEntity?.typeId === "minecraft:player") {
    try {
      // PvP/Ally PvP restriction
      const alliances = db.fetch("alliances", true)
      const attacker = event.damageSource.damagingEntity.hasTeam()?.name;
      const victim = event.hurtEntity.hasTeam()?.name;

      if(victim === attacker || alliances.some(a => a.teams.includes(victim) && a.teams.includes(attacker))) {
        if(victim === attacker && db.fetch("team").find(t => t.name === attacker).pvp) return;
        event.cancel = true
      }

      // Combat Logger
      let combatData = db.fetch("bedrockteams:combatData", true)
      const victimData = combatData.find(d => d.name === event.hurtEntity.name)
      const suspectData = combatData.find(d => d.name === event.damageSource.damagingEntity.name)
      
      !victimData ? 
        combatData.push({ name: event.hurtEntity.name, time: system.currentTick + (15*20)}) :
        victimData.time = system.currentTick + (15*20)

      !suspectData ?
        combatData.push({ name: event.damageSource.damagingEntity.name, time: system.currentTick + (15*20)}) :
        suspectData.time = system.currentTick + (15*20)

      db.store("bedrockteams:combatData", combatData)
    } catch (error) {
      console.error(error)
    }
    
  }
})