import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName

enumRegistry(messages.command.top, (origin) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  player.sendMessage(messageSyntax(messages.loading))
  let message = messageSyntax(messages.top.leaderboard)
  let count = 1
  teams.sort((a, b) => b.score - a.score)
  teams.forEach(team => {
    message += `\n${messageSyntax(messages.top.syntax.replace("{0}", count).replace("{1}", team.name).replace("{2}", team.score))}`
    count++
  })
  
  player.sendMessage(message)
  return 0
})