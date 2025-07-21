# Available Commands
Default commands namespace: `team`

## Non-Operator Commands 
These commands are meant to be use by anyone with or without the permission level of a operator.
|NAME                 |PARAMETERS                 |DESCRIPTION                                                              |
|---------------------|---------------------------|-------------------------------------------------------------------------|
|team create          |\<name\>                   |Create your own team.                                                    |
|team disband         |                           |Abandon the team.                                                        |
|team invite          |\<player\>                 |Invite a particular player to your team.                                 |
|team join            |\<team\>                   |Join the speified team.                                                  |
|team leave           |                           |Leave to your current team.                                              |
|team info            |[team/player]              |Provide an information about a particular player's team or team itself.  |
|team top             |                           |View the top team.                                                       |
|team kick            |\<player\>                 |Kick a particular player from your team.                                 |
|team ban             |\<player\>                 |Ban a particular player from your team.                                  |
|team unban           |\<player\>                 |Unban a banned player from your team.                                    |
|team sethome         |                           |Set a team's home.                                                       |
|team delhome         |                           |Delete the team's home.                                                  |                                                                                        
|team home            |                           |Teleport to your team's home.                                            |
|team setwarp         |\<name\> [password]        |Set a coordinate to be warpable by other's member with optional password.|
|team delwarp         |\<name\> [password]        |Delete a particular warp by name.                                        |
|team warp            |\<name\> [password]        |Teleport to the specified warp's name.                                   |
|team promote         |\<player\>                 |Promote a single player to the next rank.                                |
|team demote          |\<player\>                 |Demotr a single player below their current rank.                         |
|team description     |\<string\>                 |Set a description about your team.                                       |
|team tag             |\<name\>                   |Change the tag of your team.                                             |
|team color           |\<color-code\>             |Change the color of your team.                                           |
|team pvp             |                           |Toggle if pvp is enabled between team members                            |
|team setowner        |\<player\>                 |Set a member of the team to be the new team owner (only avaliable if "singleOwner" is enabled)|
|team rank            |[team]                     |View the rank of a team                                                  |
|team list            |                           |View all existing teams.                                                 |
|team ally            |[team]                     |Request / accept an alliance with another team.                          |
|team neutral         |\<team\>                   |Remove an alliance with another team.                                    |
|team allychat        |[message]                  |Send a message that only team allies can see.                            |
|team chat            |[message]                  |If a message is included, it will send a single message to the team chat, if no message is included the player will be moved to the team chat. (all further messages will go there)|

## Operator Commands
These commands are meant to be used by a player with operator permission level. Otherwise, they won't be able to execute or see the following commands.
These commands are meant to be use by anyone with or without the permission level of a operator.

|NAME                 |PARAMETERS                 |DESCRIPTION                                                              |
|---------------------|---------------------------|-------------------------------------------------------------------------|
|teamadmin create     |\<name\>                   |Create a new team without any members (other admin commands will be required to add a player to the team)|
|teamadmin disband    |\<team\>                   |Disbands the specified team.                                             |
|teamadmin chatspy    |                           |Spy on messages sent to team chats.                                      |
|teamadmin join       |\<player\> \<team\>        |Force a player to join a team.                                           |
|teamadmin leave      |\<team\>                   |Force a player to leave their team.                                      |
|teamadmin promote    |\<player\>                 |Promote a player within their team.                                      |
|teamadmin demote     |\<player\>                 |Demote a player within their team.                                       |
|teamadmin purge      |                           |Reset all team scores back to 0.                                         |
|teamadmin tag        |\<team\> \<tag\>           |Change the tag for the specified team.                                   |
|teamadmin color      |\<team\> \<tag\>           |Changes that teams color code to the specified version.                  |
|teamadmin home       |\<team\>                   |Teleport to a teams home.                                                |
|teamadmin warp       |\<team\> \<warp\>          |Warp to a location set by a team, leave the warp blank for a list of that teams warps.|
|teamadmin setowner   |\<player\>                 |Set that player to be owner of their team (only avaliable if "singleOwner" is enabled)|
|teamadmin invite     |\<player\> \<team\>        |Send an invite for a team to that player.                                |
|teamadmin description|\<team\> \<description\>   |Change the description of a team.                                        |