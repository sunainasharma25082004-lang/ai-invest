import { Globe } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import type { Language } from '../i18n/LanguageContext'

const pickerText = {
  en: {
    selectTitle: 'Choose Your Language',
    selectSubtitle: 'Select English or Arabic — Google Translate will translate the full website',
    english: 'English',
    arabic: 'العربية',
    continue: 'Continue',
    translating: 'Translating...',
  },
  ar: {
    selectTitle: 'اختر لغتك',
    selectSubtitle: 'حدد الإنجليزية أو العربية — سيترجم Google Translate الموقع بالكامل',
    english: 'English',
    arabic: 'العربية',
    continue: 'متابعة',
    translating: 'جارٍ الترجمة...',
  },
} as const

export default function LanguageSelector() {
  const { previewLanguage, setPreviewLanguage, hasSelectedLanguage, confirmLanguage, isTranslating } =
    useLanguage()

  if (hasSelectedLanguage) return null

  const text = pickerText[previewLanguage]

  const handleSelect = (lang: Language) => {
    setPreviewLanguage(lang)
  }

  const handleContinue = () => {
    void confirmLanguage()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
      <div className="glass-card w-full max-w-md animate-fade-up rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 sm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20">
          <Globe className="h-7 w-7 text-cyan-400" />
        </div>

        <h2 className="text-center text-xl font-bold text-white sm:text-2xl">
          {text.selectTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 sm:text-base">
          {text.selectSubtitle}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => handleSelect('en')}
            disabled={isTranslating}
            className={`rounded-xl border-2 px-4 py-5 text-center transition-all sm:py-6 ${
              previewLanguage === 'en'
                ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <p className="mt-2 text-sm font-semibold text-white sm:text-base">
              {text.english}
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('ar')}
            disabled={isTranslating}
            className={`rounded-xl border-2 px-4 py-5 text-center transition-all sm:py-6 ${
              previewLanguage === 'ar'
                ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
            }`}
          >
            <span className="text-2xl">🇸🇦</span>
            <p className="mt-2 text-sm font-semibold text-white sm:text-base">
              {text.arabic}
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isTranslating}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-8 sm:py-4 sm:text-base"
        >
          {isTranslating ? text.translating : text.continue}
        </button>
      </div>
    </div>
  )
}