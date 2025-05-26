import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

if(config.BedrockTeams.singleOwner) {

enumRegistry("setowner", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You must be the owner of the team to do that`)
  if(!playerExist && !targetPlayer) return player.sendMessage(`${chatName} §4Specified player not found`)
  if(playerExist && !(player.hasTeam().members.some(member => member.name === args?.toLowerCase()) || player.hasTeam().leader.some(l => l.name === args?.toLowerCase()))) return player.sendMessage(`${chatName} §6You are not in the same team as that person`)
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  const specifiedMember = team.members.find(m => m.name === args.toLowerCase())
  
  team.members = team.members.filter(m => m.name !== specifiedMember.name)
  team.leader.push({
    name: specifiedMember.name
  })
  team.members.push({
    name: player.name.toLowerCase(),
    rank: "default"
  })
  
  targetPlayer?.sendMessage(`${chatName} §6You are now owner of your team`)
  player.sendMessage(`${chatName} §6That player is now owner`)
  db.store("team", teams)
  return 0
})
}