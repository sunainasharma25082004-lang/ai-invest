function normalizeApiBase(value: string | undefined) {
  if (!value || value === '/api') return '/api'
  const trimmed = value.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

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
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again in a moment.')
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('Unexpected server response. Please try again.')
  }

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