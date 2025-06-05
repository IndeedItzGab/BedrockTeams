import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

if(config.BedrockTeams.singleOwner) {

enumRegistry("setowner", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
  if(!playerExist && !targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(playerExist && !(player.hasTeam().members.some(member => member.name === args?.toLowerCase()) || player.hasTeam().leader.some(l => l.name === args?.toLowerCase()))) return player.sendMessage(messageSyntax(messages.needSameTeam))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  const specifiedMember = team.members.find(m => m.name === args.toLowerCase())
  
  team.members = team.members.filter(m => m.name !== specifiedMember.name)
  team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase())
  team.leader.push({
    name: specifiedMember.name
  })
  team.members.push({
    name: player.name.toLowerCase(),
    rank: "default"
  })
  
  targetPlayer?.sendMessage(messageSyntax(messages.setowner.notify))
  player.sendMessage(messageSyntax(messages.setowner.success))
  db.store("team", teams)
  return 0
})
}