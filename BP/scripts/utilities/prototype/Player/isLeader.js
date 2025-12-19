import { Player } from "@minecraft/server"
import * as db from "../../DatabaseHandler.js"
 
Player.prototype.isLeader = function () {
  const teams = db.fetch("team", true)
  return teams.find(data => data.leader.some(d => d.name === this.name.toLowerCase()))
};