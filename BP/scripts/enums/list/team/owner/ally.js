import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.ally, async (origin, args) => {
  
  const player = origin.sourceEntity
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.description.noPerm))

  // Fetch all the alliases requests existing
  let allyDataReq = db.fetch("allyReq", true)
  let allyReq = allyDataReq.filter(d => d?.receiver === player.hasTeam()?.name)
  let specifiedAllyReq = allyReq.find(d => d?.requester === args)
  
  // Check whether there's an ally request or not.
  if(!args) {
    if(allyReq.length === 0) {
      // Call if there is no alliance request from other team.
      return player.sendMessage(messageSyntax(messages.ally.noRequests))
    } else {
      // Call if there are alliances request from other teams and list them all
      return player.sendMessage(messageSyntax(messages.ally.from.replace("{0}", allyReq.map(v => v.requester))))
    }
  }
  
  // Declare all possible repeatable functions as variables
  let alliances = db.fetch("alliances", true) // Fetch all the data in "alliases"
  let teams = db.fetch("team", true) // Fetch all the data in "team"
  const targetTeam = teams.find(d => d.name === args) // Find the specified team if it exists
  const selfTeam = player.hasTeam() // The player's current team
  
  // Call if the specified team does not exists
  if(!targetTeam) return player.sendMessage(messageSyntax(messages.noTeam))
  
  // Responsible for accepting and requesting an alliance on other team
  if(specifiedAllyReq) {
    // Check whether the team already reached the maximum alliances limit
    if(alliances.filter(d => d.teams.includes(selfTeam.name)).length >= config.BedrockTeams.allyLimit) return player.sendMessage(messageSyntax(messages.ally.limit))
    // Call if the requests exists and create a new object in "alliases"
    let aTag;
    for(let i = 1; i<501; i++) {
      // Check if the tag already exists from ally1 to ally500 to ensure no alliances conflict happens
      if(alliances.some(d => d.teamTag === `ally${i}`)) continue
      aTag = `ally${i}`; // Assign the value of aTag for the current alliance to use
      break;
    }
    
    // Add the new object in alliances
    alliances.push({
      teams: [selfTeam.name, targetTeam.name],
      allyTag: aTag
    })
    
    // Update the data
    allyDataReq = allyDataReq.filter(d => !(d.requester === targetTeam.name && d.receiver === selfTeam.name))
    await db.store("alliances", alliances)
    db.store("allyReq", allyDataReq)
    
    // Announce the alliances between the teams in all online team's members & check tag alliance
    selfTeam.members.concat(selfTeam.leader).forEach(async (m) => {
      const member = world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())
      member?.sendMessage(messageSyntax(messages.ally.ally.replace("{0}", targetTeam.name)))
      await member?.allyCheckPvp(1, aTag)
    })
    targetTeam.members.concat(targetTeam.leader).forEach(async (m) => {
      const member = world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())
      member?.sendMessage(messageSyntax(messages.ally.ally.replace("{0}", selfTeam.name)))
      await member?.allyCheckPvp(1, aTag)
    })
  } else {
    if(selfTeam.name === targetTeam.name) return player.sendMessage(messageSyntax(messages.ally.self))
    if(allyDataReq.some(d => d?.requester === selfTeam.name && d?.receiver === args)) return player.sendMessage(messageSyntax(messages.ally.alreadyrequest))
    if(alliances.some(d => d.teams.includes(selfTeam.name) && d.teams.includes(args))) return player.sendMessage(messageSyntax(messages.ally.already))
    allyDataReq.push({
      requester: selfTeam.name,
      receiver: args
    })
    
    player.sendMessage(messageSyntax(messages.ally.requested))
    targetTeam.leader.forEach(l => {
      world.getPlayers().find(p => p.name.toLowerCase() === l.name.toLowerCase())?.sendMessage(messageSyntax(messages.ally.request.replace("{0}", selfTeam.name)))
    })
    
    db.store("allyReq", allyDataReq)
  }
})