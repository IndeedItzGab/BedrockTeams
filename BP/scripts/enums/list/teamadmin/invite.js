import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.invite, async (origin, firstArgs, secondArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  if(!firstArgs || !secondArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.invite} ${messages.helpArg.admin.invite}`))

  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === firstArgs?.toLowerCase())
  let teams = db.fetch("team", true)
  let team = teams.find(team => team.name === secondArgs)

  if(!team) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(player.teamPerks().teamLimit < team.members.length + 1) return player.sendMessage(messageSyntax(messages.invite.full))
  if(!targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(team.banned?.some(member => member.name === targetPlayer.name.toLowerCase())) return player.sendMessage(messageSyntax(messages.invite.banned))
  if(targetPlayer.hasTeam()) return player.sendMessage(messageSyntax(messages.invite.inTeam))
  
  system.run(() =>  {
    targetPlayer?.addTag(`teamInvite:${team.name}`)
  })
  targetPlayer?.sendMessage(messageSyntax(messages.invite.invite.replace(/\{0\}/g, team.name)))
  player.sendMessage(messageSyntax(messages.admin.invite.success))
  system.runTimeout(() => {
    if(targetPlayer?.hasTag(`teamInvite:${team.name}`)) {
      targetPlayer?.removeTag(`teamInvite:${team.name}`)
      targetPlayer?.sendMessage(messageSyntax(messages.invite.expired.replace("{0}", team.name)))
    }
  }, 30*20)
  
  return 0
})