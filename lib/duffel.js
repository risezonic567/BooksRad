const CABIN_MAP = {
  economy: 'economy',
  'premium economy': 'premium_economy',
  premium_economy: 'premium_economy',
  business: 'business',
  first: 'first',
  'first class': 'first',
}

const pendingSearches = new Map()

export function mapCabin(cabin) {
  if (!cabin || typeof cabin !== 'string') return 'economy'
  const key = cabin.trim().toLowerCase()
  return CABIN_MAP[key] || 'economy'
}

export function extractIata(value) {
  if (!value || typeof value !== 'string') return ''
  const trimmed = value.trim()
  const paren = trimmed.match(/\(([A-Z]{3})\)\s*$/i)
  if (paren) return paren[1].toUpperCase()
  if (/^[A-Za-z]{3}$/.test(trimmed)) return trimmed.toUpperCase()
  return trimmed.toUpperCase()
}

export function buildPassengers({ adults = 1, children = 0, infants = 0 } = {}) {
  const passengers = []
  const a = Math.max(0, Number(adults) || 0)
  const c = Math.max(0, Number(children) || 0)
  const i = Math.max(0, Number(infants) || 0)

  for (let n = 0; n < a; n += 1) passengers.push({ type: 'adult' })
  for (let n = 0; n < c; n += 1) passengers.push({ type: 'child' })
  for (let n = 0; n < i; n += 1) passengers.push({ type: 'infant_without_seat' })

  if (!passengers.length) passengers.push({ type: 'adult' })
  return passengers
}

function formatDuration(iso) {
  if (!iso || typeof iso !== 'string') return ''
  const match = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/i)
  if (!match) return iso
  const days = Number(match[1] || 0)
  const h = Number(match[2] || 0) + days * 24
  const m = Number(match[3] || 0)
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  if (m) return `${m}m`
  return iso
}

function sliceStops(slice) {
  const segments = Array.isArray(slice?.segments) ? slice.segments : []
  return Math.max(0, segments.length - 1)
}

function segmentFlightCode(seg) {
  const code = seg?.marketing_carrier?.iata_code || seg?.operating_carrier?.iata_code || ''
  const num = seg?.marketing_carrier_flight_number || seg?.operating_carrier_flight_number || ''
  return `${code}${num}`
}

function sliceSummary(slice) {
  const segments = Array.isArray(slice?.segments) ? slice.segments : []
  const first = segments[0]
  const last = segments[segments.length - 1]
  const segmentKey = segments
    .map((seg) => `${segmentFlightCode(seg)}@${seg?.departing_at || ''}>${seg?.arriving_at || ''}`)
    .join('+')
  const layovers = segments.length > 1
    ? segments.slice(0, -1).map((seg) => seg?.destination?.iata_code).filter(Boolean)
    : []
  return {
    origin: first?.origin?.iata_code || slice?.origin?.iata_code || '',
    destination: last?.destination?.iata_code || slice?.destination?.iata_code || '',
    departure: first?.departing_at || '',
    arrival: last?.arriving_at || '',
    duration: formatDuration(slice?.duration),
    stops: sliceStops(slice),
    carrier: first?.marketing_carrier?.name || first?.operating_carrier?.name || '',
    flightNumber: segmentFlightCode(first),
    segmentKey,
    layovers,
  }
}

/**
 * Collapse offers that look identical on the results card.
 * Hidden middle connections can differ (e.g. LX0073 vs LX3201) while the card
 * only shows first flight + dep/arr/stops — those must not spam the list.
 */
function uniqueByItinerary(offers) {
  const best = new Map()
  for (const offer of offers) {
    const route = (offer.slices || [])
      .map(
        (s) =>
          `${s.origin}|${s.destination}|${s.departure}|${s.arrival}|${s.stops}|${s.flightNumber}|${s.duration}`,
      )
      .join('||')
    const cabin = String(offer.cabin || '').toLowerCase()
    const fare = String(offer.fareBrand || '').toLowerCase()
    const key = `${offer.airlineCode || offer.airline}|${cabin}|${fare}|${route}`
    const prev = best.get(key)
    if (!prev || Number(offer.price) < Number(prev.price)) best.set(key, offer)
  }
  return [...best.values()]
}

