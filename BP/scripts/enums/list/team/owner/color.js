import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import "../../../../utilities/chatColor.js"
const chatName = config.BedrockTeams.chatName
const namespace = config.commands.namespace
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("color", (origin, args) => {

  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${namespace}:team color <color code>`)

  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You must be the owner of the team to do that`) // Not finished message
  if(config.BedrockTeams.bannedColors.split('').some(char => args.includes(char))) return player.sendMessage(`${chatName} §4That color code is banned`)
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(args.length > 1) {
    if(!chatColor[args.toUpperCase()]) return player.sendMessage(`${chatName} §6That is not a recognised chat color`)
    team.color = chatColor[args.toUpperCase()]
  } else {
    if(!"1234567890abcdefklmnori".split('').some(d => args.includes(d))) return player.sendMessage(`${chatName} §6That is not a recognised chat color`)
    team.color = args
  }
  
  team.members.push({name: team.leader})
  team.members.forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember.nameTag = `§${color}${team.tag}§r ${targetMember.name}`
    })
  })
  team.members = team.members.filter(d => d.name !== team.leader)
 
  player.sendMessage(`${chatName} §6Your team color has been changed`)
  db.store("team", teams)
  
  return 0
})