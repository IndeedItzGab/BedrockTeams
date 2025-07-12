import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("list", (origin) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  player.sendMessage(messageSyntax(messages.loading))
  let message = messageSyntax(messages.list.header)
  let count = 1
  teams.forEach(team => {
    message += `\n${messageSyntax(messages.list.body.replace("{0}", count).replace("{1}", team.name))}`
    count++
  })
  
  player.sendMessage(message)
  return 0
})