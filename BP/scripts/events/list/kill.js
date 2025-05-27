import { world, system, Player } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import { config } from "../../config.js"

world.afterEvents.entityDie.subscribe((event) => {
  if(!(event.damageSource.damagingEntity instanceof Player) || !(event.deadEntity instanceof Player)) return;

  const suspect = event.damageSource.damagingEntity
  const victim = event.deadEntity
  const deathTag = victim.getTags().find(d => d.includes("death:"))
  const killTag = suspect.getTags().find(d => d.includes("kill:"))
  
  let teams = db.fetch("team", true)
  let suspectTeam = teams.find(d => d.name === suspect.hasTeam()?.name)
  let victimTeam = teams.find(d => d.name === victim.hasTeam()?.name)
  
  // Responsible for scoring
  if(suspectTeam?.name === victimTeam?.name) return; // Avoid score farming if both are in the same team
  suspectTeam ? suspectTeam.score = Math.max(config.BedrockTeams.minScore, suspectTeam.score + config.BedrockTeams.events.kill.score) : null
  victimTeam ? victimTeam.score = Math.max(config.BedrockTeams.minScore, victimTeam.score + config.BedrockTeams.events.death.score) : null
  
  // Check victim death time status if they have.
  if(deathTag) {
    // Spam Death-Detector
    if(parseInt(deathTag.split(":")[2]) >= system.currentTick) {
      victimTeam ? victimTeam.score = Math.max(config.BedrockTeams.minScore, victimTeam.score + config.BedrockTeams.events.death.spam) : null
    }
    
    system.run(() => {
      victim.removeTag(deathTag)
      victim.addTag(`bedrockteams:death:${system.currentTick + (60*20)}`)
    })
  } else {
    system.run(() => {
      victim.addTag(`bedrockteams:death:${system.currentTick + (60*20)}`)
    })
  }
  
  // Check suspect kill time status if they have.
  if(killTag) {
    // Spam Kill-Detector
    if(parseInt(killTag.split(":")[2]) >= system.currentTick) {
      suspectTeam ? suspectTeam.score = Math.max(config.BedrockTeams.minScore, suspectTeam.score + config.BedrockTeams.events.kill.spam) : null
    }
    
    system.run(() => {
      suspect.removeTag(killTag)
      suspect.addTag(`bedrockteams:kill:${system.currentTick + (60*20)}`)
    })
  } else {
    system.run(() => {
      suspect.addTag(`bedrockteams:kill:${system.currentTick + (60*20)}`)
    })
  }
  
  db.store("team", teams)
})