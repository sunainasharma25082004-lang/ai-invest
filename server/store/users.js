import { User } from '../models/User.js'

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() })
}

export async function findUserById(id) {
  return User.findById(id)
}

export async function createUser(data) {
  return User.create(data)
}