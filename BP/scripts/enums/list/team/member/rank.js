import { world, system } from "@minecraft/server"
import { enumRegistry } from "../../../enumRegistry.js"
import * as db from "../../../../utilities/storage.js"
import { config } from "../../../../config.js"
import { messages } from "../../../../messages.js"
import "../../../../utilities/messageSyntax.js"


const ordinalWords = [
  "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
  "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth",
  "eighteenth", "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third",
  "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth",
  "twenty-ninth", "thirtieth", "thirty-first", "thirty-second", "thirty-third", "thirty-fourth",
  "thirty-fifth", "thirty-sixth", "thirty-seventh", "thirty-eighth", "thirty-ninth", "fortieth",
  "forty-first", "forty-second", "forty-third", "forty-fourth", "forty-fifth", "forty-sixth",
  "forty-seventh", "forty-eighth", "forty-ninth", "fiftieth", "fifty-first", "fifty-second",
  "fifty-third", "fifty-fourth", "fifty-fifth", "fifty-sixth", "fifty-seventh", "fifty-eighth",
  "fifty-ninth", "sixtieth", "sixty-first", "sixty-second", "sixty-third", "sixty-fourth",
  "sixty-fifth", "sixty-sixth", "sixty-seventh", "sixty-eighth", "sixty-ninth", "seventieth",
  "seventy-first", "seventy-second", "seventy-third", "seventy-fourth", "seventy-fifth",
  "seventy-sixth", "seventy-seventh", "seventy-eighth", "seventy-ninth", "eightieth",
  "eighty-first", "eighty-second", "eighty-third", "eighty-fourth", "eighty-fifth",
  "eighty-sixth", "eighty-seventh", "eighty-eighth", "eighty-ninth", "ninetieth", 
  "ninety-first", "ninety-second", "ninety-third", "ninety-fourth", "ninety-fifth",
  "ninety-sixth", "ninety-seventh", "ninety-eighth", "ninety-ninth", "one hundredth"
];

const levelsMessage = ordinalWords.map(word => `§7The ${word} level`);

enumRegistry("rank", (origin, args) => {
  const player = origin.sourceEntity
  let teams = db.fetch("team", true)
  
  const targetTeam = args || player.hasTeam()?.name
  const team = teams.find(team => team.name === targetTeam)
  if(!team) return player.sendMessage(messageSyntax(messages.rank.noTeam))
  
  let message = messageSyntax(messages.rank.infos.replace("{0}", player.teamLevel(team.name)).replace("{1}", config.BedrockTeams.levels[player.teamLevel(team.name)]?.price - team.score))
  if(config.BedrockTeams.levels.length === player.teamLevel(team.name)) message = messageSyntax(messages.rank.infomm.replace("{0}", player.teamLevel(team.name)))
  message += `\n${messageSyntax(`§7${levelsMessage[player.teamLevel(team.name) - 1]}`)}`
  player.sendMessage(message)

  return 0
})