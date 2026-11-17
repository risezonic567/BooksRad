'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import OfferCard from '@/components/Flights/OfferCard'
import FlightSearchForm from '@/components/Flights/FlightSearchForm'
import { BOOKING_STORAGE_KEY } from '@/lib/quoteStorage'

const STOP_OPTIONS = [
  { label: 'Non-stop', value: 'non-stop' },
  { label: '1 stop', value: '1' },
  { label: '2+', value: '2+' },
]

const TIME_SLOTS = [
  { label: 'Morning (5–12)', value: 'morning' },
  { label: 'Afternoon (12–17)', value: 'afternoon' },
  { label: 'Evening (17–21)', value: 'evening' },
  { label: 'Night (21–5)', value: 'night' },
]

const defaultFilters = {
  airlines: [],
  stops: [],
  time: [],
  sort: '',
  minPrice: '',
  maxPrice: '',
}

const PAGE_SIZE = 20

function toggleInList(list, value, checked) {
  if (checked) return [...list, value]
  return list.filter((x) => x !== value)
}

export default function ResultsClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-ink-600 sm:px-6">
          Loading results…
        </div>
      }
    >
      <ResultsInner />
    </Suspense>
  )
}

function ResultsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [airlineOptions, setAirlineOptions] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [editSearch, setEditSearch] = useState(false)

  const query = useMemo(
    () => ({
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      departDate: searchParams.get('departDate') || '',
      returnDate: searchParams.get('returnDate') || '',
      tripType: searchParams.get('tripType') || 'oneway',
      cabin: searchParams.get('cabin') || 'Economy',
      adults: Number(searchParams.get('adults') || 1),
      children: Number(searchParams.get('children') || 0),
      infants: Number(searchParams.get('infants') || 0),
    }),
    [searchParams],
  )

  // New search params → reset filters + page
  useEffect(() => {
    setFilters(defaultFilters)
    setPage(1)
  }, [query])

  useEffect(() => {
    if (!query.from || !query.to || !query.departDate) {
      setLoading(false)
      setError('Add origin, destination, and departure date to search.')
      setOffers([])
      setPagination(null)
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const res = await fetch('/api/flights/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...query,
            page,
            limit: PAGE_SIZE,
            filters,
          }),
          signal: controller.signal,
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data?.error || `Search failed (${res.status})`)
        }
        setOffers(Array.isArray(data?.offers) ? data.offers : [])
        setPagination(data?.pagination || null)
        if (Array.isArray(data?.filtersData?.airlines)) {
          setAirlineOptions(data.filtersData.airlines)
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'Unable to load flight offers.')
        setOffers([])
        setPagination(null)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [query, page, filters])

  function updateFilters(next) {
    setFilters(next)
    setPage(1)
  }

  function clearFilters() {
    updateFilters(defaultFilters)
  }

  function selectOffer(offer) {
    try {
      sessionStorage.setItem(
        BOOKING_STORAGE_KEY,
        JSON.stringify({
          offer,
          search: query,
          savedAt: new Date().toISOString(),
        }),
      )
    } catch {
      // ignore
    }
    router.push('/booking')
  }

  const totalOffers = pagination?.totalOffers ?? 0
  const totalRaw = pagination?.total ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.currentPage ?? page

  const filterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-ink-950">Filters</h2>
        <button
          type="button"
          className="cursor-pointer text-sm font-semibold text-leaf-700 underline-offset-2 hover:underline"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Sort</p>
        <select
          className="search-field h-11 w-full border border-line bg-white px-3 text-sm outline-none focus:border-leaf-500"
          value={filters.sort}
          onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Recommended</option>
          <option value="cheap">Cheapest</option>
          <option value="expensive">Most expensive</option>
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Stops</p>
        <div className="space-y-2">
          {STOP_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink-800">
              <input
                type="checkbox"
                className="accent-leaf-600"
                checked={filters.stops.includes(opt.value)}
                onChange={(e) =>
                  updateFilters({
                    ...filters,
                    stops: toggleInList(filters.stops, opt.value, e.target.checked),
                  })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Departure time</p>
        <div className="space-y-2">
          {TIME_SLOTS.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink-800">
              <input
                type="checkbox"
                className="accent-leaf-600"
                checked={filters.time.includes(opt.value)}
                onChange={(e) =>
                  updateFilters({
                    ...filters,
                    time: toggleInList(filters.time, opt.value, e.target.checked),
                  })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Price</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ ...filters, minPrice: e.target.value })}
            className="search-field h-11 w-full border border-line bg-white px-3 text-sm outline-none focus:border-leaf-500"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ ...filters, maxPrice: e.target.value })}
            className="search-field h-11 w-full border border-line bg-white px-3 text-sm outline-none focus:border-leaf-500"
          />
        </div>
      </div>

      {airlineOptions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Airlines</p>
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {airlineOptions.map((airline) => (
              <label key={airline} className="flex cursor-pointer items-center gap-2 text-sm text-ink-800">
                <input
                  type="checkbox"
                  className="accent-leaf-600"
                  checked={filters.airlines.includes(airline)}
                  onChange={(e) =>
                    updateFilters({
                      ...filters,
                      airlines: toggleInList(filters.airlines, airline, e.target.checked),
                    })
                  }
                />
                <span className="truncate">{airline}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined' && window.history.length > 1) router.back()
          else router.push('/flights')
        }}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-950"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back
      </button>

      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Flight results</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          {query.from && query.to ? `${query.from} → ${query.to}` : 'Your search'}
        </h1>
        <p className="mt-2 text-sm text-ink-600 sm:text-base">
          {query.departDate}
          {query.returnDate ? ` · return ${query.returnDate}` : ''}
          {` · ${query.cabin}`}
          {` · ${query.adults + query.children + query.infants} traveller${query.adults + query.children + query.infants === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEditSearch((v) => !v)}
          className="inline-flex cursor-pointer items-center border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-900 hover:border-ink-300"
        >
          {editSearch ? 'Hide search' : 'Modify search'}
        </button>
      </div>

      {editSearch ? (
        <div className="mt-4">
          <FlightSearchForm variant="page" prefillFromUrl={false} />
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3 lg:hidden">
        <p className="text-sm font-semibold text-ink-700">
          {!loading && !error && pagination
            ? `${totalOffers} offer${totalOffers === 1 ? '' : 's'}`
            : ' '}
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-900"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24 border border-line bg-white p-5">{filterPanel}</div>
        </aside>

        <div className="lg:col-span-9">
          {loading && (
            <div className="flex items-center gap-3 py-12 text-sm text-ink-600">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent" />
              Searching flights…
            </div>
          )}

          {!loading && error && (
            <p className="py-8 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && totalRaw === 0 && (
            <p className="py-8 text-sm text-ink-600">No offers found for this search. Try different dates or airports.</p>
          )}

          {!loading && !error && totalRaw > 0 && totalOffers === 0 && (
            <p className="py-8 text-sm text-ink-600">No offers match these filters. Clear filters to see all results.</p>
          )}

          {!loading && !error && offers.length > 0 && (
            <div>
              <p className="mb-3 hidden text-sm font-semibold text-ink-700 lg:block">
                Showing {offers.length} of {totalOffers} offer{totalOffers === 1 ? '' : 's'}
                {totalOffers !== totalRaw ? ` (filtered from ${totalRaw})` : ''}
                {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ''}
              </p>
              <div className="flex flex-col gap-3">
                {offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} onSelect={selectOffer} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-line bg-white px-4 py-3">
                  <button
                    type="button"
                    disabled={!pagination?.hasPrevPage || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex cursor-pointer items-center gap-1 border border-line px-3 py-2 text-sm font-semibold text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Prev
                  </button>
                  <p className="text-sm font-medium text-ink-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <button
                    type="button"
                    disabled={!pagination?.hasNextPage || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex cursor-pointer items-center gap-1 border border-line px-3 py-2 text-sm font-semibold text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-ink-950/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-paper shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-lg font-bold text-ink-950">Filters</p>
              <button
                type="button"
                className="cursor-pointer p-2 text-ink-700"
                aria-label="Close"
                onClick={() => setFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                className="w-full cursor-pointer bg-leaf-500 px-4 py-3 text-sm font-semibold text-ink-950"
                onClick={() => setFiltersOpen(false)}
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
