import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry(messages.command.demote, (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)

  if(!args) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:team ${messages.command.demote} ${messages.helpArg.demote}`))
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
  if(!playerExist && !targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(playerExist && !(player.hasTeam().members.some(member => member.name === args.toLowerCase()) || player.hasTeam().leader.some(l => l.name === args?.toLowerCase()))) return player.sendMessage(messageSyntax(messages.needSameTeam))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  const specifiedMember = team.members.find(m => m.name === args.toLowerCase())

  if(specifiedMember?.rank === "default") return player.sendMessage(messageSyntax(messages.demote.min))
  
  // A filter for a player whose owner of the team can demote himself.
  if(player.name.toLowerCase() !== args.toLowerCase() && team.leader.some(l => l.name === args.toLowerCase())) return player.sendMessage(messageSyntax(messages.demote.noPerm))
  if(player.name.toLowerCase() === args.toLowerCase() && player.teamPerks().maxAdmins < team.members.filter(m => m.rank === "admin").length + 1) return player.sendMessage(messageSyntax(messages.demote.maxAdmins))
  if(team.leader.length === 1 && player.name.toLowerCase() === args.toLowerCase()) return player.sendMessage(messageSyntax(messages.demote.lastOwner))
  
  if(player.name.toLowerCase() === args.toLowerCase()) {
    // Only the player whose leader can demote himself.
    team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase())
    team.members.push({
      name: player.name.toLowerCase(),
      rank: "admin"
    })
  } else {
    specifiedMember.rank = "default"
  } 
  
  targetPlayer?.sendMessage(messageSyntax(messages.demote.notify))
  player.sendMessage(messageSyntax(messages.demote.success))
  db.store("team", teams)
  return 0
})