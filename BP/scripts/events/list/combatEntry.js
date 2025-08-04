import { world, Player, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"

world.afterEvents.entityHitEntity.subscribe((event) => {
  if(!(event.hitEntity instanceof Player || event.damagingEntity instanceof Player)) return
  
  try {
    
    let combatData = db.fetch("bedrockteams:combatData", true)
    const victimData = combatData.find(d => d.name === event.hitEntity.name)
    const suspectData = combatData.find(d => d.name === event.damagingEntity.name)
    
    !victimData ? 
      combatData.push({ name: event.hitEntity.name, time: system.currentTick + (15*20)}) :
      victimData.time = system.currentTick + (15*20)

    !suspectData ?
      combatData.push({ name: event.damagingEntity.name, time: system.currentTick + (15*20)}) :
      suspectData.time = system.currentTick + (15*20)

    event.hitEntity.addTag("inCombat")
    event.damagingEntity.addTag("inCombat")
    db.store("bedrockteams:combatData", combatData)
  } catch (error) {
    console.error(error)
  } 
})