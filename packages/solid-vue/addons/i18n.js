import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installI18n(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing vue-i18n...'))

  try {
    execSync('npm install vue-i18n', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install vue-i18n:'))
    console.error(chalk.red(err.message))
    return
  }

  const localesDir = path.join(cwd, 'src', 'locales')
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true })
    fs.writeFileSync(path.join(localesDir, 'id.json'), JSON.stringify({ hello: 'Halo!' }, null, 2))
    fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify({ hello: 'Hello!' }, null, 2))
  }

  console.log(chalk.green.bold('\n✅ vue-i18n installed successfully!'))
  console.log(chalk.white('💡 Setup di main entry:'))
  console.log(chalk.cyan('   import { createI18n } from "vue-i18n"'))
  console.log(chalk.cyan('   import id from "./locales/id.json"'))
  console.log(chalk.cyan('   import en from "./locales/en.json"'))
  console.log(chalk.cyan('   const i18n = createI18n({ legacy: false, locale: "id", messages: { id, en } })'))
  console.log(chalk.cyan('   app.use(i18n)'))
}