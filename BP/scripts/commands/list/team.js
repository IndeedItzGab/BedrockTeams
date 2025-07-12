import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { enumFunctions, enumNames } from "../../enums/enumRegistry.js"
import { messages } from "../../messages.js"
import "../../utilities/messageSyntax.js"

const commandInformation = {
  name: "team",
  description: "Manage teams in the game.",
  aliases: [],
  usage:[
    {
      name: "team:team",
      type: "Enum",
      optional: false
    },
    {
      name: "args",
      type: "String",
      optional: true
    },
    {
      name: "args",
      type: "String",
      optional: true
    },
  ]
}

registerCommand(commandInformation, (origin, enumArgs, args, args2) => {
  try {
    if(!enumNames.some(d => d === enumArgs)) return origin.sourceEntity.sendMessage(messageSyntax("§4That command does't exist."))
    enumFunctions[enumArgs](origin, [args, args2].filter(d => d).join(" "))
  } catch (error) {
    origin.sourceEntity.sendMessage(messageSyntax(messages.internalError))
    console.error(messageSyntax(error))
  }
  //origin.sourceEntity.sendMessage(enumArgs)
  // return {
//     status: 1
//   }
})