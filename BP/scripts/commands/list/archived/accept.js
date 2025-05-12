import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "accept",
  description: "Accept an ongoing invitation from other clan leaders.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  const clanTag = player.getTags().find(tag => tag.includes("clanInvite:"))
  if(!clanTag) return player.sendMessage(`§cYou have no clan invitation.`)

  let clans = db.fetch("clan", true)
  let clan = clans.find(clan => clan.name === clanTag.replace("clanInvite:", ''))
  clan.members.push({
    name: player.name.toLowerCase()
  })
  
  player.sendMessage(`§aYou have accepted the clan invitation. You are now a member of a clan.`)
  db.store("clan", clans)
  return {
    status: 0
  }
})