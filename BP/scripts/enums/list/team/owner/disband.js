import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("disband", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  

  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You must be the owner of the team to do that`) // Not finished message
  
  
  if(player.hasTag("deleteTeamQuery")) {
    system.run(() => {
      player.nameTag = player.name
      player.removeTag(`deleteTeamQuery`)
      teams.find(d => player.hasTeam()).members.forEach(member => {
        world.getPlayers().find(p => p.name === memver.name)?.checkPvp()
      })
      db.store("team", db.fetch("team", true).filter(data => data.leader !== player.name.toLowerCase()));
      player.sendMessage(`${chatName} §6You have disbanded the team`)
      player.checkPvp()
    })
  } else {
    system.run(() => {
      player.addTag(`deleteTeamQuery`)
      player.sendMessage(`${chatName} §6Type §b/team disband §6again to confirm`)
    })
  }
  
  return 0
})