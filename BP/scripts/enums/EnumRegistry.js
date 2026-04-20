export let enumFunctions = {}
export let enumAdminFunctions = {}
export let enumAdminNames = []
export let enumNames = []

export function enumAdminRegistry(enumName, func) {
  enumAdminFunctions[enumName] = func
  enumAdminNames.push(enumName)
}

export function EnumRegistry(enumName, func) {
  enumFunctions[enumName] = func
  enumNames.push(enumName)
}