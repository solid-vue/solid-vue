import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installTabler(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Tabler Icons...'))

  try {
    execSync('npm install @tabler/icons-vue', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Tabler Icons:'))
    console.error(chalk.red(err.message))
    return
  }

  console.log(chalk.green.bold('\n✅ Tabler Icons installed successfully!'))
  console.log(chalk.white('💡 Usage in a .vue file:'))
  console.log(chalk.cyan('   import { IconHome, IconUser } from "@tabler/icons-vue"'))
  console.log(chalk.cyan('   <IconHome stroke="2" />'))
}