import { system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

const toNum = (val, fallback) => {
  const n = parseInt(val);
  return isNaN(n) ? fallback : n;
};

system.run(() => {
  let setting = db.fetch("bedrockteams:setting")
  const version = db.fetch("bedrockteams:version")
  if(!version || version !== "1.1.7") {
    setting = {
      commands: {
        cooldown: toNum(setting?.commands?.cooldown, 20)
      },
      teams: {
        displayTopTeams: setting?.teams?.displayTopTeams || false,
        announceTeamJoin: setting?.teams?.announceTeamJoin || false,
        announceTeamLeave: setting?.teams?.announceTeamLeave || false,
        announceTeamDisband: setting?.teams?.announceTeamDisband || false,
        colorTeamName: setting?.teams?.colorTeamName || true, // This option is used to determine if the team name should be colored in correspondance to /team color whenever the team name is displayed within the plugin 
        allowToggleTeamChat: setting?.teams?.allowToggleTeamChat || true, // This option determines if users are allowed to do /team chat to toggle their team chat, instead of just /team chat message
        singleOwner: setting?.teams?.singleOwner || false, // If this is enabled, a slightly different set of commands will be avaliable allowing a team to only have a single owner
        allyLimit: toNum(setting?.teams?.allyLimit, 5),
        maxTeamLength: toNum(setting?.teams?.maxTeamLength, 12),
        minTeamLength: toNum(setting?.teams?.minTeamLength, 2),
        maxTagLength: toNum(setting?.teams?.maxTagLength, 12),
        invite: toNum(setting?.teams?.invite, 120), // This is the number of seconds an invite lasts
        chatName: setting?.teams?.chatName || "§6BedrockTeams",
        blacklist: setting?.teams?.blacklist || "bedrockteamsisbad",
        bannedChars: setting?.teams?.bannedChars || ',.!"�$%^&*()[]{};:#~\|`�',
        allowedChars: setting?.teams?.allowedChars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // This is a list of all characters to be allowed in team names
        bannedColors: setting?.teams?.bannedColors || "", // This is a list of all banned chat colors for team names using /team color <color>
        defaultColor: setting?.teams?.defaultColor || "6", // This option is used to determine the default team color using the color code of the color you want
        levels: [
          { // Level 1
            name: "First Level",
            teamLimit: toNum(setting?.teams?.levels[0]?.teamLimit) || 10, // This is used set a maximum size for a team.
            maxWarps: toNum(setting?.teams?.levels[0]?.maxWarps) || 2, // This is used to determine the maximum number of warps that a team can set
            maxAdmins: toNum(setting?.teams?.levels[0]?.maxAdmins) || 5, // The maximum number of admins a team is allowed while is has this rank
            maxOwners: toNum(setting?.teams?.levels[0]?.maxOwners) || 2 // The maximum number of owners a team is allowed at this rank
          }
        ],
        events: {
          death: {
            score: toNum(setting?.teams?.events?.death?.score, 0),
            spam: toNum(setting?.teams?.events?.death?.spam, 1)
          },
          kill: {
            score: toNum(setting?.teams?.events?.kill?.score, 1),
            spam: toNum(setting?.teams?.events?.death?.spam, 0)
          }
        },
        minScore: toNum(setting?.teams?.minScore, 0) // The minimum score a team can have
      }
    }
    db.store("bedrockteams:setting", setting)
    db.store("bedrockteams:version", "1.1.7")
  }
})