import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("promote", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())


  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §6You do not have permissions to promote that person`) // Not finished message
  if(!playerExist && !targetPlayer) return player.sendMessage(`${chatName} §4Specified player not found`)
  if(playerExist && !player.hasTeam().members.some(member => member.name === args.toLowerCase())) return player.sendMessage(`${chatName} §6You are not in the same team as that person`)
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  const specifiedMember = team.members.find(m => m.name === args.toLowerCase())

  if(specifiedMember.rank === "owner") return player.sendMessage(`${chatName} §6That person is already promoted to the max!`)
  if(specifiedMember.rank === "default" && config.BedrockTeams.levels.maxAdmins < team.members.filter(m => m.rank === "admin").length + 1) return player.sendMessage(`${chatName} §4Your team already has the maximum number of admins, demote someone`)
  if(specifiedMember.rank === "admin" && config.BedrockTeams.levels.maxOwners < team.members.filter(m => m.rank === "owner").length + 1) return player.sendMessage(`${chatName} §4Your team already has the maximum number of owners, demote someone`)

  specifiedMember.rank = specifiedMember.rank === "admin" ? "owner" : "admin"
  
  targetPlayer?.sendMessage(`${chatName} §6You have been promoted!`)
  player.sendMessage(`${chatName} §6That player has been promoted`)
  db.store("team", teams)
  return 0
})