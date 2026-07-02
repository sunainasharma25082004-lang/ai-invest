import express from 'express'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '..', 'dist')
const adminDistPath = path.join(__dirname, '..', 'admin', 'dist')
const indexHtml = path.join(distPath, 'index.html')
const adminIndexHtml = path.join(adminDistPath, 'index.html')

const app = express()
const PORT = process.env.PORT || 3000

if (!existsSync(indexHtml)) {
  console.error(`Frontend build missing: ${indexHtml}`)
  process.exit(1)
}

if (existsSync(adminIndexHtml)) {
  app.get('/admin', (_req, res) => {
    res.redirect('/admin/')
  })
  app.use('/admin', express.static(adminDistPath))
  app.use('/admin', (_req, res) => {
    res.sendFile(adminIndexHtml)
  })
  console.log('Admin panel at /admin/')
} else {
  console.warn(`Admin build missing: ${adminIndexHtml}`)
}

app.use(express.static(distPath))

app.get(/^(?!\/admin).*/, (_req, res) => {
  res.sendFile(indexHtml)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend + Admin server on port ${PORT}`)
})