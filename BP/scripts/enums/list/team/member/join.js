import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"
const chatName = config.BedrockTeams.chatName
const namespace = config.commands.namespace
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry(messages.command.join, async (origin, args) => {
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${namespace}:team ${messages.command.join} ${messages.helpArg.join}`)
  const teams = db.fetch("team", true)
  const teamTag = player?.getTags().find(tag => tag.includes("teamInvite:"))
  const specifiedTeam = teams.find(team => team.name === args)
  
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

  const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : specifiedTeam.color
  system.run(() => {
    player.nameTag = `§${color}${specifiedTeam.tag}§r ${player.name}`
    teamTag ? player?.removeTag(teamTag) : null
  })
  
  // Global Announcement
  if(config.BedrockTeams.announceTeamJoin) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.join.replace("{0}", player.name).replace("{1}", specifiedTeam.name)))
    })
  }
  
  player.sendMessage(messageSyntax(messages.join.success))
  await db.store("team", teams)
  player.enableTeamPvp(specifiedTeam.id)
  player.allyCheckPvp()
  return 0
})