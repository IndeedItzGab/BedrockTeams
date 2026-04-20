import { SettingMain } from "./admin/SettingMain";
import { SettingCommands } from "./admin/SettingCommands";
import { SettingTeam } from "./admin/SettingTeam";
import { DefaultMemberList } from "./default/DefaultMemberList";
import { DefaultTeamDisband } from "./default/DefaultTeamDisband";
import { DefaultTeamHome } from "./default/DefaultTeamHome";
import { DefaultTeamList } from "./default/DefaultTeamList";
import { DefaultWarpsList } from "./default/DefaultWarpsList";
import { SettingLevels } from "./admin/SettingLevels";
import { DefaultTeamSetting } from "./default/DefaultTeamSetting";

export const ui = {
  // Admin User Interface (accessible by operators only)
  SettingMain,
  SettingCommands,
  SettingTeam,
  SettingLevels,

  // Default User Interface (accessible by anyone)
  DefaultMemberList,
  DefaultTeamDisband,
  DefaultTeamHome,
  DefaultTeamList,
  DefaultWarpsList,
  DefaultTeamSetting
}