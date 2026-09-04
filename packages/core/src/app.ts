// packages/core/src/app.ts
import type { Component } from 'vue'
import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

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