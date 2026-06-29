import logo from '../assets/logo-bg.png'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Compliance', href: '#compliance' },
  { label: 'Sign In', href: '#signup?mode=signin' },
  { label: 'Sign Up', href: '#signup' },
]

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="InvestAI logo"
            className="h-9 w-9 rounded-xl object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Invest<span className="text-cyan-400">AI</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
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

        <a
          href="#signup"
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110"
        >
          Get Started
        </a>
      </nav>
    </header>
  )
}