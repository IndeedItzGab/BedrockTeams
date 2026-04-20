import { world, system, Player } from "@minecraft/server"
import { enumAdminRegistry } from "../../EnumRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { messages } from "../../../messages.js"
import "../../../utilities/messageSyntax.js"

enumAdminRegistry(messages.command.join, async (origin, firstArgs, secondArgs) => {
  const player = origin.sourceEntity
  if (!(player instanceof Player)) return 1
  const setiing = db.fetch("bedrockteams:setting")

  if(!firstArgs || !secondArgs) return player.sendMessage(messageSyntax(`/teamadmin ${messages.command.join} ${messages.helpArg.admin.join}`))


  let teams = db.fetch("team", true)
  let specifiedTeam = teams.find(team => team.name === secondArgs)
  const targetPlayer = world.getPlayers().find(p => p.name.toLowerCase() === firstArgs.toLowerCase())
  const targetPlayerisInTeam = teams.some(team => team.members.some(member => member.name.toLowerCase() === firstArgs.toLowerCase()) || team.leader.some(leader => leader.name.toLowerCase() === firstArgs.toLowerCase()))
  const playerExist = db.fetch("teamPlayerList", true).some(p => p.name?.toLowerCase() === firstArgs?.toLowerCase())

  if(!specifiedTeam) return player.sendMessage(messageSyntax(messages.noTeam))

  const perks = setting.teams["levels"].filter(d => !d?.price || d.price <= specifiedTeam.score).reduce((acc, cur) => {
    return (!acc || (cur.price > acc.price)) ? cur : acc;
  }, null)

  if(!playerExist) return player.sendMessage(messageSyntax(messages.noPlayer))
  if(targetPlayerisInTeam) return player.sendMessage(messageSyntax(messages.admin.notInTeam))
  if(specifiedTeam.banned.some(m => m.name === firstArgs.toLowerCase())) return player.sendMessage(messageSyntax(messages.admin.join.banned))
  if(specifiedTeam.members.length >= perks.teamLimit) return player.sendMessage(messageSyntax(messages.admin.join.full))

  specifiedTeam.members.push({
    name: firstArgs.toLowerCase(),
    rank: "default"
  })
  specifiedTeam.members.concat(specifiedTeam.leader).forEach(member => {
    world.getPlayers().find(player => player.name.toLowerCase() === member.name)?.sendMessage(messageSyntax(messages.join.notify.replace("{0}", player.name)))
  })

  const color = !setting.teams["colorTeamName"] ? setting.teams["defaulColor"] : specifiedTeam.color
  const teamTag = player?.getTags().find(tag => tag.includes("teamInvite:"))

  system.run(() => {
    player.nameTag = `§${color.color}${specifiedTeam.tag}§r ${player.name}`
    teamTag ? player?.removeTag(teamTag) : null
  })
  
  // Global Announcement
  if(setting.teams["announceTeamJoin"]) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.join.replace("{0}", firstArgs.toLowerCase()).replace("{1}", specifiedTeam.name)))
    })
  }

  targetPlayer?.sendMessage(messageSyntax(messages.admin.join.notify.replace("{0}", specifiedTeam.name)))
  player.sendMessage(messageSyntax(messages.admin.join.success))
  await db.store("team", teams)
  return 0
})