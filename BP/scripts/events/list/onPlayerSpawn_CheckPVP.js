import { world, system} from "@minecraft/server"

world.afterEvents.playerSpawn.subscribe(event => {
  event.player.checkPvp()
})