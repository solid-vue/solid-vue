import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installVitest(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Vitest...'))

  try {
    execSync('npm install -D vitest @vue/test-utils jsdom', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Vitest:'))
    console.error(chalk.red(err.message))
    return
  }

  const isTs = fs.existsSync(path.join(cwd, 'tsconfig.json'))
  const ext = isTs ? 'ts' : 'js'

  const vitestConfigPath = path.join(cwd, `vitest.config.${ext}`)
  if (!fs.existsSync(vitestConfigPath)) {
    fs.writeFileSync(vitestConfigPath, `import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
`)
  }

  const testDir = path.join(cwd, 'src', '__tests__')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
    fs.writeFileSync(path.join(testDir, `example.test.${ext}`), `import { describe, it, expect } from 'vitest'

describe('example', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })
})
`)
  }

  console.log(chalk.green.bold('\n✅ Vitest installed successfully!'))
  console.log(chalk.white('💡 Run:'))
  console.log(chalk.cyan('   npx vitest'))
}