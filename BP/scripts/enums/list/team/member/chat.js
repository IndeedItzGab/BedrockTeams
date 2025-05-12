import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import "../../../../utilities/chatColor.js"
const chatName = config.BedrockTeams.chatName
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("chat", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(`${chatName} §4You must be in a team to do that`)
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!config.BedrockTeams.allowToggleTeamChat) return
    const tag = player.hasTag("chat:team")
    system.run(() => {
      tag ? player.removeTag("chat:team") : player.addTag("chat:team")
    })
    player.sendMessage(`${chatName} §6${tag ? "Your messages now go to the global chat" : "Your messages now go to the team chat"}`)
  } else {
    team.members.push({name: team.leader}) // Makes sure owner is included
    team.members.forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name).sendMessage(`§b[Team]§r **${player.name}: ${args}`)
    })
  }

  return 0
})