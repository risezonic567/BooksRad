import ResultsClient from '@/components/Flights/ResultsClient'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Flight results',
  description: 'Compare live flight offers and select one to request a booking with BooksRad.',
  path: '/flight-results',
})

export default function FlightResultsPage() {
  return <ResultsClient />
}
