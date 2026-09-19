import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import { H3 } from 'h3'
import { toNodeHandler } from 'h3/node'
import fs from 'node:fs'
import path from 'node:path'
import { matchApiRoute } from './server-routing'
import { generateServerEntry } from './generate-server-entry'

/**
 * Options for the Solid-Vue Vite plugin.
 */
export interface SolidVueOptions {
  /**
   * Rendering/build mode.
   *
   * `ssr` and `ssg` are not yet verified end-to-end in production —
   * treat them as experimental. Stick to `'spa'` unless you're
   * comfortable working through rough edges yourself.
   *
   * @default 'spa'
   */
  mode?: 'spa' | 'ssr' | 'ssg'

  /**
   * Path prefix under which `src/server/api` routes are served.
   *
   * @default '/api'
   */
  apiPrefix?: string

  /**
   * Injects safe Core Web Vitals defaults into `index.html`
   * (responsive viewport, `max-width: 100%` on images/video).
   *
   * Pass `{ fonts: true }` instead of `true` to additionally add
   * `preconnect` hints for Google Fonts — opt-in, since not every
   * project uses them.
   *
   * @default true
   */
  optimizeCWV?: boolean | { fonts?: boolean }
}

/**
 * The Solid-Vue Vite plugin — wires up file-based page routing
 * (via Vue Router), file-based API routing (via h3), and a handful
 * of safe defaults.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite'
 * import { solidVue } from 'solid-vue'
 *
 * export default defineConfig({
 *   plugins: [solidVue({ mode: 'spa' })]
 * })
 * ```
 */
export function solidVue(options: SolidVueOptions = {}): PluginOption[] {
  const mode = options.mode || 'spa'
  const apiPrefix = options.apiPrefix || '/api'
  const optimizeCWV = options.optimizeCWV ?? true
  let resolvedCommand: string
  const apiApp = new H3()

  apiApp.get('/ping', () => {
    return { status: 'ok', message: 'Pong ti Solid-Vue Core Backend! 🚀' }
  })

  const corePlugin: PluginOption = {
    name: 'solid-vue-core',
    enforce: 'pre',

    transformIndexHtml(html) {
      if (!optimizeCWV) return html

      const wantsFonts = typeof optimizeCWV === 'object' && optimizeCWV.fonts
      const fontPreconnect = wantsFonts
        ? `
      <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
        : ''

      return html.replace(
        '</head>',
        `
      <!-- 🚀 Solid-Vue CWV Optimizations 🚀 -->
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />${fontPreconnect}
      <style>
        @font-face { font-display: swap; }
        img, video { max-width: 100%; height: auto; }
      </style>
    </head>`
      )
    },

    config(_userConfig, { command }) {
      resolvedCommand = command
      return {
        optimizeDeps: {
          exclude: ['solid-vue']
        },
        server: {
          ws: {
            host: 'localhost'
          }
        },
        build: {
          outDir: mode === 'ssg' ? 'dist/static' : 'dist',
        }
      }
    },

    configureServer(server) {
      server.middlewares.use(apiPrefix, async (req, res, next) => {
        const rawPath = req.url?.split('?')[0] || '/'
        const urlPath = rawPath === '/' ? '/index' : rawPath
        const apiDir = path.resolve(server.config.root, 'src/server/api')
        const method = req.method || 'GET'

        const match = matchApiRoute(apiDir, urlPath, method)

        if (match) {
          try {
            const module = await server.ssrLoadModule(match.filePath)

            if (typeof module.default !== 'function') {
              const relPath = path.relative(server.config.root, match.filePath)
              console.error(`[solid-vue] ${relPath} tidak mengekspor default function. Cek "export default defineEventHandler(...)".`)
              res.statusCode = 500
              res.end(`Solid-Vue: ${relPath} tidak mengekspor handler yang valid.`)
              return
            }

            const tempApp = new H3()
            tempApp.use('/**', (event) => {
              event.context.params = match.params
              return module.default(event)
            })
            await toNodeHandler(tempApp)(req, res)
            return
          } catch (error) {
            server.ssrFixStacktrace(error as Error)
            console.error(error)
            res.statusCode = 500
            res.setHeader('Content-Type', 'text/html')
            res.end(renderErrorPage(error as Error))
            return
          }
        }

        await toNodeHandler(apiApp)(req, res)
      })
    },

    closeBundle() {
      if (resolvedCommand !== 'build') return
      const apiDir = path.resolve(process.cwd(), 'src/server/api')
      const outDir = mode === 'ssg' ? 'dist/static' : 'dist'
      if (!fs.existsSync(outDir)) return
      const code = generateServerEntry(apiDir, outDir)
      fs.writeFileSync(path.join(outDir, 'server-entry.mjs'), code)
      console.log('[solid-vue] Generated ' + path.join(outDir, 'server-entry.mjs'))
    }
  }

  return [
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),
    vue(),
    corePlugin
  ]
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderErrorPage(error: Error) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>500 - Solid-Vue Server Error</title>
  <style>
    body { font-family: ui-monospace, monospace; background: #0f172a; color: #e2e8f0; margin: 0; padding: 2rem; }
    h1 { color: #f87171; font-size: 1.25rem; }
    pre { background: #1e293b; padding: 1rem; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
  </style>
</head>
<body>
  <h1>500 — Server Error di Solid-Vue API</h1>
  <pre>${escapeHtml(error.stack || error.message)}</pre>
</body>
</html>`
}

export default solidVue