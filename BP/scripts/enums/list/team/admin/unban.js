import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("unban", (origin, args) => {
  const player = origin.sourceEntity
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const teams = db.fetch("team", true)
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessagr(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader() || !player.isAdmin()) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`)
  if(!player.hasTeam().banned.some(member => member.name === args.toLowerCase())) return player.sendMessage(`${chatName} §6That player is not banned`)
  if(targetPlayer.isLeader() || targetPlayer.isAdmin()) return player.sendMessage(`${chatName} §6You do not have permission to unban that person`)
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  team.banned = team.banned.filter(member => member.name !== args.toLowerCase())

  targetPlayer?.sendMessage(`${chatName} §6You have been unbanned from team ${player.hasTeam().name}`)
  player.sendMessage(`${chatName} §6That player has been unbanned`)
  db.store("team", teams)
  return 0
})