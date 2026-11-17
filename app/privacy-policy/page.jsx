import { createPageMetadata } from '@/lib/seo'
import contactDetails from '@/data/contact'

export const metadata = createPageMetadata({
  title: 'Privacy policy',
  description: 'Privacy policy for BooksRad.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink-950">Privacy Policy for BooksRad</h1>
      <p className="mt-5 text-base leading-7 text-ink-600">
        BooksRad respects your privacy and is committed to protecting your personal information. We will only use
        the information that you provide to us in a way that is secure, transparent, and responsible.
      </p>
      <p className="mt-4 text-base leading-7 text-ink-600">
        This Privacy Policy describes how we collect, use, store, and protect any information you provide to us while
        using our website or making purchases through our travel-related services such as flights, hotels, car rentals,
        cruises, visas, tours, and travel insurance.
      </p>
      <p className="mt-4 text-base leading-7 text-ink-600">
        By using the website and/or the services, you consent to the terms of this policy. For any questions, contact
        us at{' '}
        <a href={`mailto:${contactDetails.email}`} className="font-medium text-ink-900 underline-offset-2 hover:underline">
          {contactDetails.email}
        </a>
        .
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">1. Information We Collect</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Passport details</li>
        <li>Travel preferences</li>
        <li>Payment information</li>
        <li>IP address</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">2. How We Use Your Information</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Processing of bookings</li>
        <li>Customer support</li>
        <li>Sending confirmations</li>
        <li>Improving our services</li>
        <li>Sending promotional offers (with permission)</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">3. Sharing of Information</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Airlines</li>
        <li>Hotels</li>
        <li>Tour operators</li>
        <li>Payment gateways</li>
        <li>Government authorities (if required)</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-ink-600">We never sell your personal data to third parties.</p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">4. Payment Security</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        Your payments are processed via secure third-party payment services. Your card information is not stored on our
        servers.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">5. Cookies</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Improve website performance</li>
        <li>Track user interaction</li>
        <li>Enhance user experience</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">6. Data Protection</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Unauthorized access</li>
        <li>Data loss</li>
        <li>Misuse</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">7. Marketing Communication</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We may send promotional emails. You can opt out anytime by contacting us.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">8. Third-Party Links</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We are not responsible for the privacy practices of third-party websites.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">9. Children&apos;s Privacy</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        We do not knowingly collect personal data from children under 13.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">10. Your Rights</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-7 text-ink-600">
        <li>Request your data</li>
        <li>Correct your data</li>
        <li>Delete your data</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink-950">11. Policy Updates</h2>
      <p className="mt-3 text-base leading-7 text-ink-600">
        This Privacy Policy may be updated from time to time. Updates will be posted on this page.
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
