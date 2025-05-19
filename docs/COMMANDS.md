# Available Commands
Default commands namespace: `team`

## Non-Operator Commands 
These commands are meant to be use by anyone with or without the permission level of a operator.
|NAME                 |PARAMETERS                 |DESCRIPTION                                                              |
|---------------------|---------------------------|-------------------------------------------------------------------------|
|team create          |\<name\>                   |Create your own team.                                                    |
|team abandon         |                           |Abandon the team.                                                        |
|tean invite          |\<player\>                 |Invite a particular player to your team.                                 |
|team join            |\<team\>                   |Join the speified team.                                                  |
|team leave           |                           |Leave to your current team.                                              |
|team info            |[team/player]              |Provide an information about a particular player's team or team itself.  |
|team top             |                           |View the top team.                                                       |
|team kick            |\<player\>                 |Kick a particular player from your team.                                 |
|team ban             |\<player\>                 |Ban a particular player from your team.                                  |
|team unban           |\<player\>                 |Unban a banned player from your team.                                    |
|team sethome         |                           |Set a team's home.                                                       |
|team delhome         |                           |Delete the team's home.                                                  |                                            |                                            
|team home            |                           |Teleport to your team's home.                                            |
|team setwarp         |\<name\> [password]        |Set a coordinate to be warpable by other's member with optional password.|
|team delwarp         |\<name\> [password]        |Delete a particular warp by name.                                        |
|team warp            |\<name\> [password]        |Teleport to the specified warp's name.                                   |
|team promote         |\<player\>                 |Promote a single player to the next rank.                                |
|team demote          |\<player\>                 |Demotr a single player below their current rank.                         |
|team description     |\<string\>                 |Set a description about your team.                                       |
|team tag             |\<name\>                   |Change the tag of your team.                                             |
|team color           |\<color-code\>             |Change the color of your team.                                           |