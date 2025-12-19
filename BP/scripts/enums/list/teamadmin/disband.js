import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"
import "../../../utilities/updateDisplayTop.js"

enumAdminRegistry(messages.command.disband, async (origin, firstArgs) => {
  const player = origin.sourceEntity
  if(!(player instanceof Player)) return;

  if(!firstArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.disband} ${messages.helpArg.admin.disband}`))
  const teams = db.fetch("team", true)
  const team = teams.find(team => team.name.toLowerCase() === firstArgs.toLowerCase())
  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))

  team.members.concat(team.leader).forEach(member => {
    const p = world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())
    system.run(() => p ? p.nameTag = p.name : null)
  })

  // Global Announcement
  if(config.BedrockTeams.announceTeamDisband) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.disband.replace("{0}", team.name)))
    })
  }
  
  // Revoke the alliances between the other teams
  let alliances = db.fetch("alliances", true)
  const ally = alliances.filter(d => d.teams.includes(team.name))
  await db.store("alliances", alliances.filter(d => !d.teams.includes(team.name)))
  for(const t of teams) {
    if(t.name === team.name || !ally.some(d => d.teams.includes(t.name))) continue;
    t.members.concat(t.leader).forEach(m => {
      const p = world.getPlayers().find(a => a.name.toLowerCase() === m.name.toLowerCase())
      p?.sendMessage(messageSyntax(messages.neutral.remove.replace("{0}", team.name)))
    })
  }
  
  await db.store("team", teams.filter(team => team.name.toLowerCase() !== firstArgs.toLowerCase()))
  updateDisplayTop()
  player.sendMessage(messageSyntax(messages.admin.disband.success))
  return 0
})