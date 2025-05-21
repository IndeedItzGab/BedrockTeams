import { Player, system } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.checkPvp = function () {
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
    team.pvp ? this.removeTag(team.id) : this.addTag(team.id)
  })
};