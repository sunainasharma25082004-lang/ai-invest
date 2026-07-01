import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { connectDB } from './db/connect.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config({ path: path.join(__dirname, '../.env') })

const distPath = path.join(__dirname, '..', 'dist')
const isProduction = process.env.NODE_ENV === 'production'

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5173'

const allowedOrigins = new Set(
  [
    CLIENT_ORIGIN,
    process.env.ADMIN_ORIGIN,
    process.env.RENDER_EXTERNAL_URL,
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:5174',
  ].filter(Boolean),
)

if (isProduction && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required in production.')
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using a default development secret.')
  process.env.JWT_SECRET = 'dev-only-change-in-production'
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: 'mongodb',
    environment: isProduction ? 'production' : 'development',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found.' })
  }
  next()
})

const serveStatic = process.env.SERVE_STATIC !== 'false'

if (isProduction && serveStatic) {
  const indexHtml = path.join(distPath, 'index.html')
  if (!existsSync(indexHtml)) {
    console.error(`Frontend build missing: ${indexHtml}`)
    console.error('Run "npm run build" from the repo root before starting in production.')
    process.exit(1)
  }

  app.use(express.static(distPath))

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else if (!isProduction) {
  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' })
  })
}

async function startServer() {
  if (isProduction && !process.env.MONGODB_URI) {
    console.error(
      'MONGODB_URI is required in production. Add it in Render → Environment.',
    )
    process.exit(1)
  }

  try {
    await connectDB()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
      if (isProduction) {
        console.log('Serving frontend from dist/')
        console.log(`App URL: ${CLIENT_ORIGIN}`)
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    if (isProduction && /whitelist|IP|ENOTFOUND|authentication/i.test(error.message)) {
      console.error(
        'MongoDB Atlas fix: Network Access → Add IP → Allow access from anywhere (0.0.0.0/0).',
      )
    }
    process.exit(1)
  }
}

startServer()