import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installDrizzle(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Drizzle ORM (SQLite dialect)...'))

  try {
    execSync('npm install drizzle-orm better-sqlite3', { stdio: 'inherit', cwd })
    execSync('npm install -D drizzle-kit @types/better-sqlite3', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Drizzle packages:'))
    console.error(chalk.red(err.message))
    return
  }

  const dbDir = path.join(cwd, 'src', 'server', 'db')
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

  fs.writeFileSync(path.join(dbDir, 'schema.ts'), `import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// Example table schema. Configure your own tables here. See https://orm.drizzle.team/docs/quickstart for more info.
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
})
`)

  fs.writeFileSync(path.join(dbDir, 'client.ts'), `import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

// Local Development: SQLite database connection using better-sqlite3. This is suitable for local development and testing,
// Change the dialect to 'd1/drizzle-orm' and update the connection method when deploying to Cloudflare D1. schema.ts file should remain the same,
// only the connection method changes when deploying to D1.
const sqlite = new Database('local.db')
export const db = drizzle(sqlite, { schema })
`)

  fs.writeFileSync(path.join(cwd, 'drizzle.config.ts'), `import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './local.db',
  },
})
`)

  console.log(chalk.green.bold('\n✅ Drizzle ORM installed successfully!'))
  console.log(chalk.white('💡 Next steps:'))
  console.log(chalk.cyan('   1. Edit src/server/db/schema.ts to define your tables'))
  console.log(chalk.cyan('   2. Run npx drizzle-kit push   (to create tables in local.db)'))
  console.log(chalk.cyan('   3. import { db } from "../db/client" in your API handlers at src/server/api/*.ts'))
  console.log(chalk.yellow('   ⚠️  When deploying to Cloudflare D1, change client.ts to use drizzle-orm/d1'))
}