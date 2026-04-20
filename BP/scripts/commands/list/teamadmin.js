import { registerCommand }  from "../CommandRegistry.js"
import { messages } from "../../messages.js"
import { enumAdminFunctions,enumAdminNames } from "../../enums/EnumRegistry.js"

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
    enumAdminFunctions[enumArgs](origin, args, args2, args3)
  } catch (error) {
    origin.sourceEntity.sendMessage(messageSyntax(messages.internalError))
    console.error(messageSyntax(error))
  }
})