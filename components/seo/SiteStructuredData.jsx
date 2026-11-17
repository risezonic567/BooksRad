import { BRAND, SITE_URL } from '@/lib/seo'
import contactDetails from '@/data/contact'
import JsonLd from './JsonLd'

export default function SiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND,
        url: SITE_URL,
        email: contactDetails.email,
        telephone: contactDetails.phoneDisplay,
        logo: `${SITE_URL}/images/logo.png`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/flights`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return <JsonLd data={data} />
}
