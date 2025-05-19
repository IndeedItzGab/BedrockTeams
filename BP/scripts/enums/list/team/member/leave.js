import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("leave", (origin, args) => {
  const player = origin.sourceEntity
  const teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(`${chatName} §4You must be in a team to do that`)
  if(player.isLeader()) return player.sendMessage(`${chatName} §6You are the only owner rank within the team, Either promote someone else or use §b/team disband §6to disband command. the team'`)
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  team.members = team.members.filter(member => member.name !== player.name.toLowerCase())
  system.run(() => {
    player.nameTag = player.name
  })
  
  player.checkPvp()
  player.sendMessage(`${chatName} §6You have left the team`)
  db.store("team", teams)
  return 0
})