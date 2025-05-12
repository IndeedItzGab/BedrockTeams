import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName

enumRegistry("info", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  const team = teams.find(team => team.name === args ||
  team.leader === (player.name.toLowerCase() || args.toLowerCase()) || 
  team.members.some(m => m.name === (args.toLowerCase() || player.name.toLowerCase())))
  if(!team) return player.sendMessage(`${chatName} §6No team or player found under that name`)
    console.info(team.inviteOnly)
  let message = ""
  let ownersList = [], membersList = []
  world.getPlayers().some(m => m.name.toLowerCase() === team.leader) ? ownersList = [`§a${team.leader}`] : ownersList = [`§c${team.leader}`]
  team.members.forEach(member => {
    let isOnline = world.getPlayers().some(m => m.name.toLowerCase() === member.name)
    if(member.rank === "owner") return ownersList.push(`${isOnline ? "§a" : "§c"}${member.name}§r`)
    membersList.push(`${isOnline ? "§a" : "§c"}${member.name}§r`)
  })
  
  
  team.name ? message += `${chatName} §6Name: §b${team.name}` : null
  team.description ? message += `\n${chatName} §6Description: §b${team.description}` : null
  team.inviteOnly ? message += `\n${chatName} §6Open: §b${!team.inviteOnly}` : null
  team.level ? message += `\n${chatName} §6Level: §b${team.level}` : null
  team.score ? message += `\n${chatName} §6Score: §b${team.score}` : null
  team.leader ? message += `\n${chatName} §6Owners: §b${ownersList.join(", ")}` : null
  team.members.length > 0 ? message += `\n${chatName} §6Members: §b${membersList.join(", ")}` : null
  team.tag ? message += `\n${chatName} §6Tag: §b${team.tag}` : null

  player.sendMessage(message)

  return 0
})