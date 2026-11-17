import { BRAND, SITE_URL } from '@/lib/seo'
import contactDetails from '@/data/contact'
import JsonLd from './JsonLd'

export default function SiteStructuredData() {
  const office = contactDetails.offices?.[0]

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND,
        url: SITE_URL,
        email: contactDetails.email,
        telephone: contactDetails.phoneE164 || contactDetails.phoneDisplay,
        logo: `${SITE_URL}/images/logo.png`,
        ...(office
          ? {
              address: {
                '@type': 'PostalAddress',
                streetAddress: office.streetAddress || office.address,
                addressLocality: office.addressLocality || undefined,
                addressRegion: office.addressRegion || undefined,
                postalCode: office.postalCode || undefined,
                addressCountry: office.addressCountry || 'US',
              },
            }
          : {}),
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: contactDetails.phoneE164 || contactDetails.phoneDisplay,
          email: contactDetails.email,
          contactType: 'customer service',
          areaServed: 'US',
          availableLanguage: ['English'],
        },
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