function extractOfferExtras(offer) {
  const pax = offer?.slices?.[0]?.segments?.[0]?.passengers?.[0] || {}
  const bags = Array.isArray(pax.baggages) ? pax.baggages : []
  const checked = bags.find((b) => b?.type === 'checked')
  const carryOn = bags.find((b) => b?.type === 'carry_on')
  const amenities = pax?.cabin?.amenities || {}
  const conditions = offer?.conditions || {}
  const change = conditions.change_before_departure || {}
  const refund = conditions.refund_before_departure || {}
  const aircraft = offer?.slices?.[0]?.segments?.[0]?.aircraft?.name || ''

  return {
    fareBrand: offer?.slices?.[0]?.fare_brand_name || '',
    checkedBags: Number(checked?.quantity) || 0,
    carryOnBags: Number(carryOn?.quantity) || 0,
    wifi: Boolean(amenities?.wifi?.available),
    wifiCost: amenities?.wifi?.cost || '',
    power: Boolean(amenities?.power?.available),
    seatType: amenities?.seat?.type || '',
    seatPitch: amenities?.seat?.pitch || '',
    refundable: Boolean(refund?.allowed),
    refundPenalty: refund?.penalty_amount || null,
    refundCurrency: refund?.penalty_currency || '',
    changeable: Boolean(change?.allowed),
    changePenalty: change?.penalty_amount || null,
    changeCurrency: change?.penalty_currency || '',
    emissionsKg: offer?.total_emissions_kg || null,
    aircraft,
  }
}

export function simplifyOffer(offer) {
  const slices = Array.isArray(offer?.slices) ? offer.slices.map(sliceSummary) : []
  const firstSlice = slices[0]
  const owner = offer?.owner || {}
  const marketing = offer?.slices?.[0]?.segments?.[0]?.marketing_carrier || {}
  const airline =
    owner.name
    || firstSlice?.carrier
    || marketing.name
    || 'Airline'
  const totalStops = slices.reduce((sum, s) => sum + (s.stops || 0), 0)
  const cabin =
    offer?.slices?.[0]?.segments?.[0]?.passengers?.[0]?.cabin_class_marketing_name
    || offer?.cabin_class
    || ''

  const logoUrl =
    owner.logo_symbol_url
    || owner.logo_lockup_url
    || marketing.logo_symbol_url
    || marketing.logo_lockup_url
    || ''
  const airlineCode = owner.iata_code || marketing.iata_code || ''
  const extras = extractOfferExtras(offer)

  return {
    id: offer.id,
    airline,
    airlineCode,
    logoUrl,
    price: offer.total_amount,
    currency: offer.total_currency,
    slices,
    stops: totalStops,
    duration: firstSlice?.duration || '',
    cabin,
    expiresAt: offer.expires_at || null,
    ...extras,
  }
}

function depHour(offer) {
  const iso = offer?.slices?.[0]?.departure
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.getHours()
}

function matchesTime(hour, slots) {
  if (!slots?.length) return true
  if (hour === null) return false
  return slots.some(
    (t) =>
      (t === 'morning' && hour >= 5 && hour < 12)
      || (t === 'afternoon' && hour >= 12 && hour < 17)
      || (t === 'evening' && hour >= 17 && hour < 21)
      || (t === 'night' && (hour >= 21 || hour < 5)),
  )
}

function matchesStops(stopsCount, selected) {
  if (!selected?.length) return true
  return selected.some(
    (s) =>
      (s === 'non-stop' && stopsCount === 0)
      || (s === '1' && stopsCount === 1)
      || (s === '2+' && stopsCount >= 2),
  )
}

