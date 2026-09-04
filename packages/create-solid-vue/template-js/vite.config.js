import { defineConfig } from 'vite'
import { solidVue } from 'solid-vue'

export default defineConfig({
  plugins: [
    solidVue({ mode: 'spa' })
  ]
})