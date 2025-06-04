import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import "../../../../utilities/chatColor.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const namespace = config.commands.namespace

enumRegistry("allychat", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  if(!args) {
    if(!config.BedrockTeams.allowToggleTeamChat) return player.sendMessage(`/${namespace}:team allychat <message>`)
    const tag = player.hasTag("chat:ally")
    system.run(() => {
      if(tag) {
        player.removeTag("chat:ally")
      } else {
        player.removeTag("chat:team")
        player.addTag("chat:ally")
      }
    })
    player.sendMessage(messageSyntax(tag ? messages.allychat.disabled : messages.allychat.enabled));
  } else {
    let rank = player.isLeader() ? messages.prefix.owner : player.isAdmin() ? messages.prefix.admin : messages.prefix.default
    const alliances = db.fetch("alliances", true)
    const allyTeams = alliances.filter(d => d.teams.includes(team.name))
    team.members.concat(team.leader).forEach(member => {
      world.getPlayers().find(p => p.name.toLowerCase() === member.name)?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", args))
    })
    for(const d of teams) {
      if(d.name === team.name || !allyTeams.some(a => a.teams.includes(d.name))) continue;
      d.members.concat(d.leader).forEach(m => {
        world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())?.sendMessage(messages.allychat.syntax.replace("{0}", team.name).replace("{1}", rank + player.name).replace("{2}", args))
      })
    }
  }
  return 0
})