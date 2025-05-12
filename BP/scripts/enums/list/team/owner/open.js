import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("open", (origin) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isLeader()) return player.sendMessage(`${chatName} §4You must be the owner of the team to do that`) // Not finished message
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  if(team.inviteOnly) {
    team.inviteOnly = false
    player.sendMessage(`${chatName} §6Your team now open to everyone`)
  } else {
    team.inviteOnly = true
    player.sendMessage(`${chatName} §6Your team is now invite only `)
  }
  db.store("team", teams)
  
  return 0
})