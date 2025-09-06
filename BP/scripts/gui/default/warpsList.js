import { ActionFormData, MessageFormData, ModalFormData} from "@minecraft/server-ui"
import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import { messages } from "../../messages.js";
import { config } from "../../config.js";
import "../../utilities/messageSyntax.js"

/*
Member
- Teleport with password or not
Admin/Owner
- Teleport with password or not
- Deletion
*/

globalThis.warpsListGUI = (player, type) => {
  const teams = db.fetch("team", true);
  const team = teams.find(t => t.name === player.hasTeam().name);

  const form = new ActionFormData()
  .title("Warps")
  console.info(type)
  type === "member" || type === "visitor" ? null : form.button("Create") ;
  
  for(const warp of team.warp) {
    form.button(warp.name)
  }

  form.show(player).then(res => {
    if(res.canceled) return;
    if(res.selection === 0) {
      if(type === "member") return;
      const warpCreateForm = new ModalFormData()
      .title("Create a warp")
      .textField("Name (Required):", "Name")
      .textField("Password (Optional):", "Password")
      .submitButton("Create")

      warpCreateForm.show(player).then(res => {
        // create warp entry
        if(res.canceled) return;
        const name = res.formValues[0];
        const password = res.formValues[1];

        if(team.warp.some(w => w.name.toLowerCase() === argsFirst?.toLowerCase())) return player.sendMessage(messageSyntax(messages.setwarp.exist))
        if(team.warp.length + 1 > player.teamPerks(team.name).maxWarps) return player.sendMessage(messageSyntax(messages.setwarp.max))
        team.warp.push({
          name: name.replace("/§[1234567890abcdefklmnori]/g", ""),
          password: password,
          dimension: player.dimension.id,
          x: player.location.x,
          y: player.location.y,
          z: player.location.z
        })
        
        player.sendMessage(messageSyntax(messages.setwarp.success))
        db.store("team", teams)
      })
    } else {
      const warp = team.warp[res.selection-1]
      if(type === "member") {
        teleportEntry(player, warp, type)
      } else {
        const warpForm = new MessageFormData()
        .title("Select Action")
        .body("Would you like to teleport to this warp's location or delete it?")
        .button1("Teleport")
        .button2("Delete")

        warpForm.show(player).then(warpFormRes => {
          if(warpFormRes.canceled) return;
          if(warpFormRes.selection === 0) {
            teleportEntry(player, warp, type)
          } else if(warpFormRes.selection === 1) {
            deletionEntry(player, warp, type)
          }
        })
      }
    }
  })
}

function teleportEntry(player, warp, type) {
  if(warp.password && type !== "owner") {
    // If there's a password
    const form = new ModalFormData()
    .title(`${warp.name}'s credential`)
    .textField("Password", "Password")
    .submitButton("Confirm")

    form.show(player).then(res => {
      if(res.canceled) return;
      if(res.formValues[0] !== warp.password) return player.sendMessage(messages.warp.invalidPassword)
      system.run(() => {
        const dimension = world.getDimension(warp.dimension)
        const teleport = player.tryTeleport({x: warp.x, y: warp.y, z: warp.z}, {dimension})
        if(!teleport) return player.sendMessage(`${config.BedrockTeams.chatName} §4The location of that warp could not be found`)
      })
      player.sendMessage(messageSyntax(messages.warp.success))
    })
  } else {
    // No password needed
    system.run(() => {
      const dimension = world.getDimension(warp.dimension)
      const teleport = player.tryTeleport({x: warp.x, y: warp.y, z: warp.z}, {dimension})
      if(!teleport) return player.sendMessage(`${config.BedrockTeams.chatName} §4The location of that warp could not be found`)
    })
    player.sendMessage(messageSyntax(messages.warp.success))
  }
}

function deletionEntry(player, warp, type) {
  const teams = db.fetch("team", true);
  let team = teams.find(t => t.name === player.hasTeam().name);
  if(warp.password && type !== "owner") {
    const form = new ModalFormData()
    .title(`${warp.name}'s credential`)
    .textField("Password", "Password")
    .submitButton("Confirm")

    form.show(player).then(res => {
      if(res.canceled) return;
      if(res.formValues[0] !== warp.password) return player.sendMessage(messages.warp.invalidPassword)
      team.warp = team.warp.filter(w => w.name !== warp.name)
      player.sendMessage(messageSyntax(messages.delwarp.success))
      db.store("team", teams)
    })
  } else {
    team.warp = team.warp.filter(w => w.name !== warp.name)
    player.sendMessage(messageSyntax(messages.delwarp.success))
    db.store("team", teams)
  }
}