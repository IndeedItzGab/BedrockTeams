import { Player, system } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.checkPvp = function () {
  const team = this.hasTeam()
  if(!team) return;
  system.run(() => {
    team.pvp ? this.removeTag(team.id) : this.addTag(team.id)
  })
};