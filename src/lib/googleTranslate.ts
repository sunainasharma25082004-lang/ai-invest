export type SiteLanguage = 'en' | 'ar'

export const LANGUAGE_STORAGE_KEY = 'investai-lang'
const GOOGLE_SCRIPT_ID = 'google-translate-script'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string
              includedLanguages?: string
              autoDisplay?: boolean
              layout?: number
            },
            elementId: string,
          ): void
          InlineLayout: {
            SIMPLE: number
          }
        }
      }
    }
  }
}

function getGoogTransCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function setGoogTransCookie(lang: SiteLanguage) {
  const hostname = window.location.hostname
  const value = lang === 'en' ? '' : `/en/${lang}`
  const expires = lang === 'en' ? 'Thu, 01 Jan 1970 00:00:01 GMT' : ''
  const expiryPart = expires ? `;expires=${expires}` : ''

  document.cookie = `googtrans=${value};path=/${expiryPart}`

  if (hostname.includes('.')) {
    document.cookie = `googtrans=${value};path=/;domain=.${hostname}${expiryPart}`
  }
}

function expectedCookie(lang: SiteLanguage) {
  return lang === 'en' ? '' : `/en/${lang}`
}

function isPageAlreadyTranslated(lang: SiteLanguage) {
  if (lang === 'en') return true
  return (
    document.documentElement.classList.contains('translated-rtl') ||
    document.body.classList.contains('translated-rtl') ||
    document.querySelector('.goog-te-gadget') !== null
  )
}

export function getStoredLanguage(): SiteLanguage | null {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'hi') {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY)
    setGoogTransCookie('en')
    return null
  }
  return stored === 'en' || stored === 'ar' ? stored : null
}

export function saveLanguagePreference(lang: SiteLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
}

export function applyDocumentDirection(lang: SiteLanguage) {
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en'
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function loadGoogleTranslate(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      resolve()
      return
    }

    window.googleTranslateElementInit = () => {
      const google = window.google
      if (!google?.translate?.TranslateElement) {
        resolve()
        return
      }

      new google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          autoDisplay: false,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element',
      )

      resolve()
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.onerror = () => resolve()
    document.body.appendChild(script)
  })
}

export async function applyGoogleTranslateLanguage(
  lang: SiteLanguage,
  options: { reloadOnFallback?: boolean } = {},
): Promise<boolean> {
  const { reloadOnFallback = true } = options

  saveLanguagePreference(lang)
  applyDocumentDirection(lang)

  const currentCookie = getGoogTransCookie()
  const targetCookie = expectedCookie(lang)

  if (currentCookie === targetCookie && isPageAlreadyTranslated(lang)) {
    return true
  }

  setGoogTransCookie(lang)

  if (lang === 'en') {
    if (reloadOnFallback && currentCookie !== '') {
      window.location.reload()
    }
    return true
  }

  if (reloadOnFallback) {
    window.location.reload()
    return true
  }

  await loadGoogleTranslate()
  return true
}

export async function syncGoogleTranslateOnLoad(): Promise<void> {
  const stored = getStoredLanguage()
  if (!stored || stored === 'en') {
    applyDocumentDirection('en')
    return
  }

  applyDocumentDirection('ar')

  if (getGoogTransCookie() !== expectedCookie(stored)) {
    setGoogTransCookie(stored)
  }

  if (isPageAlreadyTranslated('ar')) {
    return
  }

  await loadGoogleTranslate()
}