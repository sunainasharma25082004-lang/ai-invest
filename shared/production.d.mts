export const PRODUCTION_API: string
export const PRODUCTION_ORIGINS: string[]
export function isPlaceholderApiUrl(value: string | undefined): boolean
export function resolveBuildApiUrl(envUrl: string | undefined): string