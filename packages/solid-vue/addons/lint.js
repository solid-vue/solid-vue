import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installLint(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing ESLint + Prettier...'))

  try {
    execSync('npm install -D eslint eslint-plugin-vue @vue/eslint-config-prettier prettier', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install lint packages:'))
    console.error(chalk.red(err.message))
    return
  }

  const eslintConfigPath = path.join(cwd, 'eslint.config.js')
  if (!fs.existsSync(eslintConfigPath)) {
    fs.writeFileSync(eslintConfigPath, `import pluginVue from 'eslint-plugin-vue'
import prettierConfig from '@vue/eslint-config-prettier'

export default [
  ...pluginVue.configs['flat/recommended'],
  prettierConfig,
]
`)
  }

  const prettierConfigPath = path.join(cwd, '.prettierrc.json')
  if (!fs.existsSync(prettierConfigPath)) {
    fs.writeFileSync(prettierConfigPath, JSON.stringify({ semi: false, singleQuote: true, printWidth: 100 }, null, 2))
  }

  console.log(chalk.green.bold('\n✅ ESLint + Prettier installed successfully!'))
  console.log(chalk.white('💡 Run:'))
  console.log(chalk.cyan('   npx eslint . --fix'))
  console.log(chalk.cyan('   npx prettier --write .'))
}