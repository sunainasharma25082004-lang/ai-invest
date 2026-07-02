import { useState, type FormEvent } from 'react'
import { Lock, Shield } from 'lucide-react'
import { adminLogin } from '../lib/api'
import { saveAdminSession } from '../lib/auth'
import LanguageToggle from './LanguageToggle'

type Props = {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await adminLogin(email, password)
      saveAdminSession(response.token, response.admin)
      onLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15">
            <Shield className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">InvestAI Admin</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to view all form submissions and signups
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Your admin password"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            Authorized personnel only
          </p>
        </form>
      </div>
    </div>
  )
}