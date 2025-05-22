import {
  world,
  system,
  EquipmentSlot,
  Player,
  ItemStack,
  ItemTypes
} from "@minecraft/server"
import * as gametest from "@minecraft/server-gametest"
import * as db from "../../utilities/storage.js"


world.beforeEvents.chatSend.subscribe(e => {
  const teamChests = db.fetch("teamChest", true)
  teamChests.push({
    name: e.sender.hasTeam().name,
    container: [
      {
        typeId: "minecraft:golden_shovel"
      }
    ]
  })
  db.store("teamChest", teamChests)
  I(e.sender)
})


function I(viewer) {
  system.run(() => {
    viewer.runCommand("ride @s stop_riding");

    let teamChests = db.fetch("teamChest", true)
    let teamChest = teamChests.find(d => d.name === viewer.hasTeam().name)
    if(!teamChest) return;
    let entity = viewer.dimension.spawnEntity("bedrockteams:team_chest", viewer.location);
    let container = entity.getComponent("inventory").container;
  
  
    for (let i = 0; i < 27; i++) {
      if (teamChest.container[i] && teamChest.container[i].typeId !== "air") container.setItem(i, new ItemStack(ItemTypes.get(teamChest.container[i]?.typeId)));
    }
  
    viewer.runCommand("ride @s start_riding @e[type=bedrockteams:team_chest,c=1] teleport_ride");
    viewer.chat("entity")
    entity.addTag("atTeamChest");
 
  })
 //entity.setDynamicProperty("r4isen1920_invsee:old_log", p(l(entity)));
}