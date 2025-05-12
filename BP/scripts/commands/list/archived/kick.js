import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "kick",
  description: "Kick a member in your clan.",
  aliases: [],
  usage:[
    {
      name: "player",
      type: e,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  if(!player.isLeader()) return player.sendMessage(`§cYou must be a leader of a clan to use this.`)
  
  let clans = db.fetch("clan", true)
  let clan = clans.find(clan => clan.leader === player.name.toLowerCase())
  if(!clan.members.some(member => member.name === targetPlayerName.toLowerCase())) return player.sendMessage(`§c${targetPlayerName} is not a member of this clan.`)
  clan.members = clan.members.filter(member => member.name !== targetPlayerName.toLowerCase())
  
  player.sendMessage(`§a${targetPlayerName} was kicked out of the clan.`)
  db.store("clan", clans)
  return {
    status: 0
  }
})