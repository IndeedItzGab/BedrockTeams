import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"
import { ui } from "../Handler.js"

const toNum = (val, fallback) => {
  const n = parseInt(val);
  return isNaN(n) ? fallback : n;
};

export function SettingCommands(player) {
  let setting = db.fetch("bedrockteams:setting")
  let commands = setting.commands
  const form = new ModalFormData()
  .title("§l§eCommands")
  .label("This section is about slash commands configurations.")
  .textField("§lCooldown\n§r§iThis is the cooldown of each commands.", `${commands["cooldown"]}`)
  .submitButton("Save and Update")

  form.show(player).then(res => {
    if(res.canceled) return ui.SettingMain(player);

    // Value Validation
    if(isNaN(res.formValues[1])) {
      return player.sendMessage(`§cYour changed was not saved because of an invalid value.`)
    }
    
    setting = {
      ...setting,
      commands: {
        ...setting.commands,
        cooldown: toNum(res.formValues[1], commands["cooldown"])
      }
    }
    player.sendMessage(`§aYour changes have been saved.`)
    db.store("bedrockteams:setting", setting)
  })
}