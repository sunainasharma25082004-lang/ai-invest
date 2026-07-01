import { useEffect, useState, type FormEvent } from 'react'
import { Lock, LogOut, Send } from 'lucide-react'
import { signin, signup } from '../lib/api'
import { clearSession, getStoredUser, saveSession } from '../lib/auth'

type AuthMode = 'signup' | 'signin'

type SignupFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  riskAcknowledged: boolean
  newsletterConsent: boolean
}

type SigninFormData = {
  email: string
  password: string
}

const initialSignup: SignupFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  riskAcknowledged: false,
  newsletterConsent: false,
}

const initialSignin: SigninFormData = {
  email: '',
  password: '',
}

function getModeFromHash(): AuthMode {
  const hash = window.location.hash
  const query = hash.includes('?') ? hash.split('?')[1] : ''
  return new URLSearchParams(query).get('mode') === 'signin' ? 'signin' : 'signup'
}

export default function SignupForm() {
  const [mode, setMode] = useState<AuthMode>(() => getModeFromHash())
  const [signupForm, setSignupForm] = useState<SignupFormData>(initialSignup)
  const [signinForm, setSigninForm] = useState<SigninFormData>(initialSignin)
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const syncMode = () => setMode(getModeFromHash())
    window.addEventListener('hashchange', syncMode)
    return () => window.removeEventListener('hashchange', syncMode)
  }, [])

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'

  const handleSignout = () => {
    clearSession()
    setUser(null)
    setSignupForm(initialSignup)
    setSigninForm(initialSignin)
    setError('')
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!signupForm.firstName.trim() || !signupForm.lastName.trim()) {
      setError('Please enter your first and last name.')
      return
    }
    if (!signupForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (signupForm.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!signupForm.riskAcknowledged) {
      setError('You must acknowledge the cryptocurrency risk to continue.')
      return
    }

    setLoading(true)
    try {
      const response = await signup({
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        phone: signupForm.phone,
        password: signupForm.password,
        riskAcknowledged: signupForm.riskAcknowledged,
        newsletterConsent: signupForm.newsletterConsent,
      })

      saveSession(response.token, response.user)
      setUser(response.user)
      setSignupForm(initialSignup)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!signinForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signinForm.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!signinForm.password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const response = await signin({
        email: signinForm.email,
        password: signinForm.password,
      })

      saveSession(response.token, response.user)
      setUser(response.user)
      setSigninForm(initialSignin)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <section id="signup" className="relative py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="glass-card rounded-2xl p-6 sm:p-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <Send className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Welcome, {user.firstName}!
            </h2>
            <p className="mt-3 text-slate-400">
              You are signed in as {user.email}. Your research dashboard access is
              ready.
            </p>
            <button
              type="button"
              onClick={handleSignout}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-400"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="signup" className="relative py-16 sm:py-20 md:py-28">
      <div className="glow-orb right-0 top-0 h-48 w-48 bg-cyan-500/15 sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Account Access
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {mode === 'signup' ? 'Create Your Free Account' : 'Sign In to Your Account'}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            {mode === 'signup'
              ? 'Fill in the form below to access our research dashboard. Your data is protected under our Privacy Policy and is never sold to third parties.'
              : 'Welcome back. Sign in with your email and password to access your research dashboard.'}
          </p>
        </div>

        <div className="mt-6 flex justify-center sm:mt-8">
          <div className="inline-flex w-full max-w-sm rounded-full border border-slate-700 bg-slate-900/60 p-1 sm:w-auto sm:max-w-none">
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
              }}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError('')
              }}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5 ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {mode === 'signup' ? (
          <form
            onSubmit={handleSignup}
            className="glass-card mt-6 rounded-2xl p-5 sm:mt-8 sm:p-8 md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={signupForm.firstName}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={signupForm.lastName}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Doe"
                />
              </div>
              <div>
                <label htmlFor="signupEmail" className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  id="signupEmail"
                  type="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="signupPassword" className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="signupPassword"
                  type="password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={signupForm.riskAcknowledged}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      riskAcknowledged: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                />
                <span className="text-sm leading-relaxed text-slate-400">
                  I agree to understand that cryptocurrency involves significant risk.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={signupForm.newsletterConsent}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      newsletterConsent: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                />
                <span className="text-sm leading-relaxed text-slate-400">
                  I consent to receiving market updates and research newsletters
                  (opt-out at any time).
                </span>
              </label>
            </div>

            {error && (
              <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-8 sm:py-4 sm:text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              No financial commitment required — educational access only.
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSignin}
            className="glass-card mt-6 rounded-2xl p-5 sm:mt-8 sm:p-8 md:p-10"
          >
            <div className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="signinEmail" className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  id="signinEmail"
                  type="email"
                  value={signinForm.email}
                  onChange={(e) =>
                    setSigninForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="signinPassword" className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="signinPassword"
                  type="password"
                  value={signinForm.password}
                  onChange={(e) =>
                    setSigninForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Your password"
                />
              </div>
            </div>

            {error && (
              <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-8 sm:py-4 sm:text-base"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}