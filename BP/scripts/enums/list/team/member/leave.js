import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("leave", async (origin, args) => {
  const player = origin.sourceEntity
  const teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(player.isLeader() && team.leader.length === 1) return player.sendMessage(messageSyntax(messages.leave.lastOwner))
  
  if(player.isLeader()) {
    team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase())
  } else {
    team.members = team.members.filter(member => member.name !== player.name.toLowerCase())
  }
  
  system.run(() => {
    player.nameTag = player.name
  })
  
  // Global Announcement
  if(config.BedrockTeams.announceTeamLeave) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.leave.replace("{0}", player.name).replace("{1}", specifiedTeam.name)))
    })
  }
  
  player.sendMessage(messageSyntax(messages.leave.success))
  await db.store("team", teams)
  player.disableTeamPvp()
  player.allyCheckPvp()
  return 0
})