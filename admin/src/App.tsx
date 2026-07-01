import { useState } from 'react'
import { getAdminToken } from './lib/auth'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminToken()))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {authenticated ? (
        <Dashboard onLogout={() => setAuthenticated(false)} />
      ) : (
        <Login onLogin={() => setAuthenticated(true)} />
      )}
    </div>
  )
}