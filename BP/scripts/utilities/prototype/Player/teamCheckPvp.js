import { Player, system } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.teamCheckPvp = function () {
  const team = this.hasTeam()
  if(!team) {
    const tags = this.getTags().filter(d => d.startsWith("team"))
    system.run(() => {
      tags.forEach(tag => {
        this.removeTag(tag)
      })
    })
    return;
  };
  system.run(() => {
    const tags = this.getTags().filter(d => d.startsWith("team"))
    tags.forEach(tag => {
      if(tag !== team.id) this.removeTag(tag); // Added to prevent multiple team tags and bugs
    })
    team.pvp ? this.removeTag(team.id) : this.addTag(team.id)
  })
};