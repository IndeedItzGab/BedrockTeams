import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("pvp", (origin) => {
  const player = origin.sourceEntity
  const teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessagr(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader() || !player.isAdmin()) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`)
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  team.pvp = !team.pvp
  
  team.members.push({ name: team.leader })
  team.members.forEach(member => {
    const targetPlayer = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
    if(!targetPlayer) return;
    system.run(() => {
      team.pvp ? targetPlayer.removeTag(team.id) : targetPlayer.addTag(team.id)
    })
  })
  
  team.members = team.members.filter(d => d.name !== team.leader)
  
  const message = team.pvp ? "§6Pvp has been enabled for your team" : "§6Pvp has been disabled for your team"
  player.sendMessage(`${chatName} ${message}`)
  db.store("team", teams)
  return 0
})