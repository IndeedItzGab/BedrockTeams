import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry("invite", (origin, args) => {
  const player = origin.sourceEntity
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === args.toLowerCase())
  let teams = db.fetch("team", true)
  let team = teams.find(team => team.name === player.hasTeam().name)

  if(!player.hasTeam()) return player.sendMessagr(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))
  if(player.teamPerks().teamLimit < team.members.length + 1) return player.sendMessage(messageSyntax(messages.invite.full))
  if(!targetPlayer) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(team.banned?.some(member => member.name === targetPlayer.name.toLowerCase())) return player.sendMessage(messageSyntax(messages.invite.banned))
  if(targetPlayer.hasTeam()) return player.sendMessage(messageSyntax(messages.invite.inTeam))
  
  system.run(() =>  {
    targetPlayer?.addTag(`teamInvite:${team.name}`)
  })
  targetPlayer?.sendMessage(messageSyntax(messages.invite.invite.replace(/\{0\}/g, team.name)))
  player.sendMessage(messageSyntax(messages.invite.success))
  system.runTimeout(() => {
    if(targetPlayer?.hasTag(`teamInvite:${team.name}`)) {
      targetPlayer?.removeTag(`teamInvite:${team.name}`)
      targetPlayer?.sendMessage(messageSyntax(messages.invite.expired.replace("{0}", team.name)))
    }
  }, 30*20)

  return 0
})