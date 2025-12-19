import { Player } from "@minecraft/server"
import * as db from "../../DatabaseHandler.js"
 
Player.prototype.getMembers = function () {
  const teams = db.fetch("teams", true)
  return teams.find(data => data.leader === this.name.toLowerCase() || data?.members?.some(member => member.name === this.name.toLowerCase()))?.members || []
};