import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "templace",
  description: "description",
  aliases: [],
  usage:[
    {
      name: "test",
      type: 0,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, args1) => {
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity

  return {
    status: 0
  }
})