import { Player } from "@minecraft/server"
import * as db from "../../storage.js"
 

Player.prototype.isAdmin = function () {
  const teams = db.fetch("team", true)
  return teams.some(data => (data.members.some(member => member.name === this.name.toLowerCase() && member.rank === "Admin")) || data.leader === this.name.toLowerCase())
};