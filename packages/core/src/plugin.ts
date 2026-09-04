import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { H3 } from 'h3'
import { toNodeHandler } from 'h3/node'
import fs from 'node:fs'
import path from 'node:path'

export interface SolidVueOptions {
  mode?: 'spa' | 'ssr' | 'ssg'
  apiPrefix?: string
  optimizeCWV?: boolean
}

export function solidVue(options: SolidVueOptions = {}): PluginOption[] {
  const mode = options.mode || 'spa'
  const apiPrefix = options.apiPrefix || '/api'
  const optimizeCWV = options.optimizeCWV ?? true

  const apiApp = new H3()

  apiApp.get('/ping', () => {
    return { status: 'ok', message: 'Pong ti Solid-Vue Core Backend! 🚀' }
  })

  const corePlugin: PluginOption = {
    name: 'solid-vue-core',
    enforce: 'pre',

    transformIndexHtml(html) {
      if (!optimizeCWV) return html

      return html.replace(
        '</head>',
        `
    <!-- 🚀 Solid-Vue CWV Optimizations 🚀 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
      @font-face { font-display: swap; }
      img, video { max-width: 100%; height: auto; }
    </style>
  </head>`
      )
    },

    config(_userConfig, { command }) {
    return {
      optimizeDeps: {
        exclude: ['solid-vue']
      },
      server: {
        hmr: {
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

        const filePathTs = path.join(apiDir, `${urlPath}.ts`)
        const filePathJs = path.join(apiDir, `${urlPath}.js`)
        const indexPathTs = path.join(apiDir, urlPath, 'index.ts')
        const indexPathJs = path.join(apiDir, urlPath, 'index.js')

        let targetFile = ''
        if (fs.existsSync(filePathTs)) targetFile = filePathTs
        else if (fs.existsSync(filePathJs)) targetFile = filePathJs
        else if (fs.existsSync(indexPathTs)) targetFile = indexPathTs
        else if (fs.existsSync(indexPathJs)) targetFile = indexPathJs

        if (targetFile) {
          try {
            const module = await server.ssrLoadModule(targetFile)
            const tempApp = new H3()
            tempApp.use('/**', module.default)
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