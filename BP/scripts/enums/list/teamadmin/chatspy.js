import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry("chatspy", async (origin) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  if(player.hasTag("bedrockteams:chatspy")) {
    system.run(() => {
      player.removeTag("bedrockteams:chatspy")
      player.sendMessage(messages.spy.stop)
    })
  } else {
    system.run(() => {
      player.addTag("bedrockteams:chatspy")
      player.sendMessage(messages.spy.start)
    })
  }
  
  return 0
})