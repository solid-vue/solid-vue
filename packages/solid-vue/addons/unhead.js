import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installUnhead(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing @unhead/vue...'))

  try {
    execSync('npm install @unhead/vue', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install @unhead/vue:'))
    console.error(chalk.red(err.message))
    return
  }

  console.log(chalk.green.bold('\n✅ @unhead/vue installed successfully!'))
  console.log(chalk.white('💡 Setup di main entry:'))
  console.log(chalk.cyan('   import { createHead } from "@unhead/vue/client"'))
  console.log(chalk.cyan('   app.use(createHead())'))
  console.log(chalk.white('💡 Usage di .vue file:'))
  console.log(chalk.cyan('   import { useHead } from "@unhead/vue"'))
  console.log(chalk.cyan('   useHead({ title: "Judul Halaman" })'))
}