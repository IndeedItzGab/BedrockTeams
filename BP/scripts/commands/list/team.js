import { registerCommand }  from "../CommandRegistry.js"
import { enumFunctions, enumNames } from "../../enums/EnumRegistry.js"
import { messages } from "../../messages.js"
import { ui } from "../../ui/Handler.js"
import "../../utilities/messageSyntax.js"

const commandInformation = {
  name: "team",
  description: "Manage teams in the game.",
  aliases: [],
  usage:[
    {
      name: "team:team",
      type: "Enum",
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
    },
  ]
}

registerCommand(commandInformation, (origin, enumArgs, args, args2) => {
  try {
    if(!enumArgs) return ui.DefaultTeamList(origin.sourceEntity);
    if(!enumNames.some(d => d === enumArgs)) return origin.sourceEntity.sendMessage(messageSyntax("§4That command does't exist."));
    enumFunctions[enumArgs](origin, args, args2);
  } catch (error) {
    origin.sourceEntity.sendMessage(messageSyntax(messages.internalError));
    console.error(messageSyntax(error));
  }
  //origin.sourceEntity.sendMessage(enumArgs)
  // return {
//     status: 1
//   }
})