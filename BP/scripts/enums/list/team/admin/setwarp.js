import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const namespace = config.commands.namespace
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("setwarp", (origin, argsFirst, argsSecond) => {
  const player = origin.sourceEntity
  if(!argsFirst) return player.sendMessage(`/${namespace}:team setwarp <name> [password]`)
  let teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  if(!player.isAdmin()) return player.sendMessage(`${chatName} §4You must be admin or owner of the team to do that`) // Not finished message
  if(config.BedrockTeams.bannedChars.split('').some(char => argsFirst?.includes(char)) || ![...argsFirst].every(char => config.BedrockTeams.allowedChars?.includes(char))) return player.sendMessage(`${chatName} §4A character you tried to use is banned`)

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(team.warp.some(w => w.name.toLowerCase() === argsFirst?.toLowerCase())) return player.sendMessage(`${chatName} §4That warp already exists`)
  if(team.warp.length + 1 > config.BedrockTeams.levels.maxWarps) return player.sendMessage(`${chatName} §4Your team already has the maximum number of warps set`)
  team.warp.push({
    name: argsFirst.replace("/§[1234567890abcdefklmnori]/g", ""),
    password: argsSecond,
    dimension: player.dimension.id,
    x: player.location.x,
    y: player.location.y,
    z: player.location.z
  })
  
  player.sendMessage(`${chatName} §6That warp has been created`)
  db.store("team", teams)
  return 0
})