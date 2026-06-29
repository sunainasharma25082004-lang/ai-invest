import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail, findUserById } from '../store/users.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    newsletterConsent: user.newsletterConsent,
    createdAt: user.createdAt,
  }
}

function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone = '',
      password,
      riskAcknowledged,
      newsletterConsent = false,
    } = req.body

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ message: 'First and last name are required.' })
    }

    if (!email?.trim() || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' })
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    if (!riskAcknowledged) {
      return res
        .status(400)
        .json({ message: 'You must acknowledge the cryptocurrency risk to continue.' })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passwordHash,
      riskAcknowledged: true,
      newsletterConsent: Boolean(newsletterConsent),
    })

    const token = createToken(user)

    return res.status(201).json({
      message: 'Account created successfully.',
      user: sanitizeUser(user),
      token,
    })
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }
    return res.status(500).json({ message: 'Unable to create account. Please try again.' })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = createToken(user)

    return res.json({
      message: 'Signed in successfully.',
      user: sanitizeUser(user),
      token,
    })
  } catch {
    return res.status(500).json({ message: 'Unable to sign in. Please try again.' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.json({ user: sanitizeUser(user) })
  } catch {
    return res.status(500).json({ message: 'Unable to fetch profile.' })
  }
})

export default router