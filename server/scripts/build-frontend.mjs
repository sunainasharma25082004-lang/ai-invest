import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const rootDir = join(serverDir, '..')
const distIndex = join(serverDir, 'dist', 'index.html')

const env = {
  ...process.env,
  NPM_CONFIG_PRODUCTION: 'false',
}

console.log('Building frontend for production...')

execSync('npm install --include=dev', {
  cwd: rootDir,
  stdio: 'inherit',
  env,
})

execSync('npm run build', {
  cwd: rootDir,
  stdio: 'inherit',
  env,
})

if (!existsSync(distIndex)) {
  console.error(`Frontend build failed: missing ${distIndex}`)
  process.exit(1)
}

console.log(`Frontend ready at ${distIndex}`)