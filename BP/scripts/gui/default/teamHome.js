import { ActionFormData, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import { world, system } from "@minecraft/server";
import * as db from "../../utilities/DatabaseHandler.js";
import { messages } from "../../messages.js";
import { config } from "../../config.js";
import "./teamDisband.js"
import "./warpsList.js"
import "./membersList.js"

/*
# Visitor (A player with no team)
(1 or 2)
- Members
- Join (If the visitor has no team)

# Member (A member of that team)
(4)
- Members
- Home
- Warps
- Leave

# Admin (A admin of that team)
(5)
- Settings
- Members
- Home
- Warps
- Leave

# Owner (A owner of that team)
(5 or 6)
- Settings
- Members
- Home
- Warps
- Disband
- Leave (if the team has more than one owner)

# otherOwner (An owner of an another team, but not in the selected team)
  *This type will be included in the Visitor*
(2)
- Members
- Neutral/Ally
*/


globalThis.teamHomeGUI = (player, teamId, type) => {
  const teams = db.fetch("team", true);
  const team = teams.find(t => t.id === teamId);

  if(!team) return;

  const alliances = db.fetch("alliances", true)
  const ally = alliances.filter(d => d.teams.includes(team.name))

  let allyList = [];
  for(const t of teams) {
    if(t.name === team.name || !ally.some(d => d.teams.includes(t.name))) continue
    allyList.push(t.name)
  }

  let teamInfo = '';
  team.description ? teamInfo += `§b§aDescription: §r${team.description}\n` : null;
  team.inviteOnly ? teamInfo += `§b§aPublic: §rFalse\n` : teamInfo += `§b§aPublic: §rTrue\n`;
  teamInfo += `§b§aLevel: §r${team.level}\n`;
  teamInfo += `§b§aScore: §r${team.score}\n`;
  teamInfo += `§b§aTag: §r${team.tag}\n`;

  const form = new ActionFormData()
  .title(team.name)
  .body(`${teamInfo}
${allyList.length > 0 ? "Allies: " + allyList.join(", ") : ''}`)
  type === "admin" || type === "owner" ? form.button("Setting", "textures/ui/gear") : null;
  form.button("Members", "textures/ui/friendsbutton/navbar-friends-icon")
  type === "visitor" && !player.hasTeam() ? form.button("Join", "textures/ui/invite_base") : null;
  if(type === "visitor" && player.isLeader()) {
    if(allyList.includes(player.isLeader().name)) {
      form.button("Neutral", "textures/ui/dark_minus");
    } else {
      form.button("Ally", "textures/ui/color_plus");
    }
  }
  type === "member" || type === "admin" || type === "owner" ? form.button("Home", "textures/ui/store_home_icon") : null;
  type === "member" || type === "admin" || type === "owner" ? form.button("Warps", "textures/ui/realmsIcon.png") : null;
  type === "owner" ? form.button("Disband", "textures/ui/icon_trash") : null;
  type === "member" || type === "admin" || (type === "owner" && player.hasTeam().leader.length > 1) ? form.button("Leave", "textures/ui/icon_import") : null;


  // Functionalities
  form.show(player).then(async (res) => {
    if(res.canceled) return;
    switch(type) {
      case "visitor":
        switch(res.selection) {
          case 0:
            membersListGUI(player, team.id, type)
            break;
          case 1:
            if(!player.hasTeam()) {
              const teamTag = player?.getTags().find(tag => tag.includes("teamInvite:"))
              if(team.banned.some(m => m.name === player.name.toLowerCase())) return player.sendMessage(messageSyntax(messages.join.banned))
              if(team.members.length + 1 > player.teamPerks(team.name).teamLimit) return player.sendMessage(messageSyntax(messages.join.full))
              if(team.inviteOnly && (team.name !== teamTag?.replace("teamInvite:", "") || !teamTag)) {
                return player.sendMessage(messageSyntax(messages.join.notInvited))
              }

              team.members.push({
                name: player.name.toLowerCase(),
                rank: "default"
              })
              team.members.concat(team.leader).forEach(member => {
                world.getPlayers().find(player => player.name.toLowerCase() === member.name)?.sendMessage(messageSyntax(messages.join.notify.replace("{0}", player.name)))
              })
            
              const color = !config.BedrockTeams.colorTeamName ? config.BedrockTeams.defaulColor : team.color
              system.run(() => {
                player.nameTag = `§${color}${team.tag}§r ${player.name}`
                teamTag ? player?.removeTag(teamTag) : null
              })
              
              // Global Announcement
              if(config.BedrockTeams.announceTeamJoin) {
                world.getPlayers().forEach(p => {
                  p.sendMessage(messageSyntax(messages.announce.join.replace("{0}", player.name).replace("{1}", team.name)))
                })
              }
              
              player.sendMessage(messageSyntax(messages.join.success))
              await db.store("team", teams)
              system.run(() => {
              })
            } else if(player.isLeader()) {
              if(allyList.includes(player.isLeader().name)) {
                // Neutral entry
              } else {
                // Ally entry
              }
            }
            break;
        }
        break;
      case "member":
        switch(res.selection) {
          case 0:
            membersListGUI(player, team.id, type);
            break;
          case 1:
            home(player, team);
            break;
          case 2:
            warpsListGUI(player, type);
            break;
          case 3:
            leave(player);
            break;
        }
        break;
      case "admin":
        switch(res.selection) {
          case 0:
            teamSettingGUI(player, teams); // Unfinished
            break;
          case 1:
            membersListGUI(player, team.id, type);
            break;
          case 2:
            home(player, team);
            break;
          case 3:
            warpsListGUI(player, type);
            break;
          case 4:
            leave(player);
            break;
        }
        break;
      case "owner":
        switch(res.selection) {
          case 0:
            teamSettingGUI(player, teams); // Unfinished GUI
            break;
          case 1:
            membersListGUI(player, team.id, type);
            break; 
          case 2:
            home(player, team);
            break;
          case 3:
            warpsListGUI(player, type);
            break;
          case 4:
            teamDisbandGUI(player);
            break;
          case 5:
            leave(player);
            break;
        }
    }
  })
}


function home(player, team) {
  if(!team.home.x && !team.home.y && !team.home.z) return player.sendMessage(messageSyntax(messages.home.noHome))

  system.run(() => {
    const dimension = world.getDimension(team.home.dimension)
    player.tryTeleport({x: team.home.x, y: team.home.y, z: team.home.z}, {dimension: dimension})
  })
  
  player.sendMessage(messageSyntax(messages.home.success))
}

async function leave(player) {
  const teams = db.fetch("team", true);
  let team = teams.find(team => team.name === player.hasTeam().name);

  if(player.isLeader()) {
    team.leader = team.leader.filter(l => l.name !== player.name.toLowerCase());
  } else {
    team.members = team.members.filter(member => member.name !== player.name.toLowerCase());
  }
  system.run(() => {
    player.nameTag = player.name;
  })

  // Global Announcement
  if(config.BedrockTeams.announceTeamLeave) {
    world.getPlayers().forEach(p => {
      p.sendMessage(messageSyntax(messages.announce.leave.replace("{0}", player.name).replace("{1}", team.name)));
    })
  }
  
  player.sendMessage(messageSyntax(messages.leave.success));
  await db.store("team", teams);
}


// Team Settings GUI
// Invite Only: Togglable
// PVP: Togglable
function teamSettingGUI(player, teams) {
  const team = teams.find(t => t.name === player.hasTeam().name);
  const form = new ModalFormData()
  .title("Settings")
  .toggle("Invite Only", {defaultValue: team.inviteOnly})
  .toggle("PVP", {defaultValue: team.pvp})

  form.show(player).then((res) => {
    if(res.canceled) return;
    team.inviteOnly = res.formValues[0];
    team.pvp = res.formValues[1];
    db.store("team", teams);
    player.sendMessage(messageSyntax(messages.settings.success));
  })
}