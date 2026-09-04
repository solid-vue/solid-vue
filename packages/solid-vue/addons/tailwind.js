import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installTailwind(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Tailwind CSS (v4) in the Solid-Vue project...'))

  try {
    execSync('npm install -D tailwindcss @tailwindcss/postcss postcss', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Tailwind CSS packages:'))
    console.error(chalk.red(err.message))
    return
  }

  const postcssConfigPath = path.join(cwd, 'postcss.config.js')
  fs.writeFileSync(postcssConfigPath, `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
`)

  const cssDir = path.join(cwd, 'src', 'styles')
  const cssFile = path.join(cssDir, 'global.css')
  const tailwindImport = `@import "tailwindcss";\n\n`

  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true })

  if (fs.existsSync(cssFile)) {
    const currentCss = fs.readFileSync(cssFile, 'utf-8')
    if (!currentCss.includes('@import "tailwindcss"')) {
      fs.writeFileSync(cssFile, tailwindImport + currentCss)
    }
  } else {
    fs.writeFileSync(cssFile, tailwindImport)
  }

  console.log(chalk.green.bold('\n✅ Tailwind CSS v4 has been installed successfully! Let\'s get started! ☕'))
}