import { AlertTriangle } from 'lucide-react'

export default function RiskDisclaimer() {
  return (
    <section className="relative py-10 sm:py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-5 sm:p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wide text-amber-400">
                Risk Disclaimer
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-amber-100/80 md:text-base">
                Digital currency investments, including Bitcoin, are highly volatile
                and speculative. The value of your investment can go down as well as
                up and you may not get back the amount you invested. This platform
                provides information and research tools only and does not constitute
                financial, investment, or legal advice. Always consult a qualified
                financial adviser before making investment decisions. Past performance
                is not a reliable indicator of future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}