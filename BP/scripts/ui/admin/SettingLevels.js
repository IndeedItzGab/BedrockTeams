import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"
import { ui } from "../Handler.js"

const toNum = (val, fallback) => {
  const n = parseInt(val);
  return isNaN(n) ? fallback : n;
};


export function SettingLevels(player) {
  let setting = db.fetch("bedrockteams:setting")
  const teams = setting.teams
  const levels = teams["levels"]
  const form = new ActionFormData()
  .title("§l§eLevels")
  .label("This section is about the levels that a team could achieve.")


  // levels have 0 1 (2)
  // form have 0 1 2 3
  for(const level of levels) {
    form.button(`${level.name}`)
  }
  form.button("Create", "textures/ui/Add-Ons_Nav_Icon36x36.png")

  form.show(player).then(res => {
    if(res.canceled) return ui.SettingMain(player);

    if(!levels[res.selection]) {
      SubCreateLevel(player)
    } else {
      SubSettingLevels(player, levels[res.selection])
    }
  })
}

function SubSettingLevels(player, level) {
  let setting = db.fetch("bedrockteams:setting")
  const isFirst = level.name === setting.teams.levels[0].name
  const form = new ModalFormData()
  .title(`${level.name}`)
  .textField("§lName\n§r§iThis is used to name the level.", `${level.name}`)
  if(!isFirst) form.textField("§lPrice\n§r§iThis is used for a team to achieve this level with their scores.", `${level.price}`)
  form.textField("§lMember Limitation\n§r§iThis is used to limit the available slot for each teams.", `${level.teamLimit}`)
  .textField("§lMaximum Warp(s)\n§r§iThis is the maximum warp(s) that a team can create.", `${level.maxWarps}`)
  .textField("§lMaximum Admin(s)\n§r§iThis is the maximum admin(s) that a team can have", `${level.maxAdmins}`)
  .textField("§lMaximum Owner(s)\n§r§iThis is the maximum owner(s) that a team can have if 'singleOwner' option is disabled.", `${level.maxOwners}`)
  .submitButton("Save and Update")

  form.show(player).then(async res => {
    if(res.canceled) return SettingLevels(player)

    if((isNaN(res.formValues[1]) && !isFirst) ||
       isNaN(res.formValues[2]) ||
       isNaN(res.formValues[3]) ||
       isNaN(res.formValues[4]) ||
      (isNaN(res.formValues[5] && !isFirst))) {
      return player.sendMessage(`§cYour changed was not saved because of an invalid value.`)
    }

    setting.teams.levels = (setting.teams.levels || []).filter(l => l.name !== level.name);
    setting.teams.levels.push({
      name: res.formValues[0] || level.name,
      price: toNum(!isFirst ? res.formValues[1] : undefined, level.price),
      teamLimit: toNum(isFirst ? res.formValues[1] : res.formValues[2], level.teamLimit),
      maxWarps: toNum(isFirst ? res.formValues[2] : res.formValues[3], level.maxWarps),
      maxAdmins: toNum(isFirst ? res.formValues[3] : res.formValues[4], level.maxAdmins),
      maxOwners: toNum(isFirst ? res.formValues[4] : res.formValues[5], level.maxOwners)
    });

    player.sendMessage(`§aYour changes have been saved.`)
    await db.store("bedrockteams:setting", setting)
  })
}

function SubCreateLevel(player) {
  let setting = db.fetch("bedrockteams:setting")
  const form = new ModalFormData()
  .title(`Create a level`)
  .textField("§lName\n§r§iThis is used to name the level.", '')
  .textField("§lPrice\n§r§iThis is used for a team to achieve this level with their scores.", '')
  .textField("§lMember Limitation\n§r§iThis is used to limit the available slot for each teams.", '')
  .textField("§lMaximum Warp(s)\n§r§iThis is the maximum warp(s) that a team can create.", '')
  .textField("§lMaximum Admin(s)\n§r§iThis is the maximum admin(s) that a team can have", '')
  .textField("§lMaximum Owner(s)\n§r§iThis is the maximum owner(s) that a team can have if 'singleOwner' option is disabled.", '')
  .submitButton("Create")

  form.show(player).then(async res => {
    if(res.canceled) return SubSettingLevels(player);
    setting.teams.levels.push({
      name: res.formValues[0],
      price: res.formValues[1],
      teamLimit: res.formValues[2],
      maxWarps: res.formValues[3],
      maxAdmins: res.formValues[4],
      maxOwners: res.formValues[5]
    })

    player.sendMessage(`§aYou successfully created a new team level.`)
    await db.store("bedrockteams:setting", setting)
  })

}