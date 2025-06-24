import { world } from "@minecraft/server"

world.afterEvents.worldLoad.subscribe((event) => {
  updateDisplayTop()
})