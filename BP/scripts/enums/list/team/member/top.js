import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName

enumRegistry("top", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)

  let message = `${chatName} §6Leaderboard:`
  let count = 1
  teams.sort((a, b) => b.score - a.score)
  teams.forEach(team => {
    message += `\n§b${count}. §${team.color}${team.name} §i(${team.score})`
    count++
  })
  
  player.sendMessage(message)
  return 0
})