import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../enumRegistry.js"
import * as db from "../../../utilities/storage.js"
import { config } from "../../../config.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.setwarp, async (origin, firstArgs, secondArgs, thirdArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  if(!firstArgs || !secondArgs) return player.sendMessage(messageSyntax(`/${config.commands.namespace}:teamadmin ${messages.command.setwarp} ${messages.helpArg.admin.setwarp}`))

  let teams = db.fetch("team", true)
  let team = teams.find(t => t.name === firstArgs)
  const perks = config.BedrockTeams.levels.filter(d => !d?.price || d.price <= team?.score).reduce((acc, cur) => {
    return (!acc || (cur.price > acc.price)) ? cur : acc;
  }, null)


  if(!team) return player.sendMessage(messageSyntax(messages.noTeam))
  if(config.BedrockTeams.bannedChars.split('').some(char => secondArgs?.includes(char)) || ![...secondArgs].every(char => config.BedrockTeams.allowedChars?.includes(char))) return player.sendMessage(messageSyntax(messages.setwarp.char))
  if(team.warp.some(w => w.name.toLowerCase() === secondArgs?.toLowerCase())) return player.sendMessage(messageSyntax(messages.setwarp.exist))
  if(team.warp.length + 1 > perks.maxWarps) return player.sendMessage(messageSyntax(messages.admin.setwarp.max))


  team.warp.push({
    name: secondArgs.replace("/§[1234567890abcdefklmnori]/g", ""),
    password: thirdArgs,
    dimension: player.dimension.id,
    x: player.location.x,
    y: player.location.y,
    z: player.location.z
  })
  
  player.sendMessage(messageSyntax(messages.admin.setwarp.success))
  db.store("team", teams)

  return 0
})