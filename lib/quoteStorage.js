export const BOOKING_STORAGE_KEY = 'booksradBooking'
export const QUOTE_STORAGE_KEY = BOOKING_STORAGE_KEY
/** One-time confirmation gate — separate from booking draft. */
export const CONFIRMATION_STORAGE_KEY = 'booksradConfirmation'
export const CONFIRMATION_TTL_MS = 15 * 60 * 1000

/** Rebuild /flight-results?… from a saved search so Change flight keeps context. */
export function buildFlightResultsHref(search) {
  if (!search?.from || !search?.to || !search?.departDate) return '/flight-results'
  const params = new URLSearchParams({
    from: String(search.from).trim(),
    to: String(search.to).trim(),
    departDate: String(search.departDate),
    tripType: String(search.tripType || 'oneway'),
    cabin: String(search.cabin || 'Economy'),
    adults: String(search.adults || 1),
    children: String(search.children || 0),
    infants: String(search.infants || 0),
  })
  if ((search.tripType === 'roundtrip' || search.tripType === 'round') && search.returnDate) {
    params.set('returnDate', String(search.returnDate))
  }
  return `/flight-results?${params.toString()}`
}

export function saveConfirmationGate({ requestId, route }) {
  if (typeof sessionStorage === 'undefined' || !requestId) return
  sessionStorage.setItem(
    CONFIRMATION_STORAGE_KEY,
    JSON.stringify({
      requestId: String(requestId),
      route: route ? String(route) : '',
      at: Date.now(),
    }),
  )
}

/** Returns gate payload if ref matches and not expired; otherwise null (and clears stale). */
export function readConfirmationGate(ref) {
  if (typeof sessionStorage === 'undefined' || !ref) return null
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    const age = Date.now() - Number(data?.at || 0)
    if (!data?.requestId || data.requestId !== String(ref) || age < 0 || age > CONFIRMATION_TTL_MS) {
      sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY)
      return null
    }
    return data
  } catch {
    try {
      sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY)
    } catch {
      // ignore
    }
    return null
  }
}

export function clearConfirmationGate() {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY)
  } catch {
    // ignore
  }
}
