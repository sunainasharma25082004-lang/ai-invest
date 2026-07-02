import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage, isTranslating } = useLanguage()

  return (
    <div
      className="inline-flex rounded-full border border-slate-700 bg-slate-900/60 p-0.5"
      role="group"
      aria-label="Switch language"
    >
      <button
        type="button"
        onClick={() => void setLanguage('en')}
        disabled={isTranslating}
        className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 ${
          language === 'en'
            ? 'bg-cyan-500/20 text-cyan-400'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => void setLanguage('ar')}
        disabled={isTranslating}
        className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 ${
          language === 'ar'
            ? 'bg-cyan-500/20 text-cyan-400'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        ع
      </button>
    </div>
  )
}