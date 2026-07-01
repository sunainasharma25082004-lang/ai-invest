import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { trustBadges } from '../data/content'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28">
      <div className="glow-orb -top-32 left-1/4 h-96 w-96 bg-cyan-500/20" />
      <div className="glow-orb top-20 right-0 h-80 w-80 bg-blue-600/15" />
      <div className="grid-bg absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 sm:mb-6 sm:px-4 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Digital Assets Research Platform
          </div>

          <h1
            className="animate-fade-up text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            Digital Assets
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Research Tool
            </span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:mt-6 sm:text-lg md:text-xl"
            style={{ animationDelay: '0.2s' }}
          >
            Smarter Data. Informed Decisions. Transparent Investing.
          </p>

          <div
            className="animate-fade-up mt-8 flex w-full flex-col items-stretch justify-center gap-4 sm:mt-10 sm:flex-row sm:items-center"
            style={{ animationDelay: '0.3s' }}
          >
            <a
              href="#signup"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50 hover:brightness-110 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
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
            className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:mt-10 sm:gap-4 md:gap-6"
            style={{ animationDelay: '0.4s' }}
          >
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-float relative mx-auto mt-10 max-w-3xl sm:mt-16">
          <div className="glass-card overflow-hidden rounded-2xl p-1 shadow-2xl shadow-cyan-500/10">
            <div className="rounded-xl bg-slate-900/90 p-4 sm:p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Live Market Overview
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Real-time
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 md:grid-cols-4">
                {[
                  { name: 'Bitcoin', price: '$67,842', change: '+2.4%', up: true },
                  { name: 'Ethereum', price: '$3,521', change: '+1.8%', up: true },
                  { name: 'Solana', price: '$142.30', change: '-0.6%', up: false },
                  { name: 'Market Cap', price: '$2.4T', change: '+1.2%', up: true },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-slate-800 bg-slate-800/50 p-3 sm:p-4"
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