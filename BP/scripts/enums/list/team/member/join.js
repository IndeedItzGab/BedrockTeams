import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
const chatName = config.BedrockTeams.chatName
const namespace = config.commands.namespace
const defaultColor = config.BedrockTeams.defaultColor

enumRegistry("join", (origin, args) => {
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/${namespace}:team join <team>`)
  const teams = db.fetch("team", true)
  const teamTag = player?.getTags().find(tag => tag.includes("teamInvite:"))
  const specifiedTeam = teams.find(team => team.name === args)
  
  if(player.hasTeam()) return player.sendMessage(`${chatName} §4You must leave your team before doing that`)
  if(!specifiedTeam) return player.sendMessage(`${chatName} §4That team does not exist`)
  if(specifiedTeam.banned.some(m => m.name === player.name.toLowerCase())) return player.sendMessage(`${chatName} §4You are banned from that team`)
  if(specifiedTeam.members.length + 1 > config.BedrockTeams.levels.teamLimit) return player.sendMessage(`${chatName} §4That team is full`)
  if(specifiedTeam.inviteOnly && (specifiedTeam.name !== teamTag?.replace("teamInvite:", "") || !teamTag)) {
    system.run(() => {
      teamTag ? player?.removeTag(teamTag) : null
    })
    return player.sendMessage(`${chatName} §4You have not been invited to that team`)
  }
  console.info(!teamTag)
  specifiedTeam.members.push({
    name: player.name.toLowerCase(),
    rank: "default"
  })
  specifiedTeam.members.push({name: specifiedTeam.leader})
  specifiedTeam.members.forEach(member => {
    world.getPlayers().find(player => player.name.toLowerCase() === member.name).sendMessage(`${chatName} §6Welcome §b${player.name}§6 to the team!`)
  })
  specifiedTeam.members = specifiedTeam.members.filter(d => d.name !== specifiedTeam.leader)
  
  const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : specifiedTeam.color
  system.run(() => {
    player.nameTag = `§${specifiedTeam.color}${specifiedTeam.tag}§r ${player.name}`
  })
  player.checkPvp()
  player.sendMessage(`${chatName} §6You have joined that team`)
  db.store("team", teams)
  return 0
})