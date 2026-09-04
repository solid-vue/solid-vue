import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installVueUse(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing VueUse...'))

  try {
    execSync('npm install @vueuse/core', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install VueUse:'))
    console.error(chalk.red(err.message))
    return
  }

  console.log(chalk.green.bold('\n✅ VueUse installed successfully!'))
  console.log(chalk.white('💡 Usage in a .vue file:'))
  console.log(chalk.cyan('   import { useLocalStorage, useDebounce } from "@vueuse/core"'))
}