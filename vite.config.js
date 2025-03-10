import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {},
  },
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'https://newsapi-s7kc.onrender.com', // Update the proxy URL here
    }
  }
})
