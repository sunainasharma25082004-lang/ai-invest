import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const isRender = Boolean(process.env.RENDER)
const distIndex = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'index.html')

if (!isRender) {
  process.exit(0)
}

if (existsSync(distIndex)) {
  console.log('Frontend dist already present, skipping build.')
  process.exit(0)
}

await import('./build-frontend.mjs')