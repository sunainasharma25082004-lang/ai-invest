import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveBuildApiUrl } from './shared/production.mjs'

const buildApiUrl =
  process.env.NODE_ENV === 'production'
    ? resolveBuildApiUrl(process.env.VITE_API_URL)
    : process.env.VITE_API_URL || '/api'

export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(buildApiUrl),
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})