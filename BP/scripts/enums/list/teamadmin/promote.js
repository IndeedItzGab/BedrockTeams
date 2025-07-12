import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("promote", async (origin, args) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  if(!args) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin promote <player>`))
  
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())

  let teams = db.fetch("team", true);
  let team = teams.find(t => t.members.some(m => m.name === args.toLowerCase())) || teams.find(t => t.leader.some(l => l.name === args.toLowerCase()))
  let specifiedMember = team?.members.find(m => m.name === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name?.toLowerCase() === args?.toLowerCase())
  
  if(!playerExist) return player.sendMessage(messageSyntax(messages.noPlayer))
  let perks = config.BedrockTeams.levels.filter(d => !d?.price || d.price <= team.score).reduce((acc, cur) => {
    return (!acc || (cur.price > acc.price)) ? cur : acc;
  }, null)
  if(config.BedrockTeams.singleOwner && specifiedMember.rank === "admin") return player.sendMessage(messageSyntax(messages.admin.promote.owner))
  if(specifiedMember.rank === "default" && perks?.maxAdmins <= team.members.filter(m => m.rank === "admin").length) return player.sendMessage(messageSyntax(messages.admin.promote.maxAdmins))
  if(specifiedMember.rank === "admin" && perks?.maxOwners <= team.leader.length) return player.sendMessage(messageSyntax(messages.admin.promote.maxOwners))
  if(team.leader.some(m => m.name === specifiedMember.name)) return player.sendMessage(messageSyntax(messages.admin.promote.max))
    
  if(specifiedMember.rank === "admin") {
    team.members = team.members.filter(m => m.name !== specifiedMember.name)
    team.leader.push({
      name: specifiedMember.name
    })
  } else {
    specifiedMember.rank = "admin"
  }
  
  targetPlayer?.sendMessage(messageSyntax(messages.admin.promote.notify))
  player.sendMessage(messageSyntax(messages.admin.promote.success))
  db.store("team", teams)

  return 0
})