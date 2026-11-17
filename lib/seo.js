export const BRAND = 'BooksRad'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://booksrad.com'

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}

export function createPageMetadata({ title, description, path = '/' }) {
  const url = absoluteUrl(path)
  const pageTitle = title?.includes(BRAND) ? title : title
  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: BRAND,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
    },
  }
}

