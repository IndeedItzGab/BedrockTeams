import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const namespace = config.commands.namespace
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("delwarp", (origin, argsFirst, argsSecond) => {
  const player = origin.sourceEntity
  if(!argsFirst) return player.sendMessage(`/${namespace}:team setwarp <name> [password]`)
  let teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isAdmin) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`) // Not finished message

  let team = teams.find(t => t.name === player.hasTeam().name)
  let warp = team.warp.find(w => w.name.toLowerCase() === argsFirst.toLowerCase())
  if(team.warp.length === 0) return player.sendMessage(`${chatName} §4Your team has no warps set`)
  if(!warp) return player.sendMessage(`${chatName} §4That warp does not exist`)
  if(!player.isLeader() && warp.passwrord !== argsSecond) return player.sendMessage(`${chatName} §4Invalid password for that warp`)
  
  team.warp = team.warp.filter(warp => warp.name.toLowerCase() !== argsFirst.toLowerCase())
  player.sendMessage(`${chatName} §4That warp has been deleted`)
  db.store("team", teams)
  return 0
})