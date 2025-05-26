import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("demote", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You must be the owner of the team to do that`)
  if(!playerExist && !targetPlayer) return player.sendMessage(`${chatName} §4Specified player not found`)
  if(playerExist && !(player.hasTeam().members.some(member => member.name === args.toLowerCase()) || player.hasTeam().leader.some(l => l.name === args?.toLowerCase()))) return player.sendMessage(`${chatName} §6You are not in the same team as that person`)
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  const specifiedMember = team.members.find(m => m.name === args.toLowerCase())

  if(specifiedMember?.rank === "default") return player.sendMessage(`${chatName} §6That person is already the lowest rank`)
  
  // A filter for a player whose owner of the team can demote himself.
  if(player.name.toLowerCase() !== args.toLowerCase() && team.leader.some(l => l.name === args.toLowerCase())) return player.sendMessage(`${chatName} §6You do not have permissions to demote that person`)
  if(player.name.toLowerCase() === args.toLowerCase() && player.teamPerks().maxAdmins < team.members.filter(m => m.rank === "admin").length + 1) return player.sendMessage(`${chatName} §4Your team already has the maximum number of admins, remove an admin or level your team up`)
  if(team.leader.length === 1 && player.name.toLowerCase() === args.toLowerCase()) return player.sendMessage(`${chatName} §6You cannot demote the final owner, promote someone else first`)
  
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
  
  targetPlayer?.sendMessage(`${chatName} §6You have been demoted`)
  player.sendMessage(`${chatName} §6That player has been demoted`)
  db.store("team", teams)
  return 0
})