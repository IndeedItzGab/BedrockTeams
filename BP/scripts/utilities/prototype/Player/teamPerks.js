import { Player } from "@minecraft/server"
import * as db from "../../DatabaseHandler.js"
 
 /**
 * Checks if the player is in a crawling state based on the distance between their head location and feet location.
 * @return {boolean} true if the player is crawling, false otherwise
 */
Player.prototype.teamPerks = function (teamName) {
  const setting = db.fetch("bedrockteams:setting")
  const teams = db.fetch("team", true)
  const team = teams.find(data => data.name === teamName) || teams.find(data => data.leader.some(d => d.name === this.name.toLowerCase()) || data?.members?.some(member => member.name === this?.name.toLowerCase()))
  return setting.teams["levels"]
  .filter(d => !d?.price || d.price <= team.score)
  .pop();
};