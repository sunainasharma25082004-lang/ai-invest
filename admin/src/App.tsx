import { useState } from 'react'
import { getAdminToken } from './lib/auth'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import LanguageSelector from './components/LanguageSelector'
import GoogleTranslateWidget from './components/GoogleTranslateWidget'
import { LanguageProvider } from './i18n/LanguageContext'

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminToken()))

  return (
    <LanguageProvider>
      <GoogleTranslateWidget />
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <LanguageSelector />
        {authenticated ? (
          <Dashboard onLogout={() => setAuthenticated(false)} />
        ) : (
          <Login onLogin={() => setAuthenticated(true)} />
        )}
      </div>
    </LanguageProvider>
  )
}