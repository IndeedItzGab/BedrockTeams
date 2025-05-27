import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("pvp", (origin) => {
  const player = origin.sourceEntity
  const teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  team.pvp = !team.pvp
  
  team.members.concat(team.leader).forEach(member => {
    const targetPlayer = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
    if(!targetPlayer) return;
    system.run(() => {
      team.pvp ? targetPlayer.removeTag(team.id) : targetPlayer.addTag(team.id)
    })
  })
  
  const message = team.pvp ? messageSyntax(messages.pvp.enabled) : messageSyntax(messages.pvp.disabled)
  player.sendMessage(messages)
  db.store("team", teams)
  return 0
})