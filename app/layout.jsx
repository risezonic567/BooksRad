import { Libre_Baskerville, Source_Sans_3 } from 'next/font/google'
import Navbar from '@/components/Common/Navbar'
import Footer from '@/components/Common/Footer'
import SiteStructuredData from '@/components/seo/SiteStructuredData'
import { BRAND, SITE_URL } from '@/lib/seo'
import './globals.css'

const display = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display-family',
  display: 'swap',
})

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans-family',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} | Book Flights`,
    template: `%s | ${BRAND}`,
  },
  description:
    'BooksRad helps you search flights, compare offers, and submit a clear booking request — airport suggestions powered by Duffel.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: BRAND,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-paper font-sans text-ink-900 antialiased"
      >
        <SiteStructuredData />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
