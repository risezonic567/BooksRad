import DestinationsPage from '@/components/Destinations/DestinationsPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Destinations',
  description: 'Browse popular flight destinations and search trips with BooksRad.',
  path: '/destinations',
})

export default function Page() {
  return <DestinationsPage />
}
