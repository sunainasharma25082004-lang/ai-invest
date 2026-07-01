import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = Router()

function sanitizeSubmission(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    riskAcknowledged: user.riskAcknowledged,
    newsletterConsent: user.newsletterConsent,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function createAdminToken(email) {
  return jwt.sign(
    { id: 'admin', email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' },
  )
}

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return res.status(503).json({ message: 'Admin credentials are not configured.' })
  }

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  if (email.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials.' })
  }

  const token = createAdminToken(adminEmail)

  return res.json({
    message: 'Signed in successfully.',
    token,
    admin: { email: adminEmail },
  })
})

router.get('/stats', requireAdmin, async (_req, res) => {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [total, today, newsletter] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfDay } }),
      User.countDocuments({ newsletterConsent: true }),
    ])

    return res.json({
      total,
      today,
      newsletter,
    })
  } catch {
    return res.status(500).json({ message: 'Unable to fetch stats.' })
  }
})

router.get('/submissions', requireAdmin, async (req, res) => {
  try {
    const { search = '', page = '1', limit = '50' } = req.query
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50))
    const skip = (pageNum - 1) * limitNum

    const filter = {}
    if (typeof search === 'string' && search.trim()) {
      const term = search.trim()
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
      ]
    }

    const [submissions, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ])

    return res.json({
      submissions: submissions.map(sanitizeSubmission),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch {
    return res.status(500).json({ message: 'Unable to fetch submissions.' })
  }
})

export default router