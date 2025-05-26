import { messages } from "../messages.js"
import { config } from "../config.js"

globalThis.messageSyntax = (message) => {
  return `${messages.prefixSyntax.replace("{0}", config.BedrockTeams.chatName).replace("{1}", message)}`
}