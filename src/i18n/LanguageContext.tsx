import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyDocumentDirection,
  applyGoogleTranslateLanguage,
  getStoredLanguage,
  saveLanguagePreference,
  syncGoogleTranslateOnLoad,
  type SiteLanguage,
} from '../lib/googleTranslate'

type LanguageContextValue = {
  language: SiteLanguage
  setLanguage: (lang: SiteLanguage) => Promise<void>
  isRtl: boolean
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>(
    () => getStoredLanguage() ?? 'en',
  )
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    void syncGoogleTranslateOnLoad()
  }, [])

  const setLanguage = useCallback(async (lang: SiteLanguage) => {
    setIsTranslating(true)
    setLanguageState(lang)
    saveLanguagePreference(lang)
    applyDocumentDirection(lang)

    try {
      await applyGoogleTranslateLanguage(lang)
    } finally {
      setIsTranslating(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRtl: language === 'ar',
      isTranslating,
    }),
    [language, setLanguage, isTranslating],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export type { SiteLanguage as Language }