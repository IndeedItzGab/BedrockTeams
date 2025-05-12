import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "memberslist",
  description: "List all members of your clan or specified clan clan.",
  aliases: ["memberlist"],
  usage:[
    {
      name: "clan",
      type: 3,
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, clanName) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  
  if(!player.hasClan() && !clanName) return player.sendMessage(`§cYou are not in a clan, so include a clan name to view it's members.`)
  let clans = db.fetch("clan", true)
  let clan = clans.find(clan => clan.name === clanName || clan.name === player.hasClan().name)
  let members = `${clan.leader} (Leader)`
  clan.members.forEach(member => {
    members += `, ${member.name}`
  })
  
  player.sendMessage(`§e${clan.color}${clan.name}§e's clan members: ${members}`)
  return {
    status: 0
  }
})