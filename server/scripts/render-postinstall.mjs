import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const isRender = Boolean(process.env.RENDER)
const distIndex = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'index.html')

if (!isRender) {
  process.exit(0)
}

if (process.env.SERVE_STATIC === 'false' || process.env.SKIP_FRONTEND_BUILD === 'true') {
  console.log('API-only mode: skipping frontend build.')
  process.exit(0)
}

if (existsSync(distIndex)) {
  console.log('Frontend dist already present, skipping build.')
  process.exit(0)
}

await import('./build-frontend.mjs')