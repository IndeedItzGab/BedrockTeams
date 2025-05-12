import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { config } as from "../../config.js"
const chatName = config.BedrockTeams.chatName

const commandInformation = {
  name: "create",
  description: "Create a new team.",
  aliases: [],
  usage:[
    {
      name: "name",
      type: 3,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, teamName) => {

  const player = origin.sourceEntity
  if(player.hasTeam()) return player.sendMessage(`${chatName} §4You must leave your team before doing that`)
  
  let teams = db.fetch("team", true)
  teams.push({
    name: teamName,
    color: "",
    description: "",
    leader: player.name.toLowerCase(),
    home: {},
    banned: []
    members: []
  })
  
  player.sendMessage(`${chatName}§6 Your team has been created`)
  db.store("team", teams)
  
  return {
    status: 0
  }
})