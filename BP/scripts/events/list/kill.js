import { world, system } from "@minecraft/server"
import { config } from "../../config.js"

world.afterEvents.entityDie.subscribe((event) => {
  if(event.damageSource.damagingEntity.typeId !== "minecraft:player" || event.deadEntity.typeId !== "minecraft:player") return;

  const suspect = event.damageSource.damagingEntity
  const victim = event.deadEntity
  const deathTag = victim.getTags().find(d => d.includes("death:"))
  const killTag = suspect.getTags().find(d => d.includes("kill:"))
  
  let teams = db.fetch("team", true)
  let suspectTeam = teams.find(d => d.name === suspect.hasTeam().name)
  let victimTeam = teams.find(d => d.name === victim.hasTeam().name)
  
  // Responsible for scoring
  if(suspectTeam.name === victimTeam.name) return; // Avoid score farming if both are in the same team
  suspectTeam.score += config.BedrockTeams.events.kill.score
  victimTeam.score += confif.BedrockTeams.events.death.score
  
  // Check victim death time status if they have.
  if(deathTag) {
    // Spam Death-Detector
    if(parseInt(deathTag.split(":")[1]) >= system.currentTick) {
      victimTeam.score += config.BedrockTeams.events.death.spam
    }
    
    system.run(() => {
      victim.removeTag(deathTag)
      victim.addTag(`death:${system.currentTick + (60*20)}`)
    })
  } else {
    system.run(() => {
      victim.addTag(`death:${system.currentTick + (60*20)}`)
    })
  }
  
  // Check suspect kill time status if they have.
  if(killTag) {
    // Spam Death-Detector
    if(parseInt(killTag.split(":")[1]) >= system.currentTick) {
      suspectTeam.score += config.BedrockTeams.events.kill.spam
    }
    
    system.run(() => {
      suspect.removeTag(killTag)
      suspect.addTag(`kill:${system.currentTick + (60*20)}`)
    })
  } else {
    system.run(() => {
      suspect.addTag(`kill:${system.currentTick + (60*20)}`)
    })
  }
})