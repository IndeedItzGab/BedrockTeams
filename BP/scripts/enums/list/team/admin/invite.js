import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("invite", (origin, args) => {
  const player = origin.sourceEntity
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  let teams = db.fetch("team", true)
  let team = teams.find(team => team.leader === player.name.toLowerCase())

  if(!player.isLeader() || !player.isAdmin()) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`)
  if(config.BedrockTeams.levels.teamLimit < team.members.length + 1) return player.sendMessage(`${chatName} §4Your team is maximum sizs, kick someone out before inviting more people`)
  if(!targetPlayer) return player.sendMessage(`${chatName} §4Specified player not found`)
  if(team.banned?.some(member => member.name === targetPlayer.name.toLowerCase())) return player.sendMessage(`${chatName} §6That player is banned from your team`)
  if(targetPlayer.hasTeam()) return player.sendMessage(`${chatName} §6That player is already in a team`)
  
  system.run(() =>  {
    targetPlayer.addTag(`teamInvite:${team.name}`)
  })
  targetPlayer.sendMessage(`${chatName} §6You have been invited to join team ${team.name} do §b/team join ${team.name} §6to join the team `)
  player.sendMessage(`${chatName} §6That player has been invited`)
  system.runTimeout(() => {
    if(targetPlayer?.hasTag(`teamInvite:${team.name}`)) {
      targetPlayer.removeTag(`teamInvite:${team.name}`)
      targetPlayer?.sendMessage(`${chatName} §4The invite from §b${team.name} §4has expired`)
    }
  }, 30*20)

  return 0
})