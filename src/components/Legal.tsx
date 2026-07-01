import { Scale } from 'lucide-react'
import { legalPoints } from '../data/content'

export default function Legal() {
  return (
    <section className="relative border-t border-slate-800 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-bold text-white">
            Legal &amp; Regulatory Information
          </h2>
        </div>
        <ul className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
          {legalPoints.map((point) => (
            <li
              key={point}
              className="flex gap-3 text-sm leading-relaxed text-slate-500"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}