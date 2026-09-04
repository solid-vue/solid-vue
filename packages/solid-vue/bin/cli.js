#!/usr/bin/env node
import chalk from 'chalk'
import { addons } from '../addons/index.js'

function addAddon(addonName) {
  const handler = addons[addonName]

  if (!handler) {
    console.log(chalk.red(`\n❌ Add-on '${addonName}' is not supported yet by Solid-Vue.`))
    console.log(chalk.gray(`   Available add-ons: ${Object.keys(addons).join(', ')}`))
    process.exit(1)
  }

  handler(process.cwd())
}

const args = process.argv.slice(2)
const command = args[0]

if (command === 'add') {
  const addonName = args[1]
  if (!addonName) {
    console.log(chalk.yellow('\n⚠️  Please specify the addon name. Example: npx solid-vue add tailwind'))
    process.exit(1)
  }
  addAddon(addonName)
} else {
  console.log(chalk.red(`\n❌ Command '${command}' is not recognized. Supported commands are: 'add <addon-name>'.`))
  process.exit(1)
}