import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { enumAdminFunctions,enumAdminNames } from "../../enums/enumRegistry.js"

const commandInformation = {
  name: "teamadmin",
  description: "Manage teams in the game as an administrator.",
  aliases: ["teama"],
  permissionLevel: 1,
  usage:[
    {
      name: "team:teamadmin",
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
    {
      name: "args",
      type: "String",
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, enumArgs, args, args2, args3) => {  
  try {
    if(!enumAdminNames.some(d => d === enumArgs)) return origin.sourceEntity.sendMessage(messageSyntax("§4That command does't exist."))
    enumAdminFunctions[enumArgs](origin, [args, args2, args3].filter(d => d).join(" "))
  } catch (error) {
    origin.sourceEntity.sendMessage(messageSyntax(messages.internalError))
    console.error(messageSyntax(error))
  }
})