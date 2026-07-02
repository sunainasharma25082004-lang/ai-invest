import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const adminDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = { ...process.env, ADMIN_BUILD_MODE: 'subpath' }

execSync('tsc -b', { cwd: adminDir, stdio: 'inherit', env })
execSync('vite build', { cwd: adminDir, stdio: 'inherit', env })