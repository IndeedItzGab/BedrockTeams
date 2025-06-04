import { world } from "@minecraft/server"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/messageSyntax.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  if(!event.initialSpawn) return;
  const allyReqData = db.fetch("allyReq", true)
  if(event.player.isLeader() && allyReqData.some(d => d.receiver === event.player.hasTeam()?.name))
  event.player.sendMessage(messageSyntax(messages.ally.onJoin))
})