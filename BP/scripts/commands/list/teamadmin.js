import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { enumAdminFunctions } from "../../enums/enumRegistry.js"

const commandInformation = {
  name: "teamadmin",
  description: "description",
  aliases: ["teama"],
  usage:[
    {
      name: "team:admin",
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

  enumAdminFunctions[enumArgs](origin, firstArgs, secondArgs)
  
  return {
    status: 1
  }
})