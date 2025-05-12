import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "transfer",
  description: "Transfer the leadership of your clan to a clan member.",
  aliases: [],
  usage:[
    {
      name: "player",
      type: 3,
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
  if(!clan.members.some(memmber => member.name === targetPlayerName.toLowerCase())) return player.sendMessage(`§c${targetPlayerName} is not a member of this clan to transfer the leadership.`)
  clan.leader = targetPlayerName.toLowerCase()
  clan.members = clan.members.filter(member => member.name !== targetPlayerName.toLowerCase())
  clan.members.push({
    name: player.name.toLowerCase()
  })
  
  player.sendMessage(`§aLeadership of ${clan.color}${clan.name}§r was transfered to ${targetPlayerName}.`)
  db.store("clan", clans)
  return {
    status: 0
  }
})