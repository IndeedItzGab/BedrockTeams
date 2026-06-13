import { world, system } from "@minecraft/server"
import { EnumRegistry } from "../../../EnumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

let cooldowns = new Map()
EnumRegistry(messages.command.claim, async (origin, args) => {
  const player = origin.sourceEntity
  const setting = db.fetch("bedrockteams:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.cooldown.wait.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  const teams = db.fetch("team", true)

  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isAdmin()) return player.sendMessage(messageSyntax(messages.needAdmin))

  let team = teams.find(team => team.name === player.hasTeam().name)
  if(team.members.concat(team.leader).some(l => l.name === args.toLowerCase() && (!l.rank || l.rank === "admin"))) return player.sendMessage(messageSyntax(messages.ban.noPerm))

  // Listing a claim
  system.sendScriptEvent("landlocker:claimlist", JSON.stringify({
    d: {
      name: team.name // Group name of the claim list
    }
   }))

  // Deleting a claim
  system.sendScriptEvent("landlocker:abandonclaim", JSON.stringify({
    d: {
      x: player.location.x,
      z: player.location.z
    }
  }))

  // Claiming a claim
  system.sendScriptEvent("landlocker:claim", JSON.stringify({
    d: {
      radius: Math.min(4, args ?? 4)
    }
  }))
  
  system.sendScriptEvent("landlocker:claimexplosion", JSON.stringify({
    d: {
      enable: true,
      location: {
        
      }
    }
  }))
  player.sendMessage(messageSyntax(messages.ban.success))
  await db.store("team", teams)
  return 0
})