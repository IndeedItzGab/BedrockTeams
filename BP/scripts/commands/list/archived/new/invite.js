import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { config } as from "../../config.js"
const chatName = config.BedrockTeams.chatName


const commandInformation = {
  name: "invite",
  description: "Invite the specified player to the team.",
  aliases: [],
  usage:[
    {
      name: "player",
      type: 5,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayer) => {

  const player = origin.sourceEntity
  const team = player.isLeader()
  if(!team) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`)
  if(team.banned.some(member => member.name === targetPlayer.name.toLowerCase())) return player.sendMessage(`${chatName} §6That player is banned from your team`)
  if(targetPlayer.hasTeam()) return player.sendMessage(`${chatName} §6That player is already in a team`)
  
  targetPlayer.addTag(`teamInvite:${team.name}`)
  targetPlayer.sendMessage(`${chatName} §6You have been invited to join team ${team.name} do §b/team join ${team.name} §6to join the team `)
  player.sendMessage(`${chatName} §6That player has been invited`)
  system.runTimeout(() => {
    if(targetPlayer?.hasTag(`teamInvite:${team.name}`)) return targetPlayer?.sendMessage(`${chatName} §4The invite from §b${team.name} §4has expired`)
  }, 30*20)
  
  return {
    status: 0
  }
})