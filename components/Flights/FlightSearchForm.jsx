'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftRight, ChevronDown, Minus, Plus, Users } from 'lucide-react'
import AirportInput from '@/components/Flights/AirportInput'
import FlightDatePicker from '@/components/Flights/FlightDatePicker'
import MobileChoiceModal from '@/components/Flights/MobileChoiceModal'
import FillButton from '@/components/Common/FillButton'

const CABINS = ['Economy', 'Premium Economy', 'Business', 'First']

const TRIP_OPTIONS = [
  { id: 'roundtrip', label: 'Round trip' },
  { id: 'oneway', label: 'One way' },
]

const PAX_ROWS = [
  { key: 'adults', label: 'Adults', min: 1 },
  { key: 'children', label: 'Children', min: 0 },
  { key: 'infants', label: 'Infants', min: 0 },
]

function todayLocalISO() {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
}

function useMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return { open, setOpen, ref }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return isMobile
}

export default function FlightSearchForm(props) {
  return (
    <Suspense fallback={null}>
      <FlightSearchFormInner {...props} />
    </Suspense>
  )
}

function FlightSearchFormInner({ variant = 'page', prefillFromUrl = true }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const [tripType, setTripType] = useState('roundtrip')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [pax, setPax] = useState({ adults: 1, children: 0, infants: 0 })
  const [draftPax, setDraftPax] = useState({ adults: 1, children: 0, infants: 0 })
  const [paxOpen, setPaxOpen] = useState(false)
  const [mobileSheet, setMobileSheet] = useState(null) // 'trip' | 'cabin' | 'pax' | null
  const paxWrapRef = useRef(null)
  const [cabin, setCabin] = useState('Economy')
  const [error, setError] = useState(null)

  const tripMenu = useMenu()
  const cabinMenu = useMenu()
  const minDate = todayLocalISO()
  const isHero = variant === 'hero'

  useEffect(() => {
    if (!prefillFromUrl) return

    const qFrom = searchParams.get('from')
    const qTo = searchParams.get('to')
    const qDepart = searchParams.get('departDate')
    const qReturn = searchParams.get('returnDate')
    const qTrip = searchParams.get('tripType')
    const qCabin = searchParams.get('cabin')
    const adults = Number(searchParams.get('adults'))
    const children = Number(searchParams.get('children'))
    const infants = Number(searchParams.get('infants'))

    if (qFrom) setFrom(qFrom)
    if (qTo) setTo(qTo)
    if (qDepart) setDepartDate(qDepart)
    if (qReturn) setReturnDate(qReturn)
    if (qTrip === 'oneway' || qTrip === 'roundtrip') setTripType(qTrip)
    if (qCabin) {
      const match = CABINS.find((c) => c.toLowerCase() === qCabin.toLowerCase())
      if (match) setCabin(match)
    }
    if (adults > 0 || children >= 0 || infants >= 0) {
      const next = {
        adults: adults > 0 ? adults : 1,
        children: children >= 0 ? children : 0,
        infants: infants >= 0 ? infants : 0,
      }
      setPax(next)
      setDraftPax(next)
    }
  }, [searchParams, prefillFromUrl])

  function total(next) {
    return (Number(next.adults) || 0) + (Number(next.children) || 0) + (Number(next.infants) || 0)
  }

  const travelerCount =
    paxOpen || mobileSheet === 'pax' ? total(draftPax) : total(pax)

  function bump(key, delta, min = 0) {
    setDraftPax((prev) => {
      const next = { ...prev, [key]: Math.max(min, (prev[key] || 0) + delta) }
      if (total(next) > 9) return prev
      if (key === 'adults' && next.infants > next.adults) {
        next.infants = next.adults
      }
      return next
    })
  }

  useEffect(() => {
    if (!paxOpen || isMobile) return undefined
    function onDoc(e) {
      if (paxWrapRef.current && !paxWrapRef.current.contains(e.target)) {
        setPax(draftPax)
        setPaxOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [paxOpen, draftPax, isMobile])

  function closeMobileSheet() {
    setMobileSheet(null)
  }

  function finishPax() {
    setPax(draftPax)
    setPaxOpen(false)
    setMobileSheet(null)
  }

  function openTrip() {
    if (isMobile) {
      cabinMenu.setOpen(false)
      setPaxOpen(false)
      setMobileSheet('trip')
      return
    }
    setMobileSheet(null)
    tripMenu.setOpen((v) => !v)
  }

  function openCabin() {
    if (isMobile) {
      tripMenu.setOpen(false)
      setPaxOpen(false)
      setMobileSheet('cabin')
      return
    }
    setMobileSheet(null)
    cabinMenu.setOpen((v) => !v)
  }

  function openPax() {
    setDraftPax(pax)
    if (isMobile) {
      tripMenu.setOpen(false)
      cabinMenu.setOpen(false)
      setPaxOpen(false)
      setMobileSheet('pax')
      return
    }
    setMobileSheet(null)
    setPaxOpen((v) => !v)
  }

  function selectTrip(id) {
    setTripType(id)
    if (id === 'oneway') setReturnDate('')
    tripMenu.setOpen(false)
    setMobileSheet(null)
  }

  function selectCabin(opt) {
    setCabin(opt)
    cabinMenu.setOpen(false)
    setMobileSheet(null)
  }

  function swapAirports() {
    setFrom(to)
    setTo(from)
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!from.trim() || !to.trim() || !departDate) {
      setError('Please complete from, to, and departure date.')
      return
    }
    if (tripType === 'roundtrip' && !returnDate) {
      setError('Select a return date for round trip.')
      return
    }
    if ((pax.adults || 0) < 1) {
      setError('At least 1 adult is required.')
      return
    }
    setError(null)

    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      departDate,
      tripType,
      cabin,
      adults: String(pax.adults || 1),
      children: String(pax.children || 0),
      infants: String(pax.infants || 0),
    })
    if (tripType === 'roundtrip' && returnDate) params.set('returnDate', returnDate)
    router.push(`/flight-results?${params.toString()}`)
  }

  const shell = isHero
    ? 'border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-5'
    : 'border border-line bg-white p-4 sm:p-6'

  const labelClass = isHero
    ? 'text-xs font-semibold uppercase tracking-[0.14em] text-leaf-400'
    : 'text-xs font-semibold uppercase tracking-[0.14em] text-ink-500'
  const chipClass = isHero
    ? 'inline-flex cursor-pointer items-center gap-1 border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:border-leaf-400 sm:gap-1.5 sm:px-3 sm:text-sm'
    : 'inline-flex cursor-pointer items-center gap-1 border border-line bg-ink-50 px-2.5 py-1.5 text-xs font-semibold text-ink-800 transition hover:border-ink-300 sm:gap-1.5 sm:px-3 sm:text-sm'

  const optionBtn =
    'block w-full cursor-pointer px-3 py-3 text-left text-sm font-medium text-ink-800 hover:bg-ink-50'

  return (
    <form onSubmit={onSubmit} className={shell} noValidate>
      <div className="relative z-20 grid grid-cols-3 gap-2 md:flex md:flex-wrap md:items-center">
        <div className="relative min-w-0 md:min-w-fit" ref={tripMenu.ref}>
          <button
            type="button"
            className={`${chipClass} w-full justify-between md:w-auto`}
            onClick={openTrip}
            aria-expanded={tripMenu.open || mobileSheet === 'trip'}
          >
            <span className="truncate">{tripType === 'roundtrip' ? 'Round trip' : 'One way'}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition ${tripMenu.open || mobileSheet === 'trip' ? 'rotate-180' : ''}`}
            />
          </button>
          {!isMobile && tripMenu.open ? (
            <div className="absolute left-0 top-full z-40 mt-1 min-w-[140px] border border-line bg-white py-1 shadow-lg">
              {TRIP_OPTIONS.map((opt) => (
                <button key={opt.id} type="button" className={optionBtn} onClick={() => selectTrip(opt.id)}>
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative min-w-0 md:min-w-fit" ref={cabinMenu.ref}>
          <button
            type="button"
            className={`${chipClass} w-full justify-between md:w-auto`}
            onClick={openCabin}
            aria-expanded={cabinMenu.open || mobileSheet === 'cabin'}
          >
            <span className="truncate">{cabin}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition ${cabinMenu.open || mobileSheet === 'cabin' ? 'rotate-180' : ''}`}
            />
          </button>
          {!isMobile && cabinMenu.open ? (
            <div className="absolute left-0 top-full z-40 mt-1 min-w-[180px] border border-line bg-white py-1 shadow-lg">
              {CABINS.map((opt) => (
                <button key={opt} type="button" className={optionBtn} onClick={() => selectCabin(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative min-w-0 md:min-w-fit" ref={paxWrapRef}>
          <button
            type="button"
            className={`${chipClass} w-full justify-between md:w-auto`}
            onClick={openPax}
            aria-expanded={paxOpen || mobileSheet === 'pax'}
          >
            <span className="flex min-w-0 items-center gap-1 truncate">
              <Users className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                {travelerCount}
                <span className="hidden md:inline"> traveler{travelerCount === 1 ? '' : 's'}</span>
              </span>
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition ${paxOpen || mobileSheet === 'pax' ? 'rotate-180' : ''}`}
            />
          </button>
          {!isMobile && paxOpen ? (
            <div className="absolute left-0 top-full z-40 mt-1 w-[min(280px,calc(100vw-2rem))] border border-line bg-white p-3 shadow-lg">
              {PAX_ROWS.map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-sm font-medium text-ink-800">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-line text-ink-700 hover:border-ink-400"
                      onClick={() => bump(row.key, -1, row.min)}
                      aria-label={`Decrease ${row.label}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">{draftPax[row.key]}</span>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-line text-ink-700 hover:border-ink-400"
                      onClick={() => bump(row.key, 1, row.min)}
                      aria-label={`Increase ${row.label}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 w-full cursor-pointer bg-ink-950 py-2 text-sm font-semibold text-white"
                onClick={finishPax}
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <MobileChoiceModal open={mobileSheet === 'trip'} title="Trip type" onClose={closeMobileSheet}>
        {TRIP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`${optionBtn} ${tripType === opt.id ? 'bg-leaf-500/10 font-semibold text-leaf-700' : ''}`}
            onClick={() => selectTrip(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </MobileChoiceModal>

      <MobileChoiceModal open={mobileSheet === 'cabin'} title="Cabin" onClose={closeMobileSheet}>
        {CABINS.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`${optionBtn} ${cabin === opt ? 'bg-leaf-500/10 font-semibold text-leaf-700' : ''}`}
            onClick={() => selectCabin(opt)}
          >
            {opt}
          </button>
        ))}
      </MobileChoiceModal>

      <MobileChoiceModal
        open={mobileSheet === 'pax'}
        title="Travelers"
        onClose={() => {
          setPax(draftPax)
          closeMobileSheet()
        }}
        footer={
          <button
            type="button"
            className="w-full cursor-pointer bg-leaf-500 py-2.5 text-sm font-semibold text-ink-950"
            onClick={finishPax}
          >
            Done
          </button>
        }
      >
        <div className="space-y-1 px-2 py-1">
          {PAX_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-sm font-medium text-ink-800">{row.label}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-line text-ink-700 hover:border-ink-400"
                  onClick={() => bump(row.key, -1, row.min)}
                  aria-label={`Decrease ${row.label}`}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">{draftPax[row.key]}</span>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-line text-ink-700 hover:border-ink-400"
                  onClick={() => bump(row.key, 1, row.min)}
                  aria-label={`Increase ${row.label}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </MobileChoiceModal>

      {(() => {
        const airportFieldClass = isHero
          ? 'search-field h-[52px] w-full border border-white/15 bg-white pl-10 pr-3 text-sm font-medium text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/30'
          : undefined
        const swapBtnClass = `inline-flex h-10 w-10 cursor-pointer items-center justify-center border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500 md:h-11 md:w-11 ${
          isHero ? 'border-white/20 text-white hover:border-leaf-400' : 'border-line text-ink-700 hover:border-ink-400'
        }`

        return (
          <>
            {/* Mobile — equal space around centered swap */}
            <div className="relative mt-4 md:hidden">
              <div className="pb-5">
                <label className={labelClass} htmlFor="from-airport-mobile">
                  From
                </label>
                <div className="mt-1.5">
                  <AirportInput
                    id="from-airport-mobile"
                    name="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="City or airport"
                    required
                    className={airportFieldClass}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center">
                <button
                  type="button"
                  onClick={swapAirports}
                  className={`pointer-events-auto ${swapBtnClass} border-white/25 bg-ink-950 text-white shadow-sm`}
                  aria-label="Swap airports"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </div>
              <div className="pt-5">
                <label className={labelClass} htmlFor="to-airport-mobile">
                  To
                </label>
                <div className="mt-1.5">
                  <AirportInput
                    id="to-airport-mobile"
                    name="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="City or airport"
                    required
                    className={airportFieldClass}
                  />
                </div>
              </div>
            </div>

            {/* Desktop — original side-by-side layout */}
            <div className="mt-4 hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-end md:gap-3">
              <div>
                <label className={labelClass} htmlFor="from-airport">
                  From
                </label>
                <div className="mt-1.5">
                  <AirportInput
                    id="from-airport"
                    name="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="City or airport"
                    required
                    className={airportFieldClass}
                  />
                </div>
              </div>
              <div className="flex justify-center pb-1">
                <button type="button" onClick={swapAirports} className={swapBtnClass} aria-label="Swap airports">
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className={labelClass} htmlFor="to-airport">
                  To
                </label>
                <div className="mt-1.5">
                  <AirportInput
                    id="to-airport"
                    name="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="City or airport"
                    required
                    className={airportFieldClass}
                  />
                </div>
              </div>
            </div>
          </>
        )
      })()}

      <div className="mt-3">
        <FlightDatePicker
          variant={variant}
          tripType={tripType}
          departureDate={departDate}
          returnDate={returnDate}
          minDate={minDate}
          onChange={({ departureDate: nextDep, returnDate: nextRet }) => {
            setDepartDate(nextDep || '')
            setReturnDate(nextRet || '')
          }}
        />
      </div>

      {error && (
        <p className={`mt-3 text-sm ${isHero ? 'text-leaf-400' : 'text-red-700'}`} role="alert">
          {error}
        </p>
      )}

      <div className="mt-4">
        <FillButton
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3.5 text-sm font-semibold text-ink-950 sm:w-auto"
        >
          Search flights
        </FillButton>
      </div>
    </form>
  )
}
