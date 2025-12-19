import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.info, (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const alliances = db.fetch("alliances", true)
  
  const team = teams.find(team => team.name === args ||
  team.leader.some(l => l.name === player.name?.toLowerCase() || l.name === args?.toLowerCase()) || 
  team.members.some(m => m.name === (args?.toLowerCase() || player.name.toLowerCase())))
  if(!team) return player.sendMessage(messageSyntax(messages.info.needTeam))
  const ally = alliances.filter(d => d.teams.includes(team.name))


  let message = ""
  let ownersList = [], membersList = [], adminsList = [], allyList = []
  // world.getPlayers().some(m => m.name.toLowerCase() === team.leader) ? ownersList = [`§a${team.leader}`] : ownersList = [`§c${team.leader}`]
  team.members.forEach(member => {
    let isOnline = world.getPlayers().some(m => m.name.toLowerCase() === member.name)
    if(member.rank === "admin") return adminsList.push(`${isOnline ? messages.info.online : messages.info.offline }${messages.prefix.admin}${member.name}§r`)
    membersList.push(`${isOnline ? messages.info.online : messages.info.offline }${messages.prefix.default}${member.name}§r`)
  })
  
  team.leader.forEach(leader => {
    let isOnline = world.getPlayers().some(m => m.name.toLowerCase() === leader.name)
    ownersList.push(`${isOnline ? messages.info.online : messages.info.offline }${messages.prefix.owner}${leader.name}§r`)
  })
  
  for(const t of teams) {
    if(t.name === team.name || !ally.some(d => d.teams.includes(t.name))) continue
    allyList.push(t.name)
  }
  
  
  team.name ? message += messageSyntax(messages.info.name.replace("{0}", team.name)) : null
  team.description ? message += `\n${messageSyntax(messages.info.description.replace("{0}", team.description))}` : null
  team.inviteOnly ? message += `\n${messageSyntax(messages.info.open.replace("{0}", !team.inviteOnly))}` : null
  team.level ? message += `\n${messageSyntax(messages.info.level.replace("{0}", player.teamLevel(team.name)))}` : null
  team.score ? message += `\n${messageSyntax(messages.info.score.replace("{0}", team.score))}` : null
  team.leader ? message += `\n${messageSyntax(messages.info.owner.replace("{0}", ownersList.join(" ")))}` : null
  adminsList.length > 0 ? message += `\n${messageSyntax(messages.info.admin.replace("{0}", adminsList.join(" ")))}` : null
  membersList.length > 0 ? message += `\n${messageSyntax(messages.info.default.replace("{0}", membersList.join(" ")))}` : null
  allyList.length > 0 ? message += `\n${messageSyntax(messages.info.ally.replace("{0}", allyList.join(" ")))}` : null
  team.tag ? message += `\n${messageSyntax(messages.info.tag.replace("{0}", team.tag))}` : null

  player.sendMessage(message)
  return true
})