import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import "../../../../utilities/chatColor.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const namespace = config.commands.namespace

enumRegistry(messages.command.chat, (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!config.BedrockTeams.allowToggleTeamChat) return player.sendMessage(`/${namespace}:team ${messages.command.chat} ${messages.helpArg.chat}`)
    const tag = player.hasTag("chat:team")
    system.run(() => {
      if(tag) {
        player.removeTag("chat:team")
      } else {
        player.removeTag("chat:ally")
        player.addTag("chat:team")
      }
    })
    player.sendMessage(messageSyntax(tag ? messages.chat.disabled : messages.chat.enabled));
  } else {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    team.members.concat(team.leader).forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.chat.syntax.replace("{0}", rank + player.name).replace("{1}", args))
    })
    world.getPlayers().filter(p => p.hasTag("bedrockteams:chatspy")).forEach(p => {
      // Admin chat spy
      p.sendMessage(messages.spy.team.replace("{0}", config.BedrockTeams.chatName).replace("{1}", rank + player.name).replace("{2}", args))
    })
  }
  
  return 0
})