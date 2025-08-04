import { ActionFormData, MessageFormData, ModalFormData} from "@minecraft/server-ui"
import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import { config } from "../../config.js"
import { messages } from "../../messages.js"
import "../../utilities/messageSyntax.js"

globalThis.teamDisbandGUI = (player) => {
  const form = new MessageFormData()
  .title("Disband the team")
  .body("Are you sure you want to disband the team?")
  .button1("No")
  .button2("Yes")

  form.show(player).then(async (res) => {
    if(res.canceled || res.selection === 0) return;

    let teams = db.fetch("team", true)
    await db.store("team", teams.filter(t => t.name !== player.hasTeam().name))
    updateDisplayTop()
    system.run(async () => {
      player.nameTag = player.name
      const team = teams.find(d => d.leader.some(l => l.name === player.name.toLowerCase()))
      team.members.concat(team.leader).forEach(member => {
        const p = world.getPlayers().find(p => p.name.toLowerCase() === member.name.toLowerCase())
        p?.disableTeamPvp()
        p ? p.nameTag = p.name : null
        p?.allyCheckPvp()
      })
      
      // Global Announcement
      if(config.BedrockTeams.announceTeamDisband) {
        world.getPlayers().forEach(p => {
          p.sendMessage(messageSyntax(messages.announce.disband.replace("{0}", team.name)))
        })
      }
      
      // Revoke the alliances between the other teams
      let alliances = db.fetch("alliances", true)
      const ally = alliances.filter(d => d.teams.includes(team.name))
      await db.store("alliances", alliances.filter(d => !d.teams.includes(team.name)))
      for(const t of teams) {
        if(t.name === team.name || !ally.some(d => d.teams.includes(t.name))) continue;
        t.members.concat(t.leader).forEach(m => {
          const p = world.getPlayers().find(a => a.name.toLowerCase() === m.name.toLowerCase())
          p?.sendMessage(messageSyntax(messages.neutral.remove.replace("{0}", team.name)))
          p?.allyCheckPvp()
        })
      }
      player.sendMessage(messageSyntax(messages.disband.success))
    })
  })
}