import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/vue-front/',  // importante para GitHub Pages (nome do repo)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})