import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.ban, async (origin, args) => {
  const player = origin.sourceEntity

  if(!args) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:team ${messages.command.ban} ${messages.helpArg.ban}`))
  const targetPlayer = world.getPlayers().find(player => player.name?.toLowerCase() === args?.toLowerCase())
  const teams = db.fetch("team", true)
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name?.toLowerCase() === args?.toLowerCase())

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  if(player.hasTeam()?.banned.some(member => member.name === args?.toLowerCase())) return player.sendMessage(messageSyntax(messages.ban.already))
  if(!playerExist && !targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(playerExist && !player.hasTeam().members.some(member => member.name === args?.toLowerCase())) return player.sendMessage(messageSyntax(messages.needSameTeam))

  let team = teams.find(team => team.name === player.hasTeam().name)
  if(team.members.concat(team.leader).some(l => l.name === args.toLowerCase() && (!l.rank || l.rank === "admin"))) return player.sendMessage(messageSyntax(messages.ban.noPerm))


  team.members = team.members.filter(member => member.name !== args?.toLowerCase())
  team.banned.push({
    name: args?.toLowerCase()
  })
  
  system.run(() => {
    targetPlayer && (targetPlayer.nameTag = targetPlayer.name);
  })
  
  
  targetPlayer?.sendMessage(messageSyntax(messages.ban.notify.replace("{0}", player.hasTeam().name)))
  player.sendMessage(messageSyntax(messages.ban.success))
  await db.store("team", teams)
  return 0
})