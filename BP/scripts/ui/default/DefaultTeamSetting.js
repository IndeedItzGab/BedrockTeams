import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"
import { messages } from "../../messages.js"
import "../../utilities/messageSyntax.js"
import { ui } from "../Handler.js"

export function DefaultTeamSetting(player, type) {
  const teams = db.fetch("team", true)
  const team = teams.find(t => t.name === player.hasTeam().name);
  const form = new ModalFormData()
  .title("Settings")
  .toggle("§lInvite Only\n§r§iThis will make the team private and will require to invite the certain player to let them join.", {defaultValue: team.inviteOnly})
  .toggle("§lPVP\n§r§iThis is used to allow all members of the team to damage each others.", {defaultValue: team.pvp})

  form.show(player).then((res) => {
    if(res.canceled) return ui.DefaultTeamHome(player, team.id, type);
    team.inviteOnly = res.formValues[0];
    team.pvp = res.formValues[1];
    db.store("team", teams);
    player.sendMessage(messageSyntax(messages.settings.success));
  })
}