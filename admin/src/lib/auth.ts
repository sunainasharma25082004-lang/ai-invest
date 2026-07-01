const TOKEN_KEY = 'ai_invest_admin_token'
const ADMIN_KEY = 'ai_invest_admin_user'

export type AdminUser = {
  email: string
}

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminUser(): AdminUser | null {
  const raw = localStorage.getItem(ADMIN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function saveAdminSession(token: string, admin: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}