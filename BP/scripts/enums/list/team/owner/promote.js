import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("promote", (origin, args) => {
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

  if(team.leader.some(l => l.name === args.toLowerCase())) return player.sendMessage(messageSyntax(messages.promote.max))
  if(config.BedrockTeams.singleOwner && specifiedMember.rank === "admin") return player.sendMessage(messageSyntax(messages.setowner.use))
  if(specifiedMember.rank === "default" && player.teamPerks().maxAdmims < team.members.filter(m => m.rank === "admin").length + 1) return player.sendMessage(messageSyntax(messages.promote.maxAdmins))
  if(specifiedMember.rank === "admin" && player.teamPerks().maxOwners < team.leader.length + 1) return player.sendMessage(messageSyntax(messages.promote.maxOwners))

  if(specifiedMember.rank === "admin") {
    team.members = team.members.filter(m => m.name !== specifiedMember.name)
    team.leader.push({
      name: specifiedMember.name
    })
  } else {
    specifiedMember.rank = "admin"
  }
  
  targetPlayer?.sendMessage(messageSyntax(messages.promote.notify))
  player.sendMessage(messageSyntax(messages.promote.success))
  db.store("team", teams)
  return 0
})