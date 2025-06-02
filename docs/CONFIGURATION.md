# Configuration
This page provides details about configuring BedrockTeams from its configuration file located in `BP/scripts/config.js`. Allowing you to adjust available options depending on your preference.

## Table of Contents
- [Configuration](#configuration)
  - [Table of Contents](#table-of-contents)
  - [Commands Setting](#commands-setting)
    - [Changing commands' namespace](#changing-commands-namespace)
  - [Team Settings](#team-settings)
    - [Changing prefix name on messages](#changing-prefix-name-on-messages)
    - [Global Announcement](#global-announcement)
    - [Team/Tag name length limitation](#teamtag-name-length-limitation)
    - [Team/Tag banned names](#teamtag-banned-names)
    - [Characters limitation](#characters-limitation)
    - [Banning a team's color](#banning-a-teams-color)
    - [Allowing toggleable team chat](#allowing-toggleable-team-chat)
    - [Allowing colorable team name](#allowing-colorable-team-name)
    - [Allowing multiple team's owners](#allowing-multiple-teams-owners)
    - [Invitation timeout](#invitation-timeout)
    - [Events](#events)
    - [Minimum team's score](#minimum-teams-score)
  - [Level Settings](#level-settings)
    - [Limitation of team's member capacity](#limitation-of-teams-member-capacity)
    - [Maximum team's warps](#maximum-teams-warps)
    - [Maximum team's admins](#maximum-teams-admins)
    - [Maximum team's owners](#maximum-teams-owners)
    - [Level's price](#levels-price)
  - [Reference](#reference)

## Commands Setting
### Changing commands' namespace
`commands.namespace: "team"`

A command's namespace is `/<namespace>:team create`. It's a unique identifier for each add-on that uses custom slash commands.

## Team Settings
### Changing prefix name on messages
`BedrockTeams.chatName: "§6BedrockTeams"`

This option is for the prefix name from BedrockTeams messages. This is what you always see when BedrockTeams send a message.

### Global Announcement
`BedrockTeams.announceTeamJoin: false`
`BedrockTeams.announceTeamLeave: false`
`BedrockTeams.announceTeamDisband: false`

These options may serve the same purpose. They are use to announce globally if someone joined, left, or disbanded a team.

### Team/Tag name length limitation
`BedrockTeams.maxTeamLength: 12`

This is used to limit the length of a team name.

`BedrockTeams.minTeamLength: 2`

This is used to limit the length of a team and tag name.

`BedrockTeams.maxTagLength: 12`
This is used to limit the length of the teams tag (If enabled, this will display next to the players nametag above their character).

### Team/Tag banned names
`BedrockTeams.blacklist: ["bedrockteamsisbad"]`

This is a list of all the team names that are blacklisted on your server (include any names of teams that you want to ban).

### Characters limitation
`BedrockTeams.bannedChars: ',.!"�$%^&*()[]{};:#~\|`�'`

This is a list of characters wich will not be allowed in team names.

`BedrockTeams.allowedChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'`

This is a list of all characters to be allowed in team names.

### Banning a team's color
`BedrockTeams.bannedColors: ""`

This is a list of all banned chat colors for team names using /team:team color \<color\>.

### Allowing toggleable team chat
`BedrockTeams.allowToggleTeamChat: true`

This option determines if users are allowed to do /team:team chat to toggle their team chat, instead of just /team:team chat message.

### Allowing colorable team name
`BedrockTeams.colorTeamName: true`

This option is used to determine if the team name should be colored in correspondance to /team:team color whenever the team name is displayed within the plugin.

`BedrockTeams.defaultColor: "6"`

This option is used to determine the default team color using the color code of the color you want.

### Allowing multiple team's owners
`BedrockTeams.singleOwner: false`

If this is enabled, a slightly different set of commands will be avaliable allowing a team to only have a single owner.

### Invitation timeout
`BedrockTeams.invite: 120`

This is the number of seconds an invite lasts.

### Events
`BedrockTeams.events.death.score: 0`

The team's score gets after a player was killer by another player.

`BedrockTeams.events.death.spam: -1`

The team's score gets after a player was spammingly killed by another player.

`BedrockTeams.events.kill.score: 1`

The team's score gets after a member killed another player.

`BedrockTeams.events.kill.spam: 0`

The team's score gets after a member spammingly killing another player.

### Minimum team's score
`BedrockTeans.minScore: 0`

The minimum score a team can have

## Level Settings
### Limitation of team's member capacity
`BedrockTeams.levels.teamLimit: 10`

This is used set a maximum member size for a team.

### Maximum team's warps
`BedrockTeams.levels.maxWarps: 2`

This is used to determine the maximum number of warps that a team can set

### Maximum team's admins
`BedrockTeams.levels.maxAdmins: 5`

The maximum number of admins a team is allowed while is has this rank

### Maximum team's owners
`BedrockTeams.levels.maxOwners: 2`

The maximum number of owners a team is allowed at this rank

### Level's price
`BedrockTeams.levels.price: 50`

Price is determined for all levels aside level 1. A level can be achieved by team's score

## Reference
- [BetterTeams Configuration File](https://github.com/booksaw/BetterTeams/blob/master/src%2Fmain%2Fresources%2Fconfig.yml)