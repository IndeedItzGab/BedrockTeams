import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
const namespace = config.commands.namespace
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("setwarp", (origin, args) => {
  const argsFirst = args?.split(" ")[0]
  const argsSecond = args?.split(" ")[1]
  const player = origin.sourceEntity
  if(!argsFirst) return player.sendMessage(`/${namespace}:team setwarp <name> [password]`)
  let teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  if(config.BedrockTeams.bannedChars.split('').some(char => argsFirst?.includes(char)) || ![...argsFirst].every(char => config.BedrockTeams.allowedChars?.includes(char))) return player.sendMessage(messageSyntax(messages.setwarp.char))

  let team = teams.find(t => t.name === player.hasTeam().name)
  if(team.warp.some(w => w.name.toLowerCase() === argsFirst?.toLowerCase())) return player.sendMessage(messageSyntax(messages.setwarp.exist))
  if(team.warp.length + 1 > player.teamPerks(team.name).maxWarps) return player.sendMessage(messageSyntax(messages.setwarp.max))
  team.warp.push({
    name: argsFirst.replace("/§[1234567890abcdefklmnori]/g", ""),
    password: argsSecond,
    dimension: player.dimension.id,
    x: player.location.x,
    y: player.location.y,
    z: player.location.z
  })
  
  player.sendMessage(messageSyntax(messages.setwarp.success))
  db.store("team", teams)
  return 0
})