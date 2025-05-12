import { Player } from "@minecraft/server"
import * as db from "../../storage.js"
 
Player.prototype.isLeader = function () {
  const teams = db.fetch("team", true)
  return teams.find(data => data.leader === this.name.toLowerCase())
};