import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("purge", async (origin) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  const teams = db.fetch("team", true);
  const requiredTag = player.getTags().find(tag => tag.includes("bedrockteams:purge"))

  if(!requiredTag) {
    system.run(() => player.addTag(`bedrockteams:purge:${system.currentTick + (20*10)}`))
    return player.sendMessage(messageSyntax(messages.admin.purge.confirm))
  } else if(requiredTag.split(":").pop() < system.currentTick) {
    system.run(() => {
      player.removeTag(requiredTag)
      player.addTag(`bedrockteams:purge:${system.currentTick + (20*10)}`)
    })
    return player.sendMessage(messages.admin.purge.confirm)
  }

  let cache = []
  for(let team of teams) {
    team.score = 0
    cache.push(team)
  }

  system.run(() => player.removeTag(requiredTag))
  player.sendMessage(messageSyntax(messages.admin.purge.success))
  db.cache("team", cache)
  return 0
})