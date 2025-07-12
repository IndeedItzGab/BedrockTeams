import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("demote", async (origin, args) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  if(!args) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin demote <player>`))
  
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())


  let teams = db.fetch("team", true);
  let team = teams.find(t => t.members.some(m => m.name === args.toLowerCase())) || teams.find(t => t.leader.some(l => l.name === args.toLowerCase()))
  let specifiedMember = team?.members.find(m => m.name === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name?.toLowerCase() === args?.toLowerCase())
  
  if(!playerExist) return player.sendMessage(messageSyntax(messages.noPlayer))
  let perks = config.BedrockTeams.levels.filter(d => !d?.price || d.price <= team?.score).reduce((acc, cur) => {
    return (!acc || (cur.price > acc.price)) ? cur : acc;
  }, null)

  const isTeamLeader = team?.leader.some(l => l.name === args.toLowerCase())

  if(isTeamLeader && perks?.maxOwners <= team.leader.length) return player.sendMessage(messageSyntax(messages.admin.demote.maxOwners))
  if(!isTeamLeader && specifiedMember.rank === "default") return player.sendMessage(messageSyntax(messages.admin.demote.min))
  if(team.leader.length === 1 && isTeamLeader) return player.sendMessage(messageSyntax(messages.demote.lastOwner))

  if(isTeamLeader) {
    team.leader = team.leader.filter(l => l.name !== args.toLowerCase())
    team.members.push({
      name: args.toLowerCase(),
      rank: "admin"
    })
  } else {
    specifiedMember.rank = "default"
  } 
  
  targetPlayer?.sendMessage(messageSyntax(messages.admin.demote.notify))
  player.sendMessage(messageSyntax(messages.admin.demote.success))
  db.store("team", teams)

  return 0
})