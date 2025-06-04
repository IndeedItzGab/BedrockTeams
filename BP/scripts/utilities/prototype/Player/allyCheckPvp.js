import { Player, system } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.allyCheckPvp = function (action, specifiedAllyTag) {
  const alliances = db.fetch("alliences", true)
  const team = this.hasTeam()
  
  // Manual actions
  if(action === 1) {
    system.run(() => this.addTag(specifiedAllyTag))
    return;
  } else if(action === 0) {
    system.run(() => this.removeTag(specifiedAllyTag))
    return;
  }
  
  // Responsible for automatically detecting whether the player's team has an ally or not
  const allyTags = this.getTags().filter(t => t.startsWith("ally"))
  const currentAlly = alliances.filter(d => d.teams.includes(team.name))
  
  for(const tag of allyTags) {
    if(currentAlly.some(a => a.allyTag === tag)) {
      system.run(() => this.addTag(tag))
    } else {
      system.run(() => this.removeTag(tag))
    }
  }
};