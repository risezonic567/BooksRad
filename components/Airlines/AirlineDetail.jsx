import Link from 'next/link'
import FillButton from '@/components/Common/FillButton'

export default function AirlineDetail({ airline }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Airline</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-950">{airline.name}</h1>
      <p className="mt-2 text-sm font-semibold text-ink-500">{airline.short}</p>
      <p className="mt-6 text-base leading-8 text-ink-700">{airline.description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <FillButton
          href="/flights"
          className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3 text-sm font-semibold text-ink-950"
        >
          Search flights
        </FillButton>
        <Link
          href="/airlines"
          className="inline-flex items-center justify-center border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
        >
          All airlines
        </Link>
      </div>
    </div>
  )
}
