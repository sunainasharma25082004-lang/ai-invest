export const PRODUCTION_API = 'https://ai-invest-api-bznc.onrender.com/api'

const PLACEHOLDER_PATTERN = /your-api-name|YOUR-API|example\.com/i

export function isInvalidApiUrl(value: string | undefined, isProd: boolean) {
  if (!value || value === '/api') return isProd
  return PLACEHOLDER_PATTERN.test(value)
}

export function normalizeApiBase(value: string) {
  const trimmed = value.replace(/\/+$/, '')
  const match = trimmed.match(/^(.*\/api)(?:\/.*)?$/)
  if (match) return match[1]
  return `${trimmed}/api`
}

export function resolveApiBase(envUrl: string | undefined, isProd: boolean) {
  if (!isInvalidApiUrl(envUrl, isProd)) {
    return normalizeApiBase(envUrl!)
  }
  if (isProd) return PRODUCTION_API
  return '/api'
}