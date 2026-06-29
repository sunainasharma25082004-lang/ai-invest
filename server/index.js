import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectDB } from './db/connect.js'
import authRoutes from './routes/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')
const isProduction = process.env.NODE_ENV === 'production'

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const allowedOrigins = new Set(
  [
    CLIENT_ORIGIN,
    process.env.RENDER_EXTERNAL_URL,
    'http://localhost:5173',
    'http://localhost:4173',
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

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found.' })
  }
  next()
})

if (isProduction) {
  app.use(express.static(distPath))

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' })
  })
}

async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      if (isProduction) {
        console.log('Serving frontend from dist/')
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()