const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export type AuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  newsletterConsent?: boolean
  createdAt?: string
}

type AuthResponse = {
  message: string
  user: AuthUser
  token: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const data: unknown = await response.json()

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Something went wrong.'
    throw new Error(message)
  }

  return data as T
}

export type SignupPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  riskAcknowledged: boolean
  newsletterConsent: boolean
}

export type SigninPayload = {
  email: string
  password: string
}

export function signup(payload: SignupPayload) {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function signin(payload: SigninPayload) {
  return request<AuthResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchProfile(token: string) {
  return request<{ user: AuthUser }>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}