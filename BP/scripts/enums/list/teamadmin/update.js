import { world, system } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import { config } from "../../../config.js"
const chatName = config.BedrockTeams.chatName

enumAdminRegistry("update", (origin) => {
  const player = origin.sourceEntity
  if(!player.isAdministrator()) return player.sendMessage(`${chatName} §4You must have administrative permission to use this command.`)
  const teams = db.fetch("team", true)
  
  if(teams.some(d => d.version !== "1.0.1")) {
    teams.forEach((team, index) => {
      team.id = `team${index + 1}`
      team.pvp = false
      team.version = "1.0.1"
    })
    db.store("team", teams)
    player.sendMessage(`${chatName} §6BedrockTeams has been updated.`)
  } else {
    player.sendMessage(`${chatName} §4BedrockTeams is already updated.`)
  }
})