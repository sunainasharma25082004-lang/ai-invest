import { getAdminToken } from './auth'

function normalizeApiBase(value: string | undefined) {
  if (!value || value === '/api') return '/api'
  const trimmed = value.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

export type Submission = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  riskAcknowledged: boolean
  newsletterConsent: boolean
  createdAt: string
  updatedAt: string
}

export type Stats = {
  total: number
  today: number
  newsletter: number
}

type SubmissionsResponse = {
  submissions: Submission[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

type AdminLoginResponse = {
  message: string
  token: string
  admin: { email: string }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken()
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export function adminLogin(email: string, password: string) {
  return request<AdminLoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchStats() {
  return request<Stats>('/admin/stats')
}

export function fetchSubmissions(params: {
  search?: string
  page?: number
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const qs = query.toString()
  return request<SubmissionsResponse>(`/admin/submissions${qs ? `?${qs}` : ''}`)
}