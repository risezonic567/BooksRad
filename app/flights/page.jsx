import FlightSearchForm from '@/components/Flights/FlightSearchForm'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Search flights',
  description: 'Search one-way or round-trip flights with BooksRad and request a booking on your preferred offer.',
  path: '/flights',
})

export default function FlightsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Flights</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-950">Search flights</h1>
        <p className="mt-4 text-base leading-7 text-ink-600">
          Enter airports, dates, travelers, and cabin. We return live offers you can select for a booking request.
        </p>
      </div>
      <div className="mt-8">
        <FlightSearchForm variant="page" />
      </div>
    </div>
  )
}
