import Image from 'next/image'
import Link from 'next/link'
import destinations from '@/data/destinations'

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Destinations</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-950">Where will you fly?</h1>
        <p className="mt-4 text-base leading-7 text-ink-600">
          Browse popular cities, then search flights with your dates and cabin.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest) => (
          <li key={dest.slug}>
            <Link
              href={`/destinations/${dest.slug}`}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-ink-950 group-hover:text-leaf-700">{dest.name}</h2>
              <p className="text-sm text-ink-500">{dest.country}</p>
              <p className="mt-1 text-sm leading-6 text-ink-600">{dest.intro}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
