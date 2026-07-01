import { ShieldCheck } from 'lucide-react'
import { compliancePoints } from '../data/content'

export default function Compliance() {
  return (
    <section id="compliance" className="relative py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass-card overflow-hidden rounded-2xl border-emerald-500/20">
          <div className="border-b border-slate-800 bg-emerald-500/5 px-5 py-5 sm:px-8 sm:py-6 md:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                  Google Ads Policy Compliance
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Operated in full compliance with digital assets advertising policy
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-10">
            <p className="mb-6 text-slate-400">
              This landing page and associated advertising campaigns are operated in
              full compliance with digital assets advertising policy. Key compliance
              points:
            </p>
            <ul className="space-y-4">
              {compliancePoints.map((point) => (
                <li key={point} className="flex gap-3 text-slate-300">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}