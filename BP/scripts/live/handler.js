import { system } from "@minecraft/server"
import "./list/combatChecker.js"

// One Second Interval
system.runInterval(() => {
  combatChecker()
}, 1*20)