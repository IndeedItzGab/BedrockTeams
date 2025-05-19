import { Player } from "@minecraft/server"

Player.prototype.isAdministrator = function () {
  return this.getTags().some(tag => tag.toLowerCase() === "admin")
};