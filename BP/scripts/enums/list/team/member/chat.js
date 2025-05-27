import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import "../../../../utilities/chatColor.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("chat", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!config.BedrockTeams.allowToggleTeamChat) return
    const tag = player.hasTag("chat:team")
    system.run(() => {
      tag ? player.removeTag("chat:team") : player.addTag("chat:team")
    })
    player.sendMessage(messageSyntax(tag ? messages.chat.disabled : messages.chat.enabled));
  } else {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    team.members.concat(team.leader).forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.chat.syntax.replace("{0}", rank + player.name).replace("{1}", args))
    })
  }
  
  return 0
})