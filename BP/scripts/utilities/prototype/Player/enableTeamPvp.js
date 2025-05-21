import { Player, system } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.enableTeamPvp = function (id) {
  const team = this.hasTeam()
  const tagId = team?.id || id
  if(tagId) {
    system.run(() => {
      this.addTag(tagId)
    })
  }
};