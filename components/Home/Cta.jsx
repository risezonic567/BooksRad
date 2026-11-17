import contactDetails from '@/data/contact'
import FillButton from '@/components/Common/FillButton'

export default function Cta() {
  return (
    <section className="bg-paper py-16 sm:py-20" aria-labelledby="home-cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-ink-950">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 90% 10%, rgba(140,198,63,0.35), transparent 40%), radial-gradient(circle at 5% 90%, rgba(140,198,63,0.12), transparent 35%)',
            }}
            aria-hidden
          />
          <div className="relative px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <h2
              id="home-cta-heading"
              className="max-w-xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]"
            >
              Ready to request a booking?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-300">
              Search your route, pick an offer, and send details to the BooksRad desk. Free to request — human reply within one business day.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <FillButton
                href="/flights"
                variant="invert"
                className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3 text-sm font-semibold text-ink-950"
              >
                Search flights
              </FillButton>
              <FillButton
                href={contactDetails.phoneHref}
                variant="invert"
                className="inline-flex cursor-pointer items-center justify-center border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:border-white/45"
              >
                Call {contactDetails.phoneDisplay}
              </FillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
