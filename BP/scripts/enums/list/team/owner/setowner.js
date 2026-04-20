import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.setowner, (origin, args) => {
  const player = origin.sourceEntity
  const setting = db.fetch("bedrockteams:setting")

  if(!setting.teams["singleOwner"]) return player.sendMessahe(messageSyntax(messages.singleOwnerOnlyCommand))
  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  if(!args) return player.sendMessage(messageSyntax(`/team ${messages.command.setowner} ${messages.helpArg.setowner}`))
  let teams = db.fetch("team", true)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.needOwner))
  if(!playerExist && !targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(playerExist && !(player.hasTeam().members.some(member => member.name === args?.toLowerCase()) || player.hasTeam().leader.some(l => l.name === args?.toLowerCase()))) return player.sendMessage(messageSyntax(messages.needSameTeam))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  const specifiedMember = team.members.find(m => m.name === args.toLowerCase())
  
  team.members = team.members.filter(m => m.name !== specifiedMember.name)
  team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase())
  team.leader.push({
    name: specifiedMember.name
  })
  team.members.push({
    name: player.name.toLowerCase(),
    rank: "default"
  })
  
  targetPlayer?.sendMessage(messageSyntax(messages.setowner.notify))
  player.sendMessage(messageSyntax(messages.setowner.success))
  db.store("team", teams)
  return 0
})