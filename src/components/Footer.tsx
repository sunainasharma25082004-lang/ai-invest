const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Risk Disclosure', href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
        <p>© 2025 InvestAI Research Platform</p>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              <a
                href={link.href}
                className="transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
              {i < footerLinks.length - 1 && (
                <span className="hidden text-slate-700 md:inline">|</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  )
}