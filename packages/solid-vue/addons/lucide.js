import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installLucide(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Lucide Icons...'))

  try {
    execSync('npm install @lucide/vue', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Lucide Icons:'))
    console.error(chalk.red(err.message))
    return
  }

  console.log(chalk.green.bold('\n✅ Lucide Icons installed successfully!'))
  console.log(chalk.white('💡 Usage in a .vue file:'))
  console.log(chalk.cyan('   import { Home, User, Settings } from "@lucide/vue"'))
  console.log(chalk.cyan('   <Home class="text-blue-500 w-6 h-6" />'))
}