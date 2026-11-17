import { createPageMetadata } from '@/lib/seo'
import contactDetails from '@/data/contact'

export const metadata = createPageMetadata({
  title: 'Privacy policy',
  description: 'Privacy policy for BooksRad flight search and booking requests.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink-950">Privacy Policy for BooksRad</h1>
      <p className="mt-5 text-base leading-7 text-ink-600">
        BooksRad respects your privacy. This policy explains what we collect when you use our website to search
        flights and send a booking request, and how we handle that information.
      </p>
      <p className="mt-4 text-base leading-7 text-ink-600">
        BooksRad is a flight-focused service. We help you compare flight offers and submit a booking request to our
        desk. We do not sell hotel, car rental, cruise, or package-tour products on this website.
      </p>
      <p className="mt-4 text-base leading-7 text-ink-600">
        By using the website, you agree to this policy. Questions? Email{' '}
        <a href={`mailto:${contactDetails.email}`} className="font-medium text-ink-900 underline-offset-2 hover:underline">
          {contactDetails.email}
        </a>
        .
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">1. Information We Collect</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">Depending on how you use the site, we may collect:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Contact details (name, email, phone)</li>
        <li>Passenger details you enter for a booking request (names, dates of birth, passport info if provided)</li>
        <li>Trip details (airports, dates, cabin, traveler counts, selected offer summary)</li>
        <li>Messages you send through the contact form</li>
        <li>Technical data such as IP address and basic device/browser information</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We do not ask you to enter card details on the website when you submit a request. If payment is needed later,
        it is handled through a secure method we share with you at that time.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">2. How We Use Your Information</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>To run flight search and show offer results</li>
        <li>To process and reply to booking or contact requests</li>
        <li>To confirm availability with airlines or ticketing partners</li>
        <li>To improve the website and prevent abuse</li>
        <li>To send trip-related updates you asked for</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">3. Sharing of Information</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We only share what is needed to fulfill your request, for example with:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Airlines and flight-content / ticketing partners</li>
        <li>Email and infrastructure providers that help us run the site</li>
        <li>Government authorities when the law requires it</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-ink-600">We do not sell your personal data.</p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">4. Payment Security</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        Submitting a booking request on BooksRad does not charge your card automatically. When you choose to pay for a
        confirmed itinerary, payment is processed through secure third-party methods. We do not store full card numbers
        on our servers.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">5. Cookies</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We may use cookies or similar technology to keep the site working smoothly, remember basic preferences, and
        understand how pages are used so we can improve them.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">6. Data Protection</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We take reasonable steps to protect personal information against unauthorized access, loss, or misuse. No
        method of transmission over the internet is 100% secure, so please share only what you need for your request.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">7. Marketing Communication</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We may occasionally send flight or service updates if you have been in touch with us. You can ask us to stop
        anytime by emailing {contactDetails.email}.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">8. Third-Party Links</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        Our site may link to airline or partner pages. Their privacy practices are their own; this policy covers
        BooksRad only.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">9. Children&apos;s Privacy</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        BooksRad is intended for adults arranging travel. We do not knowingly collect personal data from children
        under 13 for their own accounts. Passenger details for minors may be provided by a parent or guardian as part
        of a booking request.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">10. Your Rights</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">Subject to applicable law, you may ask us to:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Share what personal data we hold about you</li>
        <li>Correct inaccurate information</li>
        <li>Delete information we no longer need to keep</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-ink-600">
        Contact {contactDetails.email} and we will respond as soon as we reasonably can.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">11. Policy Updates</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We may update this Privacy Policy from time to time. The latest version will always be posted on this page.
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
