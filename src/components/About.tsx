import { Info } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
              <Info className="h-4 w-4" />
              About Us
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              What Is InvestAI?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-400 sm:mt-6 sm:text-lg">
              InvestAI is a data-driven research and intelligence platform built for
              investors who want to understand Digital assets and cryptocurrency
              markets. We provide factual market analysis, historical data, and
              educational content —{' '}
              <span className="font-semibold text-amber-400/90">
                not financial advice.
              </span>
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 sm:p-8">
            <div className="space-y-6">
              {[
                {
                  stat: '10K+',
                  label: 'Historical data points tracked',
                },
                {
                  stat: '50+',
                  label: 'Digital assets covered',
                },
                {
                  stat: '24/7',
                  label: 'Market intelligence monitoring',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 border-b border-slate-800 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-5 sm:pb-6"
                >
                  <span className="text-2xl font-extrabold text-cyan-400 sm:text-3xl">
                    {item.stat}
                  </span>
                  <span className="text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}