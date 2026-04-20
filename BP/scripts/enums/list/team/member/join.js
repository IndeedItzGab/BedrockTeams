import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.join, async (origin, args) => {
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/team ${messages.command.join} ${messages.helpArg.join}`)
  const teams = db.fetch("team", true)
  const teamTag = player?.getTags().find(tag => tag.includes("teamInvite:"))
  const specifiedTeam = teams.find(team => team.name === args)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  if(player.hasTeam()) return player.sendMessage(messageSyntax(messages.notInTeam))
  if(!specifiedTeam) return player.sendMessage(messageSyntax(messages.noTeam))
  if(specifiedTeam.banned.some(m => m.name === player.name.toLowerCase())) return player.sendMessage(messageSyntax(messages.join.banned))
  if(specifiedTeam.members.length + 1 > player.teamPerks(specifiedTeam.name).teamLimit) return player.sendMessage(messageSyntax(messages.join.full))
  if(specifiedTeam.inviteOnly && (specifiedTeam.name !== teamTag?.replace("teamInvite:", "") || !teamTag)) {
    return player.sendMessage(messageSyntax(messages.join.notInvited))
  }
  specifiedTeam.members.push({
    name: player.name.toLowerCase(),
    rank: "default"
  })
  specifiedTeam.members.concat(specifiedTeam.leader).forEach(member => {
    world.getPlayers().find(player => player.name.toLowerCase() === member.name)?.sendMessage(messageSyntax(messages.join.notify.replace("{0}", player.name)))
  })

  const color = !setting.teams["colorTeamName"] ? setting.teams["defaulColor"] : specifiedTeam.color
  system.run(() => {
    player.nameTag = `§${color}${specifiedTeam.tag}§r ${player.name}`
    teamTag ? player?.removeTag(teamTag) : null
  })
  
  // Global Announcement
  if(setting.teams["announceTeamJoin"]) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.join.replace("{0}", player.name).replace("{1}", specifiedTeam.name)))
    })
  }
  
  player.sendMessage(messageSyntax(messages.join.success))
  await db.store("team", teams)
  return 0
})