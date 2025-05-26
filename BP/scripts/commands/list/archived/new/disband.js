import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { config } as from "../../config.js"
const chatName = config.BedrockTeams.chatName


const commandInformation = {
  name: "disband",
  description: "Forces all members of the team to leave.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {

  const player = origin.sourceEntity
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You must be the owner of the team to do that`) // Not finished message
  if(player.hasTag("deleteTeamQuery")) {
    system.run(() => {
      player.removeTag(`deleteTeamQuery`)
      db.store("team", db.fetch("team", true).filter(data => !data.leader.some(l => l.name === player.name.toLowerCase())));
      player.sendMessage(`${chatName} You have disbanded the team`)
    })
  } else {
    system.run(() => {
      player.addTag(`deleteTeamQuery`)
      player.sendMessage(`${chatName} §6Type §b/team:disband §6again to confirm`)
    })
  }
  
  return {
    status: 0
  }
})