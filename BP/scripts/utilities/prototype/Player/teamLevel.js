import { Player } from "@minecraft/server"
import { config } from "../../../config.js"
import * as db from "../../storage.js"
 
 /**
 * Checks if the player is in a crawling state based on the distance between their head location and feet location.
 * @return {boolean} true if the player is crawling, false otherwise
 */
Player.prototype.teamLevel = function (teamName) {
  const teams = db.fetch("team", true)
  const team = teams.find(data => data.name === teamName) || teams.find(data => data.leader.some(d => d.name === this.name.toLowerCase()) || data?.members?.some(member => member.name === this?.name.toLowerCase()))
  return config.BedrockTeams.newLevelsFormat
  .filter(d => !d?.price || d.price <= team.score).length
};