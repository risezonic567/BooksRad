import Link from 'next/link'
import airlines from '@/data/airlines'

export default function AirlinesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Airlines</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-950">Carriers we search often</h1>
        <p className="mt-4 text-base leading-7 text-ink-600">
          Learn a bit about each airline, then search live offers for your route.
        </p>
      </div>

      <ul className="mt-10 divide-y divide-line border-y border-line">
        {airlines.map((airline) => (
          <li key={airline.slug}>
            <Link
              href={`/airlines/${airline.slug}`}
              className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
            >
              <span>
                <span className="block font-display text-xl font-bold text-ink-950 group-hover:text-leaf-700">
                  {airline.name}
                </span>
                <span className="mt-1 block text-sm text-ink-600">{airline.short}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-ink-400 transition group-hover:text-leaf-600" aria-hidden>
                View →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
