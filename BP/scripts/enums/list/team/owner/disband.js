import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("disband", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
 
  
  if(player.hasTag("deleteTeamQuery")) {
    system.run(() => {
      player.nameTag = player.name
      player.removeTag(`deleteTeamQuery`)
      const team = teams.find(d => d.leader.some(l => l.name === player.name.toLowerCase()))
      team.members.concat(team.leader).forEach(member => {
        const p = world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())
        p ? p.disableTeamPvp() : null
        p ? p.nameTag = p.name : null
      })
      
      // Global Announcement
      if(config.BedrockTeams.announceTeamDisband) {
        world.getPlayers().forEach(p => {
          p.sendMessage(messageSyntax(messages.announce.disband.replace("{0}", team.name)))
        })
      }
  
      db.store("team", teams.filter(t => t.name !== player.hasTeam().name))
      player.sendMessage(messageSyntax(messages.disband.success))
    })
  } else {
    system.run(() => {
      player.addTag(`deleteTeamQuery`)
      player.sendMessage(messageSyntax(messages.disband.confirm))
    })
  }
  
  return 0
})