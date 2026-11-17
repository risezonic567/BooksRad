import AboutPage from '@/components/About/AboutPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'About',
  description: 'Learn how BooksRad helps you search flights and submit clear booking requests.',
  path: '/about',
})

export default function Page() {
  return <AboutPage />
}
