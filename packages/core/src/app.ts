// packages/core/src/app.ts
import type { Component } from 'vue'
import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

/**
 * Bootstraps a Solid-Vue application: creates the Vue app, wires up
 * file-based routing (Vue Router) and Pinia, and returns all three
 * so you can mount when ready.
 *
 * @param AppComponent - The root component, typically `App.vue`.
 *
 * @example
 * ```ts
 * import { createSolidApp } from 'solid-vue/client'
 * import App from './App.vue'
 *
 * const { app, router } = createSolidApp(App)
 * router.isReady().then(() => app.mount('#app'))
 * ```
 */

export function createSolidApp(AppComponent: Component) {
  const app = createVueApp(AppComponent)

  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  const pinia = createPinia()

  app.use(router)
  app.use(pinia)

  return { app, router, pinia }
}