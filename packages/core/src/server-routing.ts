import fs from 'node:fs'
import path from 'node:path'

export interface MatchedApiRoute {
  filePath: string
  params: Record<string, string>
}

function findFile(dir: string, baseName: string, method: string): string | null {
  const methodLower = method.toLowerCase()
  const candidates = [
    `${baseName}.${methodLower}.ts`,
    `${baseName}.${methodLower}.js`,
    `${baseName}.ts`,
    `${baseName}.js`,
  ]
  for (const name of candidates) {
    const full = path.join(dir, name)
    if (fs.existsSync(full)) return full
  }
  return null
}

function findDynamicFile(dir: string, method: string): { file: string; paramName: string } | null {
  if (!fs.existsSync(dir)) return null
  const entries = fs.readdirSync(dir)
  const methodLower = method.toLowerCase()

  const specific = /^\[(\w+)\]\.(get|post|put|patch|delete)\.(ts|js)$/
  const generic = /^\[(\w+)\]\.(ts|js)$/

  for (const entry of entries) {
    const m = entry.match(specific)
    if (m && m[2] === methodLower) return { file: path.join(dir, entry), paramName: m[1] }
  }
  for (const entry of entries) {
    const m = entry.match(generic)
    if (m) return { file: path.join(dir, entry), paramName: m[1] }
  }
  return null
}

/**
 * Konvénsi nami file, deterministic:
 *   products.ts           -> sadaya HTTP method, /api/products
 *   products.get.ts       -> GET wungkul,        /api/products
 *   products/index.ts     -> sarua jeung products.ts
 *   products/[id].ts      -> sadaya method,       /api/products/:id
 *   products/[id].get.ts  -> GET wungkul,         /api/products/:id
 *
 * Aturan konflik: file nu boga sufiks method salawasna meunang prioritas
 * ti file generik (tanpa sufiks method) — sanès dumasar urutan alfabét/lain.
 */
export function matchApiRoute(apiDir: string, urlPath: string, method: string): MatchedApiRoute | null {
  const segments = urlPath.split('/').filter(Boolean)
  const routeSegments = segments.length ? segments : ['index']

  const staticBase = path.join(apiDir, ...routeSegments)
  const staticFile = findFile(path.dirname(staticBase), path.basename(staticBase), method)
  if (staticFile) return { filePath: staticFile, params: {} }

  if (fs.existsSync(staticBase) && fs.statSync(staticBase).isDirectory()) {
    const indexFile = findFile(staticBase, 'index', method)
    if (indexFile) return { filePath: indexFile, params: {} }
  }

  const parentDir = path.join(apiDir, ...routeSegments.slice(0, -1))
  const dynamicMatch = findDynamicFile(parentDir, method)
  if (dynamicMatch) {
    const paramValue = routeSegments[routeSegments.length - 1]
    return { filePath: dynamicMatch.file, params: { [dynamicMatch.paramName]: paramValue } }
  }

  return null
}