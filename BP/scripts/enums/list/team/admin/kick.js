import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.kick, async (origin, args) => {
  const player = origin.sourceEntity
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  if(!args) return player.sendMessage(messageSyntax(`/team ${messages.command.kick} ${messages.helpArg.kick}`))
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const teams = db.fetch("team", true)
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  if(!playerExist && !targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(playerExist && !player.hasTeam().members.some(member => member.name === args.toLowerCase())) return player.sendMessage(messageSyntax(messages.needSameTeam))

  let team = teams.find(team => team.name === player.hasTeam().name)
  if(team.members.concat(team.leader).some(l => l.name === args.toLowerCase() && (!l.rank || l.rank === "admin"))) return player.sendMessage(messageSyntax(messages.kick.noPerm))
  
  team.members = team.members.filter(member => member.name !== args.toLowerCase())
  
  system.run(() => {
    targetPlayer && (targetPlayer.nameTag = targetPlayer.name);
  })
  
  targetPlayer?.sendMessage(messageSyntax(messages.kick.notify.replace("{0}", team.name)))
  player.sendMessage(messageSyntax(messages.kick.success))
  await db.store("team", teams)
  return 0
})