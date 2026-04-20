import { ActionFormData } from "@minecraft/server-ui"
import { ui } from "../Handler.js"

export function SettingMain(player) {
  const settingUi = new ActionFormData()
  .title(`§l§eBedrockTeams`)
  .body(`§bVersion:§r 1.1.7\n§bDeveloper: §r@IndeedItzGab\nConfigurable setting for operators to tweak or make changes to match their preferences.`)
  .button("Commands", "textures/blocks/command_block_side_mipmap.png")
  .button("Teams", "textures/ui/friendsbutton/navbar-friends-icon.png")
  .button("Levels", "textures/ui/sidebar_icons/star.png")

  settingUi.show(player).then(res => {
    if(res.cancelled) return;
    switch(res.selection) {
      case 0:
        // Commands
        ui.SettingCommands(player);
        break;
      case 1:
        // Teams
        ui.SettingTeam(player);
        break;
      case 2:
        // Levels
        ui.SettingLevels(player);
    }
  })
}