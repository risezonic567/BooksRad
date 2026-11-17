import airlines from '@/data/airlines'
import blogs from '@/data/blogs'
import destinations from '@/data/destinations'
import { absoluteUrl } from '@/lib/seo'

const staticPaths = [
  '/',
  '/flights',
  '/destinations',
  '/airlines',
  '/about',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms-conditions',
]

const detailPaths = [
  ...destinations.map(({ slug }) => `/destinations/${slug}`),
  ...airlines.map(({ slug }) => `/airlines/${slug}`),
  ...blogs.map(({ slug }) => `/blog/${slug}`),
]

export default function sitemap() {
  return [...staticPaths, ...detailPaths].map((path) => ({
    url: absoluteUrl(path),
  }))
}
