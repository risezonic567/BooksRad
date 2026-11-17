'use client'

import Image from 'next/image'
import Link from 'next/link'
import destinations from '@/data/destinations'

export default function DestinationsTeaser() {
  const items = destinations.slice(0, 6)

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="destinations-teaser-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="destinations-teaser-heading" className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              Destinations worth flying for
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-ink-600">
              Start with a city, then search flights that match your dates and cabin.
            </p>
          </div>
          <Link href="/destinations" className="text-sm font-semibold text-ink-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500">
            All destinations
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((dest) => (
            <li key={dest.slug}>
              <Link
                href={`/destinations/${dest.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
              >
                <Image
                  src={dest.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <span className="block font-display text-xl font-bold text-white">{dest.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-200">{dest.country}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
