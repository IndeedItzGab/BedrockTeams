import {
  system
} from "@minecraft/server";
import { config } from "../config.js"

export let enumFunctions = {}
export let enumAdminFunctions = {}
export let enumAdminNames = []
export let enumNames = []

export function enumAdminRegistry(enumName, func) {
  enumAdminFunctions[enumName] = func
  enumAdminNames.push(enumName)
}

export function enumRegistry(enumName, func) {
  enumFunctions[enumName] = func
  enumNames.push(enumName)
}