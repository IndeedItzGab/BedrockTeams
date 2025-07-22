import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.score, async (origin, firstArgs, secondArgs, thirdArgs) => {
  thirdArgs = parseInt(thirdArgs)
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1

  if(!firstArgs || !secondArgs || !thirdArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.score} ${messages.helpArg.admin.score}`))

  let teams = db.fetch("team", true);
  let team = teams.find(t => t.name === secondArgs)

  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(0 > thirdArgs) return player.sendMessage(messageSyntax(messages.admin.score.tooSmall))

  switch(firstArgs) {
    case "set":
      team.score = Math.max(config.BedrockTeams.minScore, thirdArgs);
      break;
    case "add":
      team.score += thirdArgs;
      break;
    case "remove":
      team.score -= Math.max(config.BedrockTeams.minScore, thirdArgs);
      break;
    default:
      player.sendMessage(messageSyntax("/teamadmin score <set|add|remove> <team> <amount>"))
      return;
  }

  player.sendMessage(messageSyntax(messages.admin.score.success))
  db.store("team", teams);

  return 0
})