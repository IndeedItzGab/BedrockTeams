import { world, system } from "@minecraft/server"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"
import "../../utilities/messageSyntax.js"

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender
  const teams = db.fetch("team", true)
  const team = player.hasTeam()
  const message = event.message
  const setting = db.fetch("bedrockteams:setting")

  if(!team) {
    player.setDynamicProperty("bedrockteams:chatMode", null)
    return;
  }

  const chatMode = player.getDynamicProperty("bedrockteams:chatMode")
  const rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
  switch(chatMode) {
    case "team": {
      for(const member of team.members.concat(team.leader)) {
        world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())?.sendMessage(messages.chat.syntax.replace("{0}", rank + player.name).replace("{1}", message))
      }

      for(const admin of world.getPlayers().filter(p => p.getDynamicProperty("bedrockteams:chatspy"))) {
        admin.sendMessage(messages.spy.team.replace("{0}", setting.teams["chatName"]).replace("{1}", rank + player.name).replace("{2}", message))
      }
      break;
    }
    case "ally": {
      const alliances = db.fetch("alliances", true)
      const allyTeams = alliances.filter(a => a.teams.includes(team.name))

      for(const member of team.members.concat(team.leader)) {
        world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", message))
      }

      for(const admin of world.getPlayers().filter(p => p.getDynamicProperty("bedrockteams:chatspy"))) {
        admin.sendMessage(messages.spy.ally.replace("{0}", setting.teams["chatName"]).replace("{1}", rank + player.name).replace("{2}", message))
      }

      for(const d of teams) {
        if(d.name === team.name || !allyTeams.some(a => a.teams.includes(d.name))) continue;
        for(const member of d.members.concat(d.leader)) {
          world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", message))
        }
      }
      break;
    }
    default: {
      const color = !setting?.teams["colorTeamName"] ? "" : team?.color
      world.sendMessage(`§i[§r§${color}${team?.name}§i]§r <${player.chatNamePrefix}${player.name}§r> ${message}`) // Added EssentialCC ranking system
      system.run(() => system.sendScriptEvent("discordcc:webhookSend", JSON.stringify({content: message, username: `[${team?.name}] ${player.name}`, avatar_url: "https://raw.githubusercontent.com/IndeedItzGab/DiscordCC/refs/heads/main/docs/images/steve.jpg"})))
    }
  }
  event.cancel = true
})
