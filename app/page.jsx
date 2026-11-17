import HomePage from '@/components/Home/HomePage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'BooksRad | Book Flights',
  description:
    'Search flights, compare live offers, and submit a booking request with BooksRad.',
  path: '/',
})

export default function Page() {
  return <HomePage />
}
