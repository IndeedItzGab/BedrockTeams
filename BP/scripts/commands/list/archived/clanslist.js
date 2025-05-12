import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "clanslist",
  description: "List all existing clan and its leader.",
  aliases: ["clanlist"],
  usage:[]
}

registerCommand(commandInformation, (origin, clanName) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  
  let clans = db.fetch("clan", true)
  let clansList = ""
  clans.forEach(clan => {
    clansList += `\n§e- ${clan.color}${clan.name} §r(${clan.leader})`
  })
  
  player.sendMessage(`§eClans: ${clanslist}`)
  return {
    status: 0
  }
})