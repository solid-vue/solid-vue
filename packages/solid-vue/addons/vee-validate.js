import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installVeeValidate(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing VeeValidate + Zod...'))

  try {
    execSync('npm install vee-validate zod @vee-validate/zod', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install validation packages:'))
    console.error(chalk.red(err.message))
    return
  }

  console.log(chalk.green.bold('\n✅ VeeValidate + Zod installed successfully!'))
  console.log(chalk.white('💡 Usage in a .vue file:'))
  console.log(chalk.cyan('   import { useForm } from "vee-validate"'))
  console.log(chalk.cyan('   import { toTypedSchema } from "@vee-validate/zod"'))
  console.log(chalk.cyan('   import { z } from "zod"'))
}