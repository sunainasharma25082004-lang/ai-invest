export const PRODUCTION_API = 'https://ai-invest-api-bznc.onrender.com/api'

export const PRODUCTION_ORIGINS = [
  'https://investindigitalcurrency.com',
  'https://www.investindigitalcurrency.com',
  'https://ai-admin-dd0z.onrender.com',
]

const PLACEHOLDER_PATTERN = /your-api-name|YOUR-API|example\.com/i

export function isPlaceholderApiUrl(value) {
  if (!value || value === '/api') return true
  return PLACEHOLDER_PATTERN.test(value)
}

export function resolveBuildApiUrl(envUrl) {
  const raw = envUrl ?? ''
  if (raw && !isPlaceholderApiUrl(raw)) {
    const trimmed = raw.replace(/\/+$/, '')
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
  }
  return PRODUCTION_API
}