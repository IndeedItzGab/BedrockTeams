import { Player, system } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.disableTeamPvp = function () {
  system.run(() => {
    const tags = this.getTags().filter(t => t.startsWith("team"))
    tags.forEach(tag => {
      this.removeTag(tag)
    })
  })
};