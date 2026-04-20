import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"
import { ui } from "../Handler.js"

const toNum = (val, fallback) => {
  const n = parseInt(val);
  return isNaN(n) ? fallback : n;
};

export function SettingTeam(player) {
  let setting = db.fetch("bedrockteams:setting")
  const teams = setting?.teams
  const form = new ModalFormData()
  .title("§l§eTeams")
  .label("This section is about teams configurations.")
  .toggle("§lDisplay Leaderboard\n§r§iThis is used to determine whether the script should display the top teams depending on their scores.", {defaultValue: teams["displayTopTeams"]})
  .toggle("§lAnnounce Member Join\n§r§iThis is used to determine whether players joining a new team should be announced.", {defaultValue: teams["announceTeamJoin"]})
  .toggle("§lAnnounce Member Leave\n§r§iThis is used to determine whether players leaving a team should be announced.", {defaultValue: teams["announceTeamLeave"]})
  .toggle("§lAnnounce Team Disband\n§r§iThis is used to determine whether disbanding a team should be announced.", {defaultValue: teams["announceTeamDisband"]})
  .toggle("§lAllow Team Color\n§r§iThis option is used to determine if the team name should be colored in correspondance to /team color whenever the team name is displayed within the script.", {defaultValue: teams["colorTeamName"]})
  .toggle("§lAllow Toggle Team Chat\n§r§iThis option determines if users are allowed to do /team chat to toggle their team chat, instead of just /team chat message.", {defaultValue: teams["allowToggleTeamChat"]})
  .toggle("§lSingle Owner only\n§r§iIf this is enabled, a slightly different set of commands will be avaliable allowing a team to only have a single owner.", {defaultValue: teams["singleOwner"]})
  .textField("§lAlliance Limit\n§r§iThis is used to set the maxmimum number of allies a team can have.", `${teams["allyLimit"]}`)
  .textField("§lMaximum Team Name Length\n§r§iThis is used to limit the length of a team name.", `${teams["maxTeamLength"]}`)
  .textField("§lMinimum Team Name Lenght\n§r§iThis is used to limit the length of a team name.", `${teams["minTeamLength"]}`)
  .textField("§lMaximum Tag Length\n§r§iThis is used to limit the length of the teams tag (If enabled, this will display next to the players nametag above their character).", `${teams["maxTagLength"]}`)
  .textField("§lInvitation Timeout\n§r§iThis is the number of seconds an invite lasts.", `${teams["invite"]}`)
  .textField("§lPrefix Chat name\n§r§iThis is used in every system messages sent vai BedrockTeams.", `${teams["chatName"]}`)
  .textField("§lBlacklist Team Name\n§r§iThis is a list of all the team names that are blacklisted on your server. Seperated by comma (,) and you may include any names of teams that you want to ban.", `${teams["blacklist"]}`)
  .textField("§lBanned Character(s)\n§r§iThis is a list of characters wich will not be allowed in team names.", `${teams["bannedChars"]}`)
  .textField("§lAllowed Character(s)\n§r§iThis is a list of all characters to be allowed in team names.", `${teams["allowedChars"]}`)
  .textField("§lBanned Color(s)\n§r§iThis is a list of all banned chat colors for team names using /team color <color>.", `${teams["bannedColors"]}`)
  .textField("§lDefault Team Color\n§r§iThis option is used to determine the default team color using the color code of the color you want.", `${teams["defaultColor"]}`)
  .textField("§lMinimum Score\n§r§iThe minimum score a team can have.", `${teams["minScore"]}`)
  .textField("§lDeath Score\n§r§iScore changes for when a player dies.", `${teams["events"].death.score}`)
  .textField("§lDeath Spam\n§r§iScore changes for when a player dies multiple times in a short time.", `${teams["events"].death.spam}`)
  .textField("§lKill Score\n§r§iScore changes for when a player kills another player.", `${teams["events"].kill.score}`)
  .textField("§lKill Spam\n§r§iScore changes for when a player kills another player multiple times in a short time.", `${teams["events"].kill.spam}`)
  .submitButton("Save and Update")

  form.show(player).then(res => {
    if(res.canceled) return ui.SettingMain(player);

    // Value Validation
    if(isNaN(res.formValues[8]) ||
      isNaN(res.formValues[9]) ||
      isNaN(res.formValues[10]) ||
      isNaN(res.formValues[11]) ||
      isNaN(res.formValues[12])) {
      return player.sendMessage(`§cYour changed was not saved because of an invalid value.`)
    }

    setting = {
      ...setting,
      teams: {
        ...setting.teams,
        displayTopTeams: res.formValues[1],
        announceTeamJoin: res.formValues[2],
        announceTeamLeave: res.formValues[3],
        announceTeamDisband: res.formValues[4],
        colorTeamName: res.formValues[5],
        allowToggleTeamChat: res.formValues[6],
        singleOwner: res.formValues[7],
        allyLimit: toNum(res.formValues[8], teams["allyLimit"]),
        maxTeamLength: toNum(res.formValues[9], teams["maxTeamLength"]),
        minTeamLength: toNum(res.formValues[10], teams["minTeamLength"]),
        maxTagLength: toNum(res.formValues[11], teams["maxTagLength"]),
        invite: toNum(res.formValues[12], teams["invite"]),
        chatName: res.formValues[13] || teams["chatName"],
        blacklist: res.formValues[14] || teams["blacklist"],
        bannedChars: res.formValues[15] || teams["bannedChars"],
        allowedChars: res.formValues[16] || teams["allowedChars"],
        bannedColors: res.formValues[17] || teams["bannedColors"],
        defaultColor: res.formValues[18] || teams["defaultColor"],
        events: {
          death: {
            score: toNum(res.formValues[20], teams["events"].death.score),
            spam: toNum(res.formValues[21], teams["events"].death.spam)
          },
          kill: {
            score: toNum(res.formValues[22], teams["events"].kill.score),
            spam: toNum(res.formValues[23], teams["events"].kill.spam)
          }
        },
        minScore: toNum(res.formValues[19], teams["minScore"])
      },
    }
    player.sendMessage(`§aYour changes have been saved.`)
    db.store("bedrockteams:setting", setting)
  })
}