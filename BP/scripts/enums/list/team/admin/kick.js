import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("kick", (origin, args) => {
  const player = origin.sourceEntity
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const teams = db.fetch("team", true)
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessagr(`${chatName} §4You must be in a team to do that`)
  if(!player.isAdmin()) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`)
  if(!playerExist && !targetPlayer) return player.sendMessage(`${chatName} §4Specified player not found`)
  if(playerExist && !player.hasTeam().members.some(member => member.name === args.toLowerCase())) return player.sendMessage(`${chatName} §6You are not in the same team as that person`)

  let team = teams.find(team => team.name === player.hasTeam().name)
  if(team.members.concat(team.leader).some(l => l.name === args.toLowerCase() && (!l.rank || l.rank === "admin"))) return player.sendMessage(`${chatName} §6You do not have permission to kick that person`)
  
  team.members = team.members.filter(member => member.name !== args.toLowerCase())
  
  system.run(() => {
    targetPlayer && (targetPlayer.nameTag = targetPlayer.name);
  })
  
  targetPlayer?.disableTeamPvp()
  targetPlayer?.sendMessage(`${chatName} §6You have been kicked from team ${player.hasTeam().name}`)
  player.sendMessage(`${chatName} §6That player has been kicked`)
  db.store("team", teams)
  return 0
})