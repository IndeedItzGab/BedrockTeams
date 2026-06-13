import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import "../../../../utilities/chatColor.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

EnumRegistry(messages.command.chat, (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  const setting = db.fetch("bedrockteams:setting")
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!setting.teams["allowToggleTeamChat"]) return player.sendMessage(`/team ${messages.command.chat} ${messages.helpArg.chat}`)
    const mode = player.getDynamicProperty("bedrockteams:chatMode") === "team"

    if(mode) {
      player.setDynamicProperty("bedrockteams:chatMode", null)
    } else {
      player.setDynamicProperty("bedrockteams:chatMode", "team")
    }

    player.sendMessage(messageSyntax(mode ? messages.chat.disabled : messages.chat.enabled));
  } else {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    
    for(const member of team.members.concat(team.leader)) {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())?.sendMessage(messages.chat.syntax.replace("{0}", rank + player.name).replace("{1}", args))
    }

    for(const admin of world.getPlayers().filter(p => p.getDynamicProperty("bedrockteams:chatspy"))) {
      admin.sendMessage(messages.spy.team.replace("{0}", setting.teams["chatName"]).replace("{1}", rank + player.name).replace("{2}", args))
    }
  }
  
  return 0
})