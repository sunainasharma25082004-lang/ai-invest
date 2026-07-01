import { getAdminToken } from './auth'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

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
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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