import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { enumFunctions } from "../../enums/enumRegistry.js"

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

  enumFunctions[enumArgs](origin, firstArgs, secondArgs)
  
  return {
    status: 1
  }
})