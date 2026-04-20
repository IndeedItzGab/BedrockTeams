import { messages } from "../messages.js"
import * as db from "./DatabaseHandler.js"
import { system } from "@minecraft/server"

let setting;

system.run(() => setting = db.fetch("bedrockteams:setting"))
globalThis.messageSyntax = (message) => {
  return `${messages.prefixSyntax.replace("{0}", setting.teams["chatName"]).replace("{1}", message)}`
}