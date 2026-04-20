import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.tag, (origin, args) => {
  const player = origin.sourceEntity
  if(!args) return player.sendMessage(`/team ${messages.command.tag} ${messages.helpArg.tag}`)
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  let teams = db.fetch("team", true)
  
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.tag.noPerm))
  if(setting.teams["blacklist"].includes(args)) return player.sendMessage(messageSyntax(messages.tag.banned))
  if(setting.teams["bannedChars"].split('').some(char => args.includes(char)) || ![...args].every(char => setting.teams["allowedChars"].includes(char))) return player.sendMessage(messageSyntax(messages.bannedChar))
  if(setting.teams["maxTagLength"] < args.length) return player.sendMessage(messageSyntax(messages.tag.maxLength))
  
  let team = teams.find(t => t.name === player.hasTeam().name)
  team.tag = args.replace("/§[1234567890abcdefklmnori]/g", "")
  const color = !setting.teams["colorTeamName"] ? setting.teams["defaulColor"] : team.color
  team.members.concat(team.leader).forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember ? targetMember.nameTag = `§${color}${team.tag}§r ${targetMember.name}` : null
    })
  })
  player.sendMessage(messageSyntax(messages.tag.success))
  db.store("team", teams)
  return 0
})