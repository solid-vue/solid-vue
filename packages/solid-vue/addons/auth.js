import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installAuth(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing basic session auth (h3 useSession + bcryptjs)...'))

  try {
    execSync('npm install bcryptjs', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install bcryptjs:'))
    console.error(chalk.red(err.message))
    return
  }

  const isTs = fs.existsSync(path.join(cwd, 'tsconfig.json'))
  const ext = isTs ? 'ts' : 'js'

  const authDir = path.join(cwd, 'src', 'server', 'api', 'auth')
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })

  fs.writeFileSync(path.join(authDir, `register.${ext}`), `import { useSession, readBody } from 'solid-vue/server'
import bcrypt from 'bcryptjs'

// TODO: Ganti ku query database Aa sabenerna
async function createUser(email, passwordHash) {
  throw new Error('createUser() acan diimplementasikeun — sambungkeun ka database Aa')
}

export default async function (event) {
  const { email, password } = await readBody(event)
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser(email, passwordHash)

  const session = await useSession(event, {
    password: process.env.SESSION_SECRET, // minimal 32 karakter acak
  })
  await session.update({ userId: user.id })

  return { status: 'ok' }
}
`)

  fs.writeFileSync(path.join(authDir, `login.${ext}`), `import { useSession, readBody } from 'solid-vue/server'
import bcrypt from 'bcryptjs'

// TODO: Ganti ku query database Aa sabenerna
async function findUserByEmail(email) {
  throw new Error('findUserByEmail() acan diimplementasikeun — sambungkeun ka database Aa')
}

export default async function (event) {
  const { email, password } = await readBody(event)
  const user = await findUserByEmail(email)

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    event.node.res.statusCode = 401
    return { status: 'error', message: 'Email atawa password salah' }
  }

  const session = await useSession(event, {
    password: process.env.SESSION_SECRET,
  })
  await session.update({ userId: user.id })

  return { status: 'ok' }
}
`)

  fs.writeFileSync(path.join(authDir, `logout.${ext}`), `import { useSession } from 'solid-vue/server'

export default async function (event) {
  const session = await useSession(event, {
    password: process.env.SESSION_SECRET,
  })
  await session.clear()

  return { status: 'ok' }
}
`)

  console.log(chalk.green.bold('\n✅ Basic auth scaffolding installed!'))
  console.log(chalk.yellow('⚠️  Butuh ditambihan manual sateuacan dipaké:'))
  console.log(chalk.white('   1. Set SESSION_SECRET di .env (minimal 32 karakter acak)'))
  console.log(chalk.white('   2. Implementasikeun createUser() & findUserByEmail() luyu database Aa'))
}