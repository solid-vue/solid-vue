import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installDecimal(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Decimal.js...'))

  try {
    execSync('npm install decimal.js', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Decimal.js:'))
    console.error(chalk.red(err.message))
    return
  }

  const libDir = path.join(cwd, 'src', 'lib')
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true })

  fs.writeFileSync(path.join(libDir, 'money.ts'), `import Decimal from 'decimal.js'

export function multiply(a: number | string, b: number | string): string {
  return new Decimal(a).times(b).toString()
}

export function add(a: number | string, b: number | string): string {
  return new Decimal(a).plus(b).toString()
}

export function subtract(a: number | string, b: number | string): string {
  return new Decimal(a).minus(b).toString()
}

export function formatIDR(value: number | string): string {
  const num = new Decimal(value).toNumber()
  return 'Rp' + num.toLocaleString('id-ID', { maximumFractionDigits: 2 })
}
`)

  console.log(chalk.green.bold('\n✅ Decimal.js installed successfully!'))
  console.log(chalk.white('💡 Helper is ready in src/lib/money.ts:'))
  console.log(chalk.cyan('   import { multiply, formatIDR } from "../lib/money"'))
  console.log(chalk.cyan('   formatIDR(multiply(qty, hargaPerKg))'))
}