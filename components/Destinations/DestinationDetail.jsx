import Image from 'next/image'
import Link from 'next/link'
import FillButton from '@/components/Common/FillButton'

export default function DestinationDetail({ destination }) {
  return (
    <div>
      <div className="relative h-[42vh] min-h-[240px] w-full overflow-hidden sm:h-[48vh]">
        <Image
          src={destination.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-400">{destination.country}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">{destination.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-lg leading-8 text-ink-700">{destination.intro}</p>
        <p className="mt-4 text-base leading-7 text-ink-600">
          Ready to fly? Search flights into {destination.name} with your preferred dates, travelers, and cabin — then select an offer and request a booking.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <FillButton
            href="/flights"
            className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3 text-sm font-semibold text-ink-950"
          >
            Search flights
          </FillButton>
          <Link
            href="/destinations"
            className="inline-flex items-center justify-center border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
          >
            All destinations
          </Link>
        </div>
      </div>
    </div>
  )
}
