import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installOfetch(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing ofetch...'))

  try {
    execSync('npm install ofetch', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install ofetch:'))
    console.error(chalk.red(err.message))
    return
  }

  console.log(chalk.green.bold('\n✅ ofetch installed successfully!'))
  console.log(chalk.white('💡 Usage:'))
  console.log(chalk.cyan('   import { ofetch } from "ofetch"'))
  console.log(chalk.cyan('   const data = await ofetch("/api/hello")'))
}