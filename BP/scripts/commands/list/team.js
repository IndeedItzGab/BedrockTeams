import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { enumFunctions } from "../../enums/enumRegistry.js"
import { messages } from "../../messages.js"
import "../../utilities/messageSyntax.js"

const commandInformation = {
  name: "team",
  description: "description",
  aliases: [],
  usage:[
    {
      name: "team:team",
      type: 9,
      optional: false
    },
    {
      name: "args",
      type: 3,
      optional: true
    },
    {
      name: "args",
      type: 3,
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, enumArgs, firstArgs, secondArgs) => {
  try {
    //if(!enumFunctions[enumArgs]?.()) return origin.sourceEntity.sendMessage(messageSyntax("§4That command does't exist."))
    enumFunctions[enumArgs](origin, firstArgs, secondArgs)
  } catch (error) {
    origin.sourceEntity.sendMessage(messageSyntax(messages.internalError))
    console.error(messageSyntax(error))
  }
  //origin.sourceEntity.sendMessage(enumArgs)
  // return {
//     status: 1
//   }
})