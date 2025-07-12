import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

if(config.BedrockTeams.singleOwner) {
  enumAdminRegistry("setowner", async (origin, firstArgs) => {
    const player = origin.sourceEntity
    if (!(player instanceof Player)) return 1

    const teams = db.fetch("team", true)
    const team = teams.find(team => team.members.some(member => member.name.toLowerCase() === firstArgs.toLowerCase()) || team.leader.some(leader => leader.name.toLowerCase() === firstArgs.toLowerCase()))
    const targetPlayer = world.getPlayers().find(p => p.name.toLowerCase() === firstArgs.toLowerCase())
    const playerExist = db.fetch("teamPlayerList", true).some(p => p.name?.toLowerCase() === firstArgs?.toLowerCase())
    
    if(!playerExist) return player.sendMessage(messageSyntax(messages.noPlayer))
    if(!team) return player.sendMessage(messageSyntax(messages.admin.inTeam))
    if(team.leader.some(leader => leader.name.toLowerCase() === firstArgs.toLowerCase())) return player.sendMessage(messageSyntax(messages.admin.setowner.already))
    
    team.members = team.members.filter(m => m.name !== firstArgs.toLowerCase())
    team.leader = team.leader.filter(l => l.name !== team.leader[0].name.toLowerCase())
    const leaderPlayer = world.getPlayers().find(p => p.name.toLowerCase() === team.leader[0].name.toLowerCase())
    team.members.push({
      name: team.leader[0].name.toLowerCase(),
      rank: "default"
    })
    team.leader.push({
      name: firstArgs.toLowerCase()
    })
    
    targetPlayer?.sendMessage(messageSyntax(messages/admin.setowner.notify))
    leaderPlayer?.sendMessage(messageSyntax(messages.admin.setowner.nonotify))
    player.sendMessage(messageSyntax(messages.admin.setowner.success))
    db.store("team", teams)

    return 0
  })
}