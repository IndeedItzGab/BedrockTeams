export const config = {
  commands: {
    namespace: "team"
  },
  BedrockTeams: {
    chatName: "§6BedrockTeams",
    announceTeamJoin: false, // This is used to determine whether players joining a new team should be announced (Message is configurable in messages.yml)
    announceTeamLeave: false, // This is used to determine whether players leaving a team should be announced (Message is configurable in messages.yml)
    announceTeamDisband: false, // This is used to determine whether disbanding a team should be announced (Message is configurable in messages.yml)
    allyLimit: 5, // This is used to set the maxmimum number of allies a team can have
    maxTeamLength: 12, // This is used to limit the length of a team name
    minTeamLength: 2, // This is used to limit the length of a team name
    maxTagLength: 12, // This is used to limit the length of the teams tag (If enabled, this will display next to the players nametag above their character)
    blacklist: ["bedrockteamsisbad"], // This is a list of all the team names that are blacklisted on your server (include any names of teams that you want to ban)
    bannedChars: ',.!"�$%^&*()[]{};:#~\|`�', // This is a list of characters wich will not be allowed in team names
    allowedChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // This is a list of all characters to be allowed in team names
    bannedColors: "", // This is a list of all banned chat colors for team names using /team color <color>
    allowToggleTeamChat: true, // This option determines if users are allowed to do /team chat to toggle their team chat, instead of just /team chat message
    colorTeamName: true, // This option is used to determine if the team name should be colored in correspondance to /team color whenever the team name is displayed within the plugin 
    defaultColor: "6", // This option is used to determine the default team color using the color code of the color you want
    singleOwner: false, // If this is enabled, a slightly different set of commands will be avaliable allowing a team to only have a single owner
    invite: 120, // This is the number of seconds an invite lasts
    levels: [
      { // Level 1
        teamLimit: 10, // This is used set a maximum size for a team.
        maxWarps: 2, // This is used to determine the maximum number of warps that a team can set
        maxAdmins: 5, // The maximum number of admins a team is allowed while is has this rank
        maxOwners: 2 // The maximum number of owners a team is allowed at this rank
      },
      { // Level 2
        price: 50, // Price is determined for all levels aside level 1
        teamLimit: 20,
        maxWarps: 2,
        maxAdmins: 5,
        maxOwners: 2
      }
//       { // Level 3 - Example Format for making next level
//         price: 10,
//         timeLimit: 30,
//         maxWarps: 3,
//          maxAdmins: 5,
//          maxOwners: 2
//        }
    ],
    events: {
      death: {
        score: 0,
        spam: -1
      },
      kill: {
        score: 1,
        spam: 0
      }
    },
    minScore: 0 // The minimum score a team can have
  }
}