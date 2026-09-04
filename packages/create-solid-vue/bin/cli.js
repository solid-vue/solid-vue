#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'
import chalk from 'chalk'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function init(projectNameInput) {
  const projectName = projectNameInput || 'my-solid-vue-app'
  const targetDir = path.resolve(process.cwd(), projectName)

  console.log(chalk.green(`
   ███████    ██████   ██        ██   ██████           ██    ██   ██    ██   ███████ 
   ██        ██    ██  ██        ██   ██   ██          ██    ██   ██    ██   ██      
   ███████   ██    ██  ██        ██   ██   ██  ██████  ██    ██   ██    ██   █████   
        ██   ██    ██  ██        ██   ██   ██           ██  ██    ██    ██   ██      
   ███████    ██████   ███████   ██   ██████             ████      ██████    ███████ 
  `))
  console.log(chalk.bold.cyan(' Vue Frameworks ease to use for SME/SMBs. Let your small business thrive with Solid-Vue! 🚀\n'))
  console.log(`\n${chalk.bgGreen.black.bold(' SOLID-VUE v0.1.0 ')} ${chalk.green('Scaffolding New Project...')}\n`)

  if (fs.existsSync(targetDir)) {
    const overrideAnswer = await askQuestion(chalk.yellow(`Directory ${chalk.bold(projectName)} already exists. Do you want to override it? (y/N) `))
    if (overrideAnswer.toLowerCase() !== 'y' && overrideAnswer.toLowerCase() !== 'yes') {
      console.log(chalk.red.bold('❌ Operation cancelled.'))
      process.exit(1)
    }
  }

  const useTsAnswer = await askQuestion(chalk.cyan('Do you want to use TypeScript? (y/N) '))
  const useTs = useTsAnswer.toLowerCase() === 'y' || useTsAnswer.toLowerCase() === 'yes'

  rl.close()

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const templateName = useTs ? 'template-ts' : 'template-js'
  const templateDir = path.resolve(__dirname, `../${templateName}`)

  console.log(chalk.gray(`\n📦 Copying template ${chalk.bold(useTs ? 'TypeScript' : 'JavaScript')} to ${chalk.white(projectName)}...`))

  fs.cpSync(templateDir, targetDir, { recursive: true })

  const gitignorePath = path.join(targetDir, 'gitignore')
  if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, path.join(targetDir, '.gitignore'))
  }

  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = projectName

  // Otomatis daptarkeun 'solid-vue' salaku devDependency
  // supaya `npx solid-vue add tailwind` bisa langsung dipake tanpa link/install manual
  pkg.devDependencies = {
    ...(pkg.devDependencies || {}),
    'solid-vue-cli': '^0.1.0'
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

  console.log(chalk.green.bold(`\n✅ Project Solid-Vue created successfully!\n`))
  console.log(chalk.white('Please follow these steps:'))
  console.log(chalk.cyan(`  cd ${projectName}`))
  console.log(chalk.cyan(`  npm install`))
  console.log(chalk.cyan(`  npm run dev\n`))
  console.log(chalk.gray(` Wanna add Tailwind or another addon? Run: npx solid-vue add tailwind\n`))
}

const args = process.argv.slice(2)
const projectName = args[0]

init(projectName).catch((err) => {
  console.error(chalk.red.bold('\n❌ An error occurred:'))
  console.error(chalk.red(err))
  process.exit(1)
})