# Solid-Vue

A lightweight Vue + Vite framework for small and growing businesses. File-based routing, a built-in server layer powered by [h3](https://github.com/h3js/h3), and zero extra config to wire together.

https://github.com/user-attachments/assets/fe99f8ac-5f87-4433-afbc-5aa31406522e

## Features

- **File-based routing** — every file in `src/pages` becomes a route automatically, via [`unplugin-vue-router`](https://github.com/posva/unplugin-vue-router).
- **A server, built in** — `src/server/api` holds your API endpoints, served through h3 alongside your frontend. One dev server, one deploy.
- **Vite underneath** — instant startup and near-instant HMR.
- **State management ready** — Pinia is wired in out of the box.
- **Extensible via add-ons** — install Tailwind CSS, icon sets, form validation, i18n, and more with the companion [`solid-vue-cli`](https://www.npmjs.com/package/solid-vue-cli).

## Quick start

Don't install this package directly — scaffold a new project instead:

```bash
npm create solid-vue@latest my-app
cd my-app
npm install
npm run dev
```

## Usage

**`vite.config.ts`**
```ts
import { defineConfig } from 'vite'
import { solidVue } from 'solid-vue'

export default defineConfig({
  plugins: [
    solidVue({ mode: 'spa' })
  ]
})
```

**`src/main.ts`**
```ts
import { createSolidApp } from 'solid-vue/client'
import App from './App.vue'

const { app, router } = createSolidApp(App)

router.isReady().then(() => {
  app.mount('#app')
})
```

**`src/server/api/hello.ts`**
```ts
import { defineEventHandler } from 'solid-vue/server'

export default defineEventHandler(() => {
  return { message: 'Hello from Solid-Vue!' }
})
```

## Plugin options

```ts
solidVue({
  mode: 'spa',        // 'spa' | 'ssr' | 'ssg' — default: 'spa'
  apiPrefix: '/api',  // prefix for file-based API routes — default: '/api'
  optimizeCWV: true,  // inject Core Web Vitals meta/preconnect tags — default: true
})
```

## Package exports

| Entry | Use |
|---|---|
| `solid-vue` | The Vite plugin (`solidVue`), used in `vite.config.ts` |
| `solid-vue/client` | `createSolidApp()` — bootstraps Vue, Vue Router, and Pinia |
| `solid-vue/server` | Re-exported h3 utilities (`defineEventHandler`, `readBody`, `useSession`, etc.) for your API routes |

## Add-ons

Add optional integrations to an existing project with the CLI:

```bash
npx solid-vue add tailwind
npx solid-vue add pinia
npx solid-vue add vitest
```

See the [full add-on list](https://docs.solid-vue.tech/guide/addons) in the docs.

## Requirements

- Node.js 22+
- Vue ^3.4, Vue Router ^4, Pinia ^2, Vite ^8, `@vitejs/plugin-vue` ^6 (installed as peer dependencies)

## Documentation

Full documentation: **[https://docs.solid-vue.tech/](https://docs.solid-vue.tech/)**

## License

MIT
