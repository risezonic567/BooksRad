import ContactPage from '@/components/Contact/ContactPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Contact the BooksRad desk about flight searches and booking requests.',
  path: '/contact',
})

export default function Page() {
  return <ContactPage />
}
