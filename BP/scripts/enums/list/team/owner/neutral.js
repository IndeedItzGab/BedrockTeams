import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/DatabaseHandler.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"

enumRegistry(messages.command.neutral, (origin, args) => {
  const player = origin.sourceEntity
  if(!player.hasTeam()) return player.sendMessage(messageSyntax(messages.inTeam))
  if(!player.isLeader()) return player.sendMessage(messageSyntax(messages.description.noPerm))
  
  if(!args) return player.sendMessage(`/${config.commands.namespace}:team ${messages.command.neutral} ${messages.helpArg.neutral}`)
  
  let teams = db.fetch("team", true)
  let alliances = db.fetch("alliances", true)
  let allyReqData = db.fetch("allyReq", true)
  let specifiedTeam = teams.find(t => t.name === args)
  const selfTeam = player.hasTeam()
  
  if(!specifiedTeam) return player.sendMessage(messageSyntax(messages.noTeam))
  if(selfTeam.name === args) return player.sendMessage(messageSyntax(messages.neutral.self))
  if(allyReqData?.some(d => d.requester === args && d.receiver === selfTeam.name)) {
    // Responsible for rejecting a ally request from the specified team.
    player.sendMessage(messageSyntax(messages.neutral.requestremove))
    specifiedTeam.leader.forEach(l => {
      world.getPlayers().find(p => p.name.toLowerCase() === l.name.toLowerCase())?.sendMessage(messageSyntax(messages.neutral.reject.replace("{0}", selfTeam.name)))
    })
    
    allyReqData = allyReqData.filter(d => !(d.requester === args && d.receiver === selfTeam.name))
    db.store("allyReq", allyReqData)
  } else {
    // Responsible for removing the alliance between the specified team and the player's team.
    const allyObj = alliances.find(a => a.teams.includes(selfTeam.name) && a.teams.includes(specifiedTeam.name))
    if(!allyObj) return player.sendMessage(messageSyntax(messages.neutral.notAlly))
    
    // Announce the whole team that there's no more alliance between that specified team.
    selfTeam.members.concat(selfTeam.leader).forEach(m => {
      const member = world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())
      member?.sendMessage(messageSyntax(messages.neutral.remove.replace("{0}", args)))
    })
    specifiedTeam.members.concat(specifiedTeam.leader).forEach(m => {
      const member = world.getPlayers().find(p => p.name.toLowerCase() === m.name.toLowerCase())
      member?.sendMessage(messageSyntax(messages.neutral.remove.replace("{0}", selfTeam.name)))
    })
    
    alliances = alliances.filter(a => a != allyObj)
    db.store("alliances", alliances)
  }
})