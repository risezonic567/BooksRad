import Link from 'next/link'
import FillButton from '@/components/Common/FillButton'
import contactDetails from '@/data/contact'

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-950">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(ellipse 70% 50% at 70% 0%, rgba(140,198,63,0.25), transparent 55%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-400">BooksRad</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A flight desk built around search, select, and request.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-300">
            BooksRad helps travelers compare live flight offers and submit a clear booking request — without hotels, cars, or packed dashboards getting in the way.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">What we do</h2>
            <p className="mt-4 text-base leading-7 text-ink-600">
              You search routes with airport suggestions, browse simplified offers (airline, price, stops, duration), and send passenger details to our desk. We verify the fare and guide you through booking.
            </p>
            <p className="mt-4 text-base leading-7 text-ink-600">
              We stay focused on flights. No hotel upsells, car rentals, or insurance widgets — just the path from offer to request.
            </p>
          </div>
          <div className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <h2 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">How we work</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-ink-600">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" aria-hidden />
                Live search via Duffel offer requests
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" aria-hidden />
                Human reply within one business day
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" aria-hidden />
                Mobile-first forms with accessible focus states
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <FillButton
                href="/flights"
                className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3 text-sm font-semibold text-ink-950"
              >
                Search flights
              </FillButton>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900 transition hover:border-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
              >
                Contact {contactDetails.email}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
