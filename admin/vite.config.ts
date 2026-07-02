import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Standalone Render deploy: base /
// Main site subpath /admin/: npm run build:subpath (ADMIN_BUILD_MODE=subpath)
const base = process.env.ADMIN_BUILD_MODE === 'subpath' ? '/admin/' : '/'

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