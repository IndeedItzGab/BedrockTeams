import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName

enumRegistry("list", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  player.sendMessage(`${chatName} §6Loading`)
  let message = `${chatName} §7--- §bTeam list §7---`
  let count = 1
  teams.forEach(team => {
    message += `\n${chatName} §6${count}: §b${team.name}`
    count++
  })
  
  player.sendMessage(message)
  return 0
})