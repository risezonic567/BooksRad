import BlogPage from '@/components/Blog/BlogPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Blog',
  description: 'Flight tips on comparing offers, trip types, and cabin classes from BooksRad.',
  path: '/blog',
})

export default function Page() {
  return <BlogPage />
}
