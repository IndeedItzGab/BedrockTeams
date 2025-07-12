import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("color", async (origin, args) => {
  const firstArgs = args?.split(" ")[0]
  const secondArgs = args?.split(" ")[1]
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  let teams = db.fetch("team", true)
  let team = teams.find(team => team.name === firstArgs)

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))

  if(secondArgs.length > 1) {
    if(!chatColor[args.toUpperCase()]) return player.sendMessage(messageSyntax(messages.color.fail))
    team.color = chatColor[secondArgs.toUpperCase()]
  } else {
    if(!"1234567890abcdefi".split('').some(d => secondArgs.includes(d))) return player.sendMessage(messageSyntax(messages.color.fail))
    team.color = secondArgs
  }
    
  team.members.concat(team.leader).forEach(member => {
    system.run(() => {
      const targetMember = world.getPlayers().find(p => p.name.toLowerCase() === member.name)
      targetMember ? targetMember.nameTag = `§${team.color}${team.tag}§r ${targetMember.name}` : null
    })
  })
  
  player.sendMessage(messageSyntax(messages.admin.color.success))
  db.store("team", teams)
    
  
  return 0
})