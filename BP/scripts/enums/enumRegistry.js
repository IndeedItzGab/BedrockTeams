import {
  system
} from "@minecraft/server";
import { config } from "../config.js"

export let enumFunctions = {}
export let enumNames = []

export function enumRegistry(enumName, func) {
  enumFunctions[enumName] = func
  enumNames.push(enumName)
}