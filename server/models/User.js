import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    riskAcknowledged: { type: Boolean, default: false },
    newsletterConsent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.model('User', userSchema)