import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.unban, (origin, args) => {
  const player = origin.sourceEntity

  if(!args) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:team ${messages.command.unban} ${messages.helpArg.unban}`))
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  const teams = db.fetch("team", true)
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name.toLowerCase() === args.toLowerCase())

  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  if(!player.hasTeam().banned.some(member => member.name === args.toLowerCase())) return player.sendMessage(messageSyntax(messages.unban.not))
  if(targetPlayer?.isLeader() || targetPlayer?.isAdmin()) return player.sendMessage(messageSyntax(messages.unban.noPerm))
  
  let team = teams.find(team => team.name === player.hasTeam().name)
  team.banned = team.banned.filter(member => member.name !== args.toLowerCase())

  targetPlayer?.sendMessage(messageSyntax(messages.unban.notify.replace("{0}", team.name)))
  player.sendMessage(messageSyntax(messages.unban.success))
  db.store("team", teams)
  return 0
})