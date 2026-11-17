import { createPageMetadata } from '@/lib/seo'
import contactDetails from '@/data/contact'

export const metadata = createPageMetadata({
  title: 'Terms & conditions',
  description: 'Terms and conditions for using BooksRad flight search and booking requests.',
  path: '/terms-conditions',
})

export default function TermsConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink-950">Terms and Conditions</h1>
      <p className="mt-5 text-base leading-7 text-ink-600">
        Welcome to BooksRad. By using https://booksrad.com, you agree to these Terms and Conditions. If you do not
        agree, please do not use the site.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">1. About Us</h2>
      <ul className="mt-3 space-y-1 text-base leading-7 text-ink-600">
        <li>
          <span className="font-semibold text-ink-900">Company Name:</span> BooksRad
        </li>
        <li>
          <span className="font-semibold text-ink-900">Website:</span> booksrad.com
        </li>
        <li>
          <span className="font-semibold text-ink-900">Email:</span>{' '}
          <a href={`mailto:${contactDetails.email}`} className="underline-offset-2 hover:underline">
            {contactDetails.email}
          </a>
        </li>
        <li>
          <span className="font-semibold text-ink-900">Office Address:</span> {contactDetails.offices[0].address}
        </li>
      </ul>
      <p className="mt-3 text-base leading-7 text-ink-600">
        BooksRad helps travelers search flight offers and submit a booking request to our desk. We focus on flights
        only. This website does not sell hotels, car rentals, cruises, visas, or tour packages.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">2. How BooksRad Works</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>You search routes and review flight offers shown on the site.</li>
        <li>You may select an offer and send passenger and contact details as a booking request.</li>
        <li>Submitting a request is not an automatic ticket purchase and does not charge your card by itself.</li>
        <li>Our desk reviews availability, replies with next steps, and only then proceeds toward a confirmed booking if you agree.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">3. Use of Website</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>You must be at least 18 years old to submit a booking request.</li>
        <li>You agree to provide accurate traveler and contact information.</li>
        <li>Incorrect passport names, dates, or contact details can delay or void a booking.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">4. Pricing &amp; Availability</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Flight prices and seats change often and may differ by the time we recheck with the airline.</li>
        <li>An offer on screen is not a guaranteed hold until we confirm it with you in writing.</li>
        <li>If a fare sells out, we will share the closest available alternatives when we can.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">5. Payments</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Payment is only requested after you agree to a confirmed itinerary and fare.</li>
        <li>We accept the payment methods shared with you at confirmation time.</li>
        <li>Displayed totals may include taxes, airline surcharges, and any disclosed service fee.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">6. Changes &amp; Cancellations</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Changes and refunds follow the airline&apos;s fare rules for your ticket.</li>
        <li>Airline change fees, fare differences, and penalties may apply.</li>
        <li>BooksRad service fees, when charged, are generally non-refundable unless we say otherwise in writing.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">7. Your Responsibilities</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Provide correct passenger names as they appear on travel documents</li>
        <li>Hold valid passports, visas, and entry documents for every traveler</li>
        <li>Check flight times, terminals, and airline messages before travel</li>
        <li>Arrive early enough for check-in and security</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">8. Limitation of Liability</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        BooksRad acts as an intermediary between you and airlines or ticketing partners. To the fullest extent allowed
        by law, we are not liable for:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Flight delays, cancellations, or schedule changes</li>
        <li>Airline operational issues or bankruptcy</li>
        <li>Government restrictions, weather, or other events outside our control</li>
        <li>Temporary website or connectivity outages</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">9. Intellectual Property</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        Site content, branding, and design belong to BooksRad and may not be copied for commercial use without
        permission.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">10. Governing Law</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        These terms are governed by the laws of the United States, without regard to conflict-of-law rules.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">11. Changes to Terms</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We may update these Terms &amp; Conditions from time to time. The version on this page is the one that applies.
      </p>

      <div className="mt-10 space-y-1 border-t border-line pt-6 text-sm leading-6 text-ink-600">
        <p>
          <a href={contactDetails.phoneHref} className="font-medium text-ink-900 hover:text-leaf-700">
            {contactDetails.phoneDisplay}
          </a>
        </p>
        <p>
          <a href={`mailto:${contactDetails.email}`} className="font-medium text-ink-900 hover:text-leaf-700">
            {contactDetails.email}
          </a>
        </p>
        <p>{contactDetails.offices[0].address}</p>
      </div>
    </div>
  )
}
