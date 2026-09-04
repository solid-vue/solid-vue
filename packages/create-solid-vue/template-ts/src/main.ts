import { createSolidApp } from 'solid-vue/client'
import App from './App.vue'

const { app, router } = createSolidApp(App)

router.isReady().then(() => {
  app.mount('#app')
})