import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "leave",
  description: "If you are currently in a clan, uing this will get you remove from it.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin, args1) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  if(player.isLeader()) return player.sendMessage(`§cYou cannot leave in your own clan. Consider using /clan:transfer to transfer it to another player.`)
  if(!player.hasClan()) return player.sendMessage(`§cYou are currently not in a clan to use this.`)
  
  let clans = db.fetch("clan", true)
  let clan = clans.find(clan => clan.name === player.hasClan()?.name)
  clan.members = clan.members.filter(member => member.name !== player.name.toLowerCase())
  
  player.sendMessage(`§aYou have left in the clan.`)
  db.store("clan", clans)
  return {
    status: 0
  }
})