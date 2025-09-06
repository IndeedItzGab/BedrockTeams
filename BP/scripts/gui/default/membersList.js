import { ActionFormData, MessageFormData, ModalFormData} from "@minecraft/server-ui"
import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import { messages } from "../../messages.js"
import { config } from "../../config"
import "../../utilities/messageSyntax.js"

globalThis.membersListGUI = (player, teamId, type) => {
  const teams = db.fetch("team", true)
  const team = teams.find(t => t.id === teamId)
  const form = new ActionFormData()
  .title("Members")
  
  let membersList = []
  // Owners handler
  for(const leader of team.leader) {
    let name;
    let isOnline = world.getPlayers().some(m => m.name.toLowerCase() === leader.name)
    name = `${isOnline ? messages.info.online : messages.info.offline }${messages.prefix.owner}${leader.name}§r`

    form.button(leader.name, "textures/ui/icon_steve")
    membersList.push(leader.name)
  }

  // Members and Admins handler
  for(const member of team.members) {
    let name;
    let isOnline = world.getPlayers().some(m => m.name.toLowerCase() === member.name)
    name = `${isOnline ? messages.info.online : messages.info.offline }${messages.prefix.default}${member.name}§r`
    if(member.rank === "admin") name = `${isOnline ? messages.info.online : messages.info.offline }${messages.prefix.admin}${member.name}§r`

    form.button(member.name, "textures/ui/icon_steve")
    membersList.push(member.name)
  }

  form.show(player).then(res => {
    if(res.canceled) return;
    memberInfoGUI(player, membersList[res.selection], type)
  })

}

function memberInfoGUI(player, targetName, type) {
  console.info(type)
  const teams = db.fetch("team", true)
  const team = teams.find(t => t.name === player.hasTeam().name)
  const form = new ActionFormData()
  .title(targetName)
  if(type === "owner") {
    form.button("promote")
    form.button("demote")
  }
  if(type === "admin" || type === "owner") {
    form.button("kick")
    form.button("ban")
  }

  form.show(player).then(res => {
    if(res.canceled) return;
    const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === targetName.toLowerCase())
    const specifiedMember = team.members.find(m => m.name === targetName.toLowerCase())
          
    if(type === "owner") {
      switch(res.selection) {
        case 0: // PROMOTE
          if(team.leader.some(l => l.name === args.toLowerCase())) return player.sendMessage(messageSyntax(messages.promote.max))
          if(config.BedrockTeams.singleOwner && specifiedMember.rank === "admin") return player.sendMessage(messageSyntax(messages.setowner.use))
          if(specifiedMember.rank === "default" && player.teamPerks().maxAdmins < team.members.filter(m => m.rank === "admin").length + 1) return player.sendMessage(messageSyntax(messages.promote.maxAdmins))
          if(specifiedMember.rank === "admin" && player.teamPerks().maxOwners < team.leader.length + 1) return player.sendMessage(messageSyntax(messages.promote.maxOwners))
        
          if(specifiedMember.rank === "admin") {
            team.members = team.members.filter(m => m.name !== specifiedMember.name)
            team.leader.push({
              name: specifiedMember.name
            })
          } else {
            specifiedMember.rank = "admin"
          }
          
          targetPlayer?.sendMessage(messageSyntax(messages.promote.notify))
          player.sendMessage(messageSyntax(messages.promote.success))
          db.store("team", teams)
          break;
        case 1: // DEMOTE        
          if(specifiedMember?.rank === "default") return player.sendMessage(messageSyntax(messages.demote.min))
          
          // A filter for a player whose owner of the team can demote himself.
          if(player.name.toLowerCase() !== args.toLowerCase() && team.leader.some(l => l.name === args.toLowerCase())) return player.sendMessage(messageSyntax(messages.demote.noPerm))
          if(player.name.toLowerCase() === args.toLowerCase() && player.teamPerks().maxAdmins < team.members.filter(m => m.rank === "admin").length + 1) return player.sendMessage(messageSyntax(messages.demote.maxAdmins))
          if(team.leader.length === 1 && player.name.toLowerCase() === args.toLowerCase()) return player.sendMessage(messageSyntax(messages.demote.lastOwner))
          
          if(player.name.toLowerCase() === args.toLowerCase()) {
            // Only the player whose leader can demote himself.
            team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase())
            team.members.push({
              name: player.name.toLowerCase(),
              rank: "admin"
            })
          } else {
            specifiedMember.rank = "default"
          } 
          
          targetPlayer?.sendMessage(messageSyntax(messages.demote.notify))
          player.sendMessage(messageSyntax(messages.demote.success))
          db.store("team", teams)
          break;
        case 2: // KICK
          kick(player, targetName)
          break;
        case 3: // BAN
          ban(player, targetName)
          break;
      }
    } else if(type === "admin") {
      switch(res.selection) {
        case 0:
          kick(player, targetName)
          break;
        case 1:
          ban(player, targetName)
          break;
      }
    }
  })
}

async function kick(player, targetName) {
  const teams = db.fetch("team", true)
  let team = teams.find(t => t.name === player.hasTeam().name)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === targetName.toLowerCase())          

  if(team.members.concat(team.leader).some(l => l.name === targetName.toLowerCase() && (!l.rank || l.rank === "admin"))) return player.sendMessage(messageSyntax(messages.kick.noPerm))
  
  team.members = team.members.filter(member => member.name !== targetName.toLowerCase())
  
  system.run(() => {
    targetPlayer && (targetPlayer.nameTag = targetPlayer.name);
  })
  
  targetPlayer?.sendMessage(messageSyntax(messages.kick.notify.replace("{0}", team.name)))
  player.sendMessage(messageSyntax(messages.kick.success))
  await db.store("team", teams)
  targetPlayer?.disableTeamPvp()
  targetPlayer?.allyCheckPvp()
}

async function ban(player, targetName) {
  const teams = db.fetch("team", true)
  let team = teams.find(t => t.name === player.hasTeam().name)
  const targetPlayer = world.getPlayers().find(player => player.name.toLowerCase() === targetName.toLowerCase())          

  if(team.members.concat(team.leader).some(l => l.name === targetName.toLowerCase() && (!l.rank || l.rank === "admin"))) return player.sendMessage(messageSyntax(messages.ban.noPerm))
  
  team.members = team.members.filter(member => member.name !== targetName?.toLowerCase())
  team.banned.push({
    name: targetName?.toLowerCase()
  })
  
  system.run(() => {
    targetPlayer && (targetPlayer.nameTag = targetPlayer.name);
  })
  
  
  targetPlayer?.sendMessage(messageSyntax(messages.ban.notify.replace("{0}", player.hasTeam().name)))
  player.sendMessage(messageSyntax(messages.ban.success))
  await db.store("team", teams)
  targetPlayer?.disableTeamPvp()
  targetPlayer?.allyCheckPvp()
}