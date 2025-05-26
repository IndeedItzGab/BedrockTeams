import { Player } from "@minecraft/server"
import * as db from "../../storage.js"
 
 /**
 * Checks if the player is in a crawling state based on the distance between their head location and feet location.
 * @return {boolean} true if the player is crawling, false otherwise
 */
Player.prototype.hasTeam = function () {
  const teams = db.fetch("team", true)
  return teams.find(data => data.leader.some(d => d.name === this.name.toLowerCase()) || data?.members?.some(member => member.name === this?.name.toLowerCase()))
};