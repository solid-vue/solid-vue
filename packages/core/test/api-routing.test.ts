import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { matchApiRoute } from '../src/server-routing'

let apiDir: string

beforeAll(() => {
  apiDir = fs.mkdtempSync(path.join(os.tmpdir(), 'solid-vue-api-'))

  function write(relPath: string) {
    const full = path.join(apiDir, relPath)
    fs.mkdirSync(path.dirname(full), { recursive: true })
    fs.writeFileSync(full, '')
  }

  write('hello.ts')
  write('index.ts')

  // Method-specific + generic pikeun cek prioritas
  write('accounts.ts')
  write('accounts.get.ts')

  // Nested index route
  write('products/index.ts')

  // Dynamic route
  write('products/[id].ts')

  // Dynamic route + method-specific sibling, cek prioritas
  write('orders/[id].ts')
  write('orders/[id].get.ts')
})

afterAll(() => {
  fs.rmSync(apiDir, { recursive: true, force: true })
})

function norm(filePath: string) {
  return filePath.replace(/\\/g, '/')
}

describe('matchApiRoute', () => {
  it('matches a static route regardless of method', () => {
    const match = matchApiRoute(apiDir, '/hello', 'GET')
    expect(match).not.toBeNull()
    expect(norm(match!.filePath)).toMatch(/hello\.ts$/)
    expect(match!.params).toEqual({})
  })

  it('matches the root path to index.ts', () => {
    const match = matchApiRoute(apiDir, '/', 'GET')
    expect(norm(match!.filePath)).toMatch(/index\.ts$/)
  })

  it('prefers a method-specific file over a generic one, for that method', () => {
    const match = matchApiRoute(apiDir, '/accounts', 'GET')
    expect(norm(match!.filePath)).toMatch(/accounts\.get\.ts$/)
  })

  it('falls back to the generic file for a different method', () => {
    const match = matchApiRoute(apiDir, '/accounts', 'POST')
    expect(norm(match!.filePath)).toMatch(/accounts\.ts$/)
    expect(norm(match!.filePath)).not.toMatch(/\.get\.ts$/)
  })

  it('treats a directory index.ts the same as a sibling .ts file', () => {
    const match = matchApiRoute(apiDir, '/products', 'GET')
    expect(norm(match!.filePath)).toMatch(/products\/index\.ts$/)
  })

  it('matches a dynamic segment and extracts the param', () => {
    const match = matchApiRoute(apiDir, '/products/7', 'GET')
    expect(norm(match!.filePath)).toMatch(/products\/\[id\]\.ts$/)
    expect(match!.params).toEqual({ id: '7' })
  })

  it('prefers a method-specific dynamic file over the generic one, for that method', () => {
    const match = matchApiRoute(apiDir, '/orders/42', 'GET')
    expect(norm(match!.filePath)).toMatch(/orders\/\[id\]\.get\.ts$/)
    expect(match!.params).toEqual({ id: '42' })
  })

  it('falls back to the generic dynamic file for a different method', () => {
    const match = matchApiRoute(apiDir, '/orders/42', 'DELETE')
    expect(norm(match!.filePath)).toMatch(/orders\/\[id\]\.ts$/)
    expect(norm(match!.filePath)).not.toMatch(/\.get\.ts$/)
  })

  it('returns null when nothing matches', () => {
    expect(matchApiRoute(apiDir, '/does-not-exist', 'GET')).toBeNull()
  })
})