import {
  system
} from "@minecraft/server";
import { config } from "../config.js"
import { enumNames, enumAdminNames } from "../enums/enumRegistry.js"

let commands = []
export function registerCommand(comInfo, callback) {
    // Parameters Handler
    let optionalParameters = [], mandatoryParameters = []
    comInfo?.usage.forEach(parameter => {
      if(parameter.optional) {
        optionalParameters.push({
          name: parameter.name,
          type: parameter.type
        })
      } else {
        mandatoryParameters.push({
          name: parameter.name,
          type: parameter.type
        })
      }
    })
  
    // Aliases Handler
    comInfo?.aliases?.forEach(alias => {
      commands.push({
        commandInformation: {
          name: `${config.commands.namespace}:${alias}`,
          description: comInfo?.description,
          cheatsRequired: false,
          permissionLevel: comInfo.permissionLevel || 0,
          optionalParameters: optionalParameters,
          mandatoryParameters: mandatoryParameters
        },
        callback: callback
      })
    })
    
    // Main Command Handler
    commands.push({
      commandInformation: {
        name: `${config.commands.namespace}:${comInfo?.name}`,
        description: comInfo?.description,
        cheatsRequired: false,
        permissionLevel: comInfo?.permissionLevel || 0,
        optionalParameters: optionalParameters,
        mandatoryParameters: mandatoryParameters
      },
      callback: callback
    })
}



system.beforeEvents.startup.subscribe((init) => {
  init.customCommandRegistry.registerEnum(`team:team`, enumNames)
  init.customCommandRegistry.registerEnum(`team:teamadmin`, enumAdminNames)
  
  for(const command of commands) {
    init.customCommandRegistry.registerCommand(command.commandInformation, command.callback)
  }
})


