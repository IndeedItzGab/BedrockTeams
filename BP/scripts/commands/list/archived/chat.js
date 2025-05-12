import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "chat",
  description: "Send a message that can only be seen by your clan members.",
  aliases: [],
  usage:[
    {
      name: "message",
      type: 3,
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, message) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  if(!player.hasClan()) return player.sendMessage(`§cYou are currently not in clan.`)
  const clan = db.fetch("clan", true).find(clan => clan.name === player.hasTag().name)
  if(message) {
    clan.members.forEach(member => {
      world.getPlayers().find(player => player.name.toLowerCase() === member.name.toLowerCase()).sendMessage(`§iCLAN - [§r${clan.color}${clan.chat}§i]§r <${player.name}> ${message}`)
    })
  } else {
    if(!player.hasTag("chat:clan")) {
      player.addTag("chat:clan")
      player.sendMessage(`§aYou have switched to clan chat channel. You can still receive chats from others whose not a member of the clan.`)
    } else {
      player.removeTag("chat:clan")
      player.sendMessage(`§aYou have switched back to everyone channel. Your messages can now be seen by non-members of the clan.`)
    }
  }
  
  return {
    status: 0
  }
})