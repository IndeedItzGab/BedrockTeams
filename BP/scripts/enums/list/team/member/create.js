import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const namespace = config.commands.namespace
const chatName = config.BedrockTeams.chatName

enumRegistry("create", (origin, args) => {
  
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${namespace}:team create <name>`)

  let teams = db.fetch("team", true)
  if(player.hasTeam()) return player.sendMessage(`${chatName} §4You must leave your team before doing that`)
  if(config.BedrockTeams.maxTeamLength < args.length) return player.sendMessage(`${chatName} §4That team name is too long`)
  if(config.BedrockTeams.minTeamLength > args.length) return player.sendMessage(`${chatName} §4That team name is too short`)
  if(config.BedrockTeams.bannedChars.split('').some(char => args.includes(char)) || ![...args].every(char => config.BedrockTeams.allowedChars.includes(char))) return player.sendMessage(`${chatName} §4A character you tried to use is banned`)
  if(config.BedrockTeams.bannedTeamNames.includes(args)) return player.sendMessage(`${chatName} §4That team name is banned`)
  if(teams.some(team => team.name === args)) return player.sendMessage(`${chatName} §4That team already exists`)
  
  teams.push({
    name: args.replace("/§[1234567890abcdefklmnori]/g", ""),
    color: config.BedrockTeams.defaultColor,
    tag: args.replace("/§[1234567890abcdefklmnori]/g", ""),
    description: "",
    inviteOnly: true,
    score: 0,
    level: 1,
    leader: player.name.toLowerCase(),
    home: {},
    warp: [],
    banned: [],
    members: []
  })
  
  system.run(() => {
    player.nameTag = `§${config.BedrockTeams.defaultColor}${args.replace("/§[1234567890abcdefklmnori]/g", "")}§r ${player.name}`
  })
  player.sendMessage(`${chatName} §6Your team has been created`)
  db.store("team", teams)

  //return 0
})