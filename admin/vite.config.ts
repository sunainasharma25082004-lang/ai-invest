import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveBuildApiUrl } from '../shared/production.mjs'

// Standalone Render deploy: base /
// Main site subpath /admin/: npm run build:subpath (ADMIN_BUILD_MODE=subpath)
const base = process.env.ADMIN_BUILD_MODE === 'subpath' ? '/admin/' : '/'
const buildApiUrl =
  process.env.NODE_ENV === 'production'
    ? resolveBuildApiUrl(process.env.VITE_API_URL)
    : process.env.VITE_API_URL || '/api'

export default defineConfig({
  base,
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(buildApiUrl),
  },
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