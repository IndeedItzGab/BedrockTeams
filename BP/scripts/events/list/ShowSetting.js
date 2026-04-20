import { world } from "@minecraft/server"
import { ui } from "../../ui/Handler.js"

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  if(event.itemStack.typeId !== "bedrockteams:setting" || player.typeId !== "minecraft:player") return;
  if(player.playerPermissionLevel !== 2) return player.sendMessage("§cYou do not have permission to use this item.")
    
  ui.SettingMain(player)
})