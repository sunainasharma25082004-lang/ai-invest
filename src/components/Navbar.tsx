import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo-bg.png'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Compliance', href: '#compliance' },
  { label: 'Sign In', href: '#signup?mode=signin' },
  { label: 'Sign Up', href: '#signup' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    window.addEventListener('hashchange', closeMenu)
    return () => window.removeEventListener('hashchange', closeMenu)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <a href="#" className="flex min-w-0 items-center gap-2 group sm:gap-2.5">
          <img
            src={logo}
            alt="InvestAI logo"
            className="h-8 w-8 shrink-0 rounded-xl object-contain transition-transform group-hover:scale-105 sm:h-9 sm:w-9"
          />
          <span className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
            Invest<span className="text-cyan-400">AI</span>
          </span>
        </a>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#signup"
            className="hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 sm:inline-flex sm:px-5 sm:py-2.5"
          >
            Get Started
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-400 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-cyan-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#signup"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/25"
              >
                Get Started
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}