function filterOffers(offers, filters = {}) {
  const airlineArr = Array.isArray(filters.airlines) ? filters.airlines : []
  const stopsArr = Array.isArray(filters.stops) ? filters.stops : []
  const timeArr = Array.isArray(filters.time) ? filters.time : []
  const minPrice = filters.minPrice === '' || filters.minPrice == null ? null : Number(filters.minPrice)
  const maxPrice = filters.maxPrice === '' || filters.maxPrice == null ? null : Number(filters.maxPrice)
  const sort = filters.sort || ''

  let list = offers.filter((offer) => {
    const stopsCount = Number(offer.slices?.[0]?.stops ?? offer.stops ?? 0)
    const price = Number(offer.price)
    const hour = depHour(offer)

    if (!matchesStops(stopsCount, stopsArr)) return false
    if (airlineArr.length && !airlineArr.includes(offer.airline)) return false
    if (timeArr.length && !matchesTime(hour, timeArr)) return false
    if (minPrice !== null && Number.isFinite(minPrice) && price < minPrice) return false
    if (maxPrice !== null && Number.isFinite(maxPrice) && price > maxPrice) return false
    return true
  })

  if (sort === 'cheap') {
    list = [...list].sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sort === 'expensive') {
    list = [...list].sort((a, b) => Number(b.price) - Number(a.price))
  }

  return list
}

async function fetchDuffelOffers(params) {
  const {
    from,
    to,
    departDate,
    returnDate,
    tripType = 'oneway',
    cabin = 'economy',
    adults = 1,
    children = 0,
    infants = 0,
    token,
  } = params

  if (!token) throw new Error('Flight search token not configured')

  const origin = extractIata(from)
  const destination = extractIata(to)
  if (!origin || !destination) throw new Error('Origin and destination are required')
  if (!departDate) throw new Error('Departure date is required')

  const slices = [
    {
      origin,
      destination,
      departure_date: departDate,
    },
  ]

  const isRound = tripType === 'roundtrip' || tripType === 'round' || tripType === 'Round Trip'
  if (isRound) {
    if (!returnDate) throw new Error('Return date is required for round trip')
    slices.push({
      origin: destination,
      destination: origin,
      departure_date: returnDate,
    })
  }

  const cacheKey = [
    origin,
    destination,
    departDate,
    isRound ? returnDate : 'oneway',
    mapCabin(cabin),
    adults || 1,
    children || 0,
    infants || 0,
  ].join('|')

  if (pendingSearches.has(cacheKey)) {
    return pendingSearches.get(cacheKey)
  }

  const promise = (async () => {
    // ATB-style: plain offer_requests (no long supplier_timeout dump)
    const res = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Duffel-Version': 'v2',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          slices,
          passengers: buildPassengers({ adults, children, infants }),
          cabin_class: mapCabin(cabin),
        },
      }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      const error = new Error(`Duffel API returned ${res.status}`)
      error.status = res.status
      error.details = errText
      throw error
    }

    const json = await res.json()
    const offers = Array.isArray(json?.data?.offers) ? json.data.offers : []
    return uniqueByItinerary(offers.map(simplifyOffer))
  })()

  pendingSearches.set(cacheKey, promise)
  try {
    return await promise
  } finally {
    pendingSearches.delete(cacheKey)
  }
}

/** ATB-style: filter all offers, return one page (default 20). */
export async function searchOffersPage({
  from,
  to,
  departDate,
  returnDate,
  tripType = 'oneway',
  cabin = 'economy',
  adults = 1,
  children = 0,
  infants = 0,
  page = 1,
  limit = 20,
  filters = {},
  token,
}) {
  const allOffers = await fetchDuffelOffers({
    from,
    to,
    departDate,
    returnDate,
    tripType,
    cabin,
    adults,
    children,
    infants,
    token,
  })

  const pageNum = Math.max(1, Number(page) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 20))
  const filtered = filterOffers(allOffers, filters)
  const total = allOffers.length
  const totalOffers = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalOffers / pageSize))
  const currentPage = Math.min(pageNum, totalPages)
  const start = (currentPage - 1) * pageSize
  const offers = filtered.slice(start, start + pageSize)

  const airlines = [...new Set(allOffers.map((o) => o.airline).filter(Boolean))].sort()

  return {
    offers,
    pagination: {
      currentPage,
      limit: pageSize,
      total,
      totalOffers,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
    filtersData: {
      airlines,
    },
  }
}

export async function searchOffers(params) {
  const result = await searchOffersPage({ ...params, page: 1, limit: 20, filters: {} })
  return result.offers
}
