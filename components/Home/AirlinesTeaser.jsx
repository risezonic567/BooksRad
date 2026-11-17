import Link from 'next/link'
import airlines from '@/data/airlines'

const IATA_BY_SLUG = {
  'american-airlines': 'AA',
  'delta-air-lines': 'DL',
  'united-airlines': 'UA',
  'british-airways': 'BA',
  emirates: 'EK',
  'qatar-airways': 'QR',
  lufthansa: 'LH',
  'singapore-airlines': 'SQ',
  'air-france': 'AF',
}

function logoUrl(slug) {
  const code = IATA_BY_SLUG[slug]
  if (!code) return ''
  return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`
}

function AirlineCardFace({ airline, decorative = false }) {
  const src = logoUrl(airline.slug)
  return (
    <>
      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden border border-line bg-white p-2">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={decorative ? '' : `${airline.name} logo`}
            width={48}
            height={48}
            className="h-11 w-11 object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-xs font-bold text-ink-600" aria-hidden>
            {(airline.name || 'AL').slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <span className="mt-1 block w-full text-sm font-bold leading-snug text-ink-950">
        {airline.name}
      </span>
    </>
  )
}

const cardClass =
  'relative flex w-[9.5rem] shrink-0 flex-col items-center gap-2 border border-line bg-white px-3 py-4 text-center sm:w-[10.5rem]'

export default function AirlinesTeaser() {
  const items = airlines

  return (
    <section className="overflow-hidden border-y border-line bg-paper py-16 sm:py-20" aria-labelledby="airlines-teaser-heading">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="airlines-teaser-heading" className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          Airlines we search often
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink-600">
          Major carriers across US, Europe, Middle East, and Asia hubs.
        </p>
      </div>

      {/* Same pattern as airlinegroupbookings: fixed cards + -50% infinite track */}
      <div className="airline-marquee mt-10" aria-label="Airlines">
        <div className="airline-marquee-mask">
          <div className="airline-marquee-track airline-marquee-left">
            {items.map((airline) => (
              <Link
                key={`link-${airline.slug}`}
                href={`/airlines/${airline.slug}`}
                className={`${cardClass} transition hover:border-leaf-500`}
              >
                <AirlineCardFace airline={airline} />
              </Link>
            ))}
            {items.map((airline) => (
              <div key={`dup-${airline.slug}`} aria-hidden="true" className={cardClass}>
                <AirlineCardFace airline={airline} decorative />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
