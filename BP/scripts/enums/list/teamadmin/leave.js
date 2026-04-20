import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../EnumRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.leave, async (origin, firstArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  if(!firstArgs) return player.sendMessage(messageSyntax(`/teamadmin ${messages.command.leave} ${messages.helpArg.admin.leave}`))

  const teams = db.fetch("team", true)
  const team = teams.find(team => team.members.some(member => member.name.toLowerCase() === firstArgs.toLowerCase()) || team.leader.some(leader => leader.name.toLowerCase() === firstArgs.toLowerCase()))
  const targetPlayer = world.getPlayers().find(p => p.name.toLowerCase() === firstArgs.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name?.toLowerCase() === firstArgs?.toLowerCase())

  if(!playerExist) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(!team) return player.sendMessage(messageSyntax(messages.admin.inTeam))

  if(player.isLeader()) {
    team.leader = team.leader.filter(l => l.name !== firstArgs.toLowerCase())
  } else {
    team.members = team.members.filter(member => member.name !== firstArgs.toLowerCase())
  }

  system.run(() => {
    targetPlayer ? targetPlayer.nameTag = targetPlayer.name : null;
  })
  
  // Global Announcement
  if(setting.teams["announceTeamLeave"]) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.leave.replace("{0}", firstArgs.toLowerCase()).replace("{1}", specifiedTeam.name)))
    })
  }
  

  await db.store("team", teams)
  targetPlayer?.sendMessage(messageSyntax(messages.admin.leave.notify));
  player.sendMessage(messageSyntax(messages.admin.leave.success))
  
  
  return 0
})