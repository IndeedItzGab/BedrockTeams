import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const namespace = config.commands.namespace
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("tag", (origin, args) => {
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${namespace}:team tag <name>`)

  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You do not have permission to change the team tag`) // Not finished message
  if(config.BedrockTeams.bannedTeamNames.includes(args)) return player.sendMessage(`${chatName} §4That tag is banned`)
  if(config.BedrockTeams.bannedChars.split('').some(char => args.includes(char)) || ![...args].every(char => config.BedrockTeams.allowedChars.includes(char))) return player.sendMessage(`${chatName} §4A character you tried to use is banned`)
  if(config.BedrockTeams.maxTagLength < args.length) return player.sendMessage(`${chatName} §4That tag is too long`)
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  team.tag = args.replace("/§[1234567890abcdefklmnori]/g", "")
  const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : team.color
  team.members.push({name: team.leader})
  team.members.forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember.nameTag = `§${color}${team.tag}§r ${targetMember.name}`
    })
  })
  team.members = team.members.filter(d => d.name !== team.leader)
  player.sendMessage(`${chatName} §6Your tag has successfully changed`)
  db.store("team", teams)
  return 0
})