#!/usr/bin/env node
import chalk from 'chalk'
import { addons } from '../addons/index.js'
import { deployTargets } from '../targets/index.js'

function parseFlags(args) {
  const flags = {}
  for (const arg of args) {
    const match = arg.match(/^--([^=]+)=(.*)$/)
    if (match) flags[match[1]] = match[2]
  }
  return flags
}

function addAddon(addonName) {
  const handler = addons[addonName]

  if (!handler) {
    console.log(chalk.red(`\n❌ Add-on '${addonName}' is not supported yet by Solid-Vue.`))
    console.log(chalk.gray(`   Available add-ons: ${Object.keys(addons).join(', ')}`))
    process.exit(1)
  }

  handler(process.cwd())
}

function deploy(flags) {
  const target = flags.target

  if (!target) {
    console.log(chalk.yellow('\n⚠️  Please specify a deploy target. Example: npx solid-vue deploy --target=cloudflare-worker'))
    console.log(chalk.gray(`   Available targets: ${Object.keys(deployTargets).join(', ')}`))
    process.exit(1)
  }

  const handler = deployTargets[target]
  if (!handler) {
    console.log(chalk.red(`\n❌ Deploy target '${target}' is not supported yet by Solid-Vue.`))
    console.log(chalk.gray(`   Available targets: ${Object.keys(deployTargets).join(', ')}`))
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
} else if (command === 'deploy') {
  deploy(parseFlags(args.slice(1)))
} else {
  console.log(chalk.red(`\n❌ Command '${command}' is not recognized. Supported commands are: 'add <addon-name>', 'deploy --target=<target>'.`))
  process.exit(1)
}