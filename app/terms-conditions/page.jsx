import { createPageMetadata } from '@/lib/seo'
import contactDetails from '@/data/contact'

export const metadata = createPageMetadata({
  title: 'Terms & conditions',
  description: 'Terms and conditions for using BooksRad.',
  path: '/terms-conditions',
})

export default function TermsConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink-950">Terms and Conditions for Travel Bookings</h1>
      <p className="mt-5 text-base leading-7 text-ink-600">
        Welcome to BooksRad. By accessing and using our website (https://www.booksrad.com), you agree to abide by these
        Terms and Conditions. If you do not wish to comply with these terms, please do not use our company&apos;s
        service.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">1. About Us</h2>
      <ul className="mt-3 space-y-1 text-base leading-7 text-ink-600">
        <li>
          <span className="font-semibold text-ink-900">Company Name:</span> BooksRad
        </li>
        <li>
          <span className="font-semibold text-ink-900">Website:</span> www.booksrad.com
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
        We provide travel-related services such as flight tickets, hotel reservations, car rentals, cruise bookings,
        visas, tour packages, and travel insurance.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">2. Use of Website</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>You must be at least 18 years of age.</li>
        <li>You agree to provide accurate booking information.</li>
        <li>Incorrect information may result in cancellation without refund.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">3. Booking Policy</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>All bookings are subject to confirmation.</li>
        <li>Prices may change due to airline or market conditions.</li>
        <li>Confirmation email will be sent after successful payment.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">4. Payments</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Full payment is required before booking.</li>
        <li>We accept online and offline payment methods.</li>
        <li>Prices may include service fees and local currency charges.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">5. Changes &amp; Modifications</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Changes depend on airline policies.</li>
        <li>Additional fees may apply.</li>
        <li>We are not responsible for airline penalties.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">6. User Responsibilities</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Providing correct passenger details.</li>
        <li>Valid passports and visas.</li>
        <li>Understanding travel restrictions.</li>
        <li>Confirming flight schedules.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">7. Service Fees</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        Service fees are non-refundable and cover consultation, booking, and customer support services.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">8. Limitation of Liability</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Flight delays or cancellations.</li>
        <li>Natural disasters.</li>
        <li>Airline bankruptcy.</li>
        <li>Government restrictions.</li>
        <li>Technical failures.</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We act only as an intermediary between customers and service providers.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">9. Intellectual Property</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        All website content, designs, and logos are owned by BooksRad and cannot be reproduced without permission.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">10. Governing Law</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        These terms are governed by the laws of the United States.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">11. Changes to Terms</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We reserve the right to update these Terms &amp; Conditions at any time without prior notice.
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
