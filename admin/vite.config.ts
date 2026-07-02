import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Standalone admin deploy (Render Static Site): default /
// Bundled under main site at /admin/: set VITE_BASE_PATH=/admin/
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})