import { ActionFormData, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import { world, system } from "@minecraft/server";
import * as db from "../../utilities/DatabaseHandler.js";
import "../../utilities/messageSyntax.js";
import { messages } from "../../messages.js";
import { config } from "../../config.js";
import "./teamHome.js";

globalThis.teamListGUI = (player) => {
  const teams = db.fetch("team", true);

  // Initial Declaration of the GUI
  const form = new ActionFormData()
  .title("Teams")
  
  let listedTeams = [], type = "visitor";

  // Include "Create" button when the player has no team
  if(!player.hasTeam()) form.button("Create a team")
  
  // If the player has a team, it make sure to prioritize the team's button at the top
  if(player.hasTeam()) {
    const t = teams.find(t => t.id === player.hasTeam().id)
    form.button(`${t.name} (§aTeam§r)`, "textures/ui/green");
    listedTeams.push(t.id)
  }

  // List all the teams in the GUI as a button
  for(const team of teams) {
    if(listedTeams.includes(team.id)) continue;
    form.button(team.name, "textures/ui/green");
    listedTeams.push(team.id);
  }

  system.run(() => {
    form.show(player).then(res => {
      if(res.canceled) return;

      // "Create a team" GUI handler
      if(!player.hasTeam() && res.selection === 0) {

        let teamGeneratedId;
        for (let i = 1; i <= 500; i++) {
          if(!teams.some(t => t.id === `team${i}`)) {
            teamGeneratedId = `team${i}`
            break;
          }
        }

        // Initial declaration of the create team GUI
        const createGUI = new ModalFormData()
        .title("Create a team")
        .textField("The name of your team", "MyTeam")
        .submitButton("Create")

        createGUI.show(player).then(res => {
          if(res.canceled) return;
          if(!res.formValues[0]) return player.sendMessage(messageSyntax("§4You must input a name for your team to create."))
          teams.push({
            name: res.formValues[0].replace("/§[1234567890abcdefklmnori]/g", ""),
            id: teamGeneratedId,
            color: config.BedrockTeams.defaultColor,
            tag: res.formValues[0].replace("/§[1234567890abcdefklmnori]/g", ""),
            description: "",
            inviteOnly: true,
            score: 0,
            level: 1,
            leader: [{
              name: player.name.toLowerCase()
            }],
            pvp: false,
            version: "1.0.2",
            home: {},
            warp: [],
            banned: [],
            members: []
          })
          db.store("team", teams);
          player.sendMessage(messageSyntax(messages.create.success));
        })
        return;
      }

      // Handle selected team from the list
      const team = teams.find(t => t.id === listedTeams[res.selection - !player.hasTeam() ? 1 : 0]);
      const memberInfo = team.members.find(m => m.name.toLowerCase() === player.name.toLowerCase());
      if(memberInfo?.rank === "default") {
        type = "member"; // If the player is an member of that selected team..
      } else if(memberInfo?.rank === "admin") {
        type = "admin"; // If the player is an admin of that selected team.
      } else if(team.leader.some(l => l.name.toLowerCase() === player.name.toLowerCase())) {
        type = "owner"; // If the player is an owner of that selected team.
      } // else: type = "visitor"

      // Show the information about the selected team vai GUI
      teamHomeGUI(player, team.id, type);
    })
  })
}