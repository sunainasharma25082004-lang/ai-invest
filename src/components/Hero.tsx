import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { trustBadges } from '../data/content'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="glow-orb -top-32 left-1/4 h-96 w-96 bg-cyan-500/20" />
      <div className="glow-orb top-20 right-0 h-80 w-80 bg-blue-600/15" />
      <div className="grid-bg absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Digital Assets Research Platform
          </div>

          <h1
            className="animate-fade-up text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            Digital Assets
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Research Tool
            </span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl"
            style={{ animationDelay: '0.2s' }}
          >
            Smarter Data. Informed Decisions. Transparent Investing.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >
            <a
              href="#signup"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50 hover:brightness-110"
            >
              Explore Our Research Platform
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <p
            className="animate-fade-up mt-6 text-sm text-slate-500"
            style={{ animationDelay: '0.35s' }}
          >
            Access real-time Digital currency analytics, market intelligence, and
            educational resources.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-6"
            style={{ animationDelay: '0.4s' }}
          >
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-float relative mx-auto mt-16 max-w-3xl">
          <div className="glass-card overflow-hidden rounded-2xl p-1 shadow-2xl shadow-cyan-500/10">
            <div className="rounded-xl bg-slate-900/90 p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Live Market Overview
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Real-time
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { name: 'Bitcoin', price: '$67,842', change: '+2.4%', up: true },
                  { name: 'Ethereum', price: '$3,521', change: '+1.8%', up: true },
                  { name: 'Solana', price: '$142.30', change: '-0.6%', up: false },
                  { name: 'Market Cap', price: '$2.4T', change: '+1.2%', up: true },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-slate-800 bg-slate-800/50 p-4"
                  >
                    <p className="text-xs text-slate-500">{item.name}</p>
                    <p className="mt-1 text-lg font-bold text-white">{item.price}</p>
                    <p
                      className={`mt-0.5 text-xs font-medium ${item.up ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {item.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}