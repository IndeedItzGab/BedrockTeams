import { Player } from "@minecraft/server"
import * as db from "../../DatabaseHandler.js"
 

Player.prototype.isAdmin = function () {
  const teams = db.fetch("team", true)
  return teams.some(data => (data.members.some(member => member.name === this.name.toLowerCase() && member.rank === "admin")) || data.leader.some(l => l.name === this.name.toLowerCase()))
};