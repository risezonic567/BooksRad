import AirlinesPage from '@/components/Airlines/AirlinesPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Airlines',
  description: 'Explore airlines commonly available in BooksRad flight search.',
  path: '/airlines',
})

export default function Page() {
  return <AirlinesPage />
}
