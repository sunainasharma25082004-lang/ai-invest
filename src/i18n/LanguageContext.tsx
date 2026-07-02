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
  previewLanguage: SiteLanguage
  setPreviewLanguage: (lang: SiteLanguage) => void
  setLanguage: (lang: SiteLanguage) => Promise<void>
  hasSelectedLanguage: boolean
  confirmLanguage: () => Promise<void>
  isRtl: boolean
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>(
    () => getStoredLanguage() ?? 'en',
  )
  const [previewLanguage, setPreviewLanguageState] = useState<SiteLanguage>(
    () => getStoredLanguage() ?? 'en',
  )
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(
    () => getStoredLanguage() !== null,
  )
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    if (!hasSelectedLanguage) return
    void syncGoogleTranslateOnLoad()
  }, [hasSelectedLanguage])

  const setLanguage = useCallback(async (lang: SiteLanguage) => {
    setIsTranslating(true)
    setLanguageState(lang)
    setPreviewLanguageState(lang)
    saveLanguagePreference(lang)
    setHasSelectedLanguage(true)
    applyDocumentDirection(lang)

    try {
      await applyGoogleTranslateLanguage(lang)
    } finally {
      setIsTranslating(false)
    }
  }, [])

  const setPreviewLanguage = useCallback((lang: SiteLanguage) => {
    setPreviewLanguageState(lang)
  }, [])

  const confirmLanguage = useCallback(async () => {
    await setLanguage(previewLanguage)
  }, [previewLanguage, setLanguage])

  const value = useMemo(
    () => ({
      language,
      previewLanguage,
      setPreviewLanguage,
      setLanguage,
      hasSelectedLanguage,
      confirmLanguage,
      isRtl: language === 'ar',
      isTranslating,
    }),
    [
      language,
      previewLanguage,
      setPreviewLanguage,
      setLanguage,
      hasSelectedLanguage,
      confirmLanguage,
      isTranslating,
    ],
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