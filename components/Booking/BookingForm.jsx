'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FillButton from '@/components/Common/FillButton'
import AirlineMark from '@/components/Flights/AirlineMark'
import { BOOKING_STORAGE_KEY, buildFlightResultsHref, saveConfirmationGate } from '@/lib/quoteStorage'
import { isDisposableEmail, sanitizePhoneInput, validateEmail } from '@/lib/validationRules'

function formatMoney(amount, currency) {
  const num = Number(amount)
  if (!Number.isFinite(num)) return `${currency || ''} ${amount || ''}`.trim()
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(num)
  } catch {
    return `${currency || ''} ${num}`.trim()
  }
}

function emptyPassenger(type = 'adult', id = '') {
  return {
    id,
    type,
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    nationality: 'US',
    passportNumber: '',
    passportExpiry: '',
    passportCountry: 'US',
  }
}

function buildPassengerRows(search) {
  const adults = Math.max(1, Number(search?.adults) || 1)
  const children = Math.max(0, Number(search?.children) || 0)
  const infants = Math.max(0, Number(search?.infants) || 0)
  const rows = []
  for (let i = 0; i < adults; i += 1) rows.push(emptyPassenger('adult', `adult-${i}`))
  for (let i = 0; i < children; i += 1) rows.push(emptyPassenger('child', `child-${i}`))
  for (let i = 0; i < infants; i += 1) rows.push(emptyPassenger('infant', `infant-${i}`))
  return rows
}

const fieldClass =
  'search-field h-12 w-full border border-line bg-white px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/25'

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500'

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function BookingForm() {
  const router = useRouter()
  const [stored, setStored] = useState(null)
  const [ready, setReady] = useState(false)
  const [formData, setFormData] = useState([])
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : null
      setStored(parsed)
      if (parsed?.search) setFormData(buildPassengerRows(parsed.search))
      else setFormData([emptyPassenger('adult', 'adult-0')])
    } catch {
      setStored(null)
      setFormData([emptyPassenger('adult', 'adult-0')])
    } finally {
      setReady(true)
    }
  }, [])

  const resultsHref = useMemo(() => buildFlightResultsHref(stored?.search), [stored])

  const summary = useMemo(() => {
    if (!stored?.offer) return null
    const offer = stored.offer
    const search = stored.search || {}
    const out = offer.slices?.[0]
    const ret = offer.slices?.[1]
    const route = out
      ? `${out.origin || search.from || ''} → ${out.destination || search.to || ''}`
      : `${search.from || ''} → ${search.to || ''}`
    return {
      airline: offer.airline,
      route,
      returnRoute: ret ? `${ret.origin} → ${ret.destination}` : '',
      departDate: search.departDate || out?.departure?.slice?.(0, 10) || '',
      returnDate: search.returnDate || ret?.departure?.slice?.(0, 10) || '',
      cabin: search.cabin || offer.cabin || 'Economy',
      price: offer.price,
      currency: offer.currency,
    }
  }, [stored])

  function handleChange(index, field, value) {
    setFormData((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: field === 'phone' ? sanitizePhoneInput(value) : value,
      }
      return next
    })
  }

  function validate() {
    for (const p of formData) {
      if (!p.firstName?.trim() || !p.lastName?.trim()) {
        return 'Please enter first and last name for every traveller.'
      }
      if (!p.gender) return 'Please select gender for every traveller.'
      if (!p.dob) return 'Please enter date of birth for every traveller.'
      if (!p.phone?.trim() || p.phone.trim().length < 7) {
        return 'Please enter a valid phone number for every traveller.'
      }
      if (!validateEmail(p.email) || isDisposableEmail(p.email)) {
        return 'Please enter a valid email for every traveller.'
      }
    }
    return ''
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (loading || !stored?.offer || !summary) return

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setLoading(true)

    const offer = stored.offer
    const search = stored.search || {}
    const tripTypeLabel = search.tripType === 'roundtrip' ? 'Round Trip' : 'One Way'
    const primary = formData[0]
    const contactName = `${primary.firstName} ${primary.lastName}`.trim()

    const travellers = formData.map((p) => ({
      type: p.type,
      firstName: p.firstName.trim(),
      middleName: p.middleName.trim(),
      lastName: p.lastName.trim(),
      gender: p.gender,
      dob: p.dob,
      phone: p.phone.trim(),
      email: p.email.trim().toLowerCase(),
      nationality: p.nationality.trim(),
      passportNumber: p.passportNumber.trim(),
      passportExpiry: p.passportExpiry,
      passportCountry: p.passportCountry.trim(),
    }))

    const payload = {
      tripType: tripTypeLabel,
      origin: search.from || offer.slices?.[0]?.origin || '',
      destination: search.to || offer.slices?.[0]?.destination || '',
      departure: search.departDate || '',
      returnDate: search.returnDate || '',
      passengers: String(formData.length),
      cabin: search.cabin || offer.cabin || 'Economy',
      email: primary.email.trim().toLowerCase(),
      countryCode: '+1',
      phone: primary.phone.trim(),
      website,
      contactName,
      offerSummary: `${offer.airline} · ${formatMoney(offer.price, offer.currency)} · ${offer.stops === 0 ? 'Nonstop' : `${offer.stops} stops`}`,
      totalPrice: String(offer.price || ''),
      currency: offer.currency || '',
      passengerNames: travellers
        .map((t) => `${t.firstName} ${t.lastName} (${t.type})`.trim())
        .join('\n'),
      travellers,
      notes: '',
    }

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success || !data.requestId) {
        throw new Error(data.error || 'Unable to submit booking request.')
      }
      const routeLabel = [payload.origin, payload.destination].filter(Boolean).join(' → ')
      try {
        sessionStorage.setItem(
          BOOKING_STORAGE_KEY,
          JSON.stringify({
            ...stored,
            submitted: true,
            travellers,
            contact: { name: contactName, email: primary.email, phone: primary.phone },
          }),
        )
        saveConfirmationGate({ requestId: data.requestId, route: routeLabel })
      } catch {
        // ignore
      }
      router.push(`/booking-confirmation?ref=${encodeURIComponent(data.requestId)}`)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-ink-600 sm:px-6">Loading…</div>
  }

  if (!stored?.offer || !summary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ink-950">No offer selected</h1>
        <p className="mt-3 text-ink-600">Search flights and select an offer to continue.</p>
        <Link href="/flights" className="mt-6 inline-flex text-sm font-semibold text-leaf-700 underline-offset-4 hover:underline">
          Go to flight search
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="text-sm text-ink-500">
        <Link href="/" className="hover:text-leaf-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={resultsHref} className="hover:text-leaf-700">
          Results
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-800">Passengers</span>
      </nav>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Traveller details</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
        Passenger information
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600">
        Enter details for each traveller on this fare. We use this to prepare your booking request.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="border border-line bg-white p-5 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Selected fare</p>
            <div className="mt-3 flex items-center gap-3">
              <AirlineMark
                name={summary.airline}
                logoUrl={stored?.offer?.logoUrl}
                code={stored?.offer?.airlineCode}
                size="lg"
              />
              <p className="font-display text-xl font-bold text-ink-950">{summary.airline}</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-leaf-700">{summary.route}</p>
            {summary.returnRoute ? <p className="mt-1 text-sm font-semibold text-leaf-700">{summary.returnRoute}</p> : null}
            <p className="mt-3 text-sm text-ink-600">
              Depart {summary.departDate}
              {summary.returnDate ? ` · Return ${summary.returnDate}` : ''}
            </p>
            <p className="mt-1 text-sm text-ink-600">{summary.cabin}</p>
            <p className="mt-4 font-display text-2xl font-bold text-ink-950">
              {formatMoney(summary.price, summary.currency)}
            </p>
            <Link
              href={resultsHref}
              className="mt-4 inline-flex text-sm font-semibold text-leaf-700 underline-offset-4 hover:underline"
            >
              Change flight
            </Link>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <form onSubmit={onSubmit} className="border border-line bg-white p-5 sm:p-8" noValidate>
            <div className="space-y-8">
              {formData.map((p, index) => (
                <div key={p.id || index} className="space-y-3 border-b border-line pb-8 last:border-b-0 last:pb-0">
                  <h2 className="font-display text-lg font-bold capitalize text-ink-950">
                    Traveller {index + 1} ({p.type})
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field id={`${p.id}-first`} label="First name">
                      <input
                        id={`${p.id}-first`}
                        className={fieldClass}
                        placeholder="As on passport"
                        value={p.firstName}
                        onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </Field>
                    <Field id={`${p.id}-middle`} label="Middle name">
                      <input
                        id={`${p.id}-middle`}
                        className={fieldClass}
                        placeholder="Optional"
                        value={p.middleName}
                        onChange={(e) => handleChange(index, 'middleName', e.target.value)}
                        autoComplete="additional-name"
                      />
                    </Field>
                    <Field id={`${p.id}-last`} label="Last name">
                      <input
                        id={`${p.id}-last`}
                        className={fieldClass}
                        placeholder="As on passport"
                        value={p.lastName}
                        onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field id={`${p.id}-gender`} label="Gender">
                      <select
                        id={`${p.id}-gender`}
                        className={fieldClass}
                        value={p.gender}
                        onChange={(e) => handleChange(index, 'gender', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </Field>
                    <Field id={`${p.id}-dob`} label="Date of birth">
                      <input
                        id={`${p.id}-dob`}
                        type="date"
                        className={fieldClass}
                        value={p.dob}
                        onChange={(e) => handleChange(index, 'dob', e.target.value)}
                        required
                      />
                    </Field>
                    <Field id={`${p.id}-phone`} label="Phone">
                      <input
                        id={`${p.id}-phone`}
                        className={fieldClass}
                        placeholder="+1 555 000 0000"
                        value={p.phone}
                        onChange={(e) => handleChange(index, 'phone', e.target.value)}
                        required
                        autoComplete="tel"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field id={`${p.id}-email`} label="Email">
                      <input
                        id={`${p.id}-email`}
                        type="email"
                        className={fieldClass}
                        placeholder="name@email.com"
                        value={p.email}
                        onChange={(e) => handleChange(index, 'email', e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </Field>
                    <Field id={`${p.id}-nationality`} label="Nationality">
                      <input
                        id={`${p.id}-nationality`}
                        className={fieldClass}
                        placeholder="e.g. US"
                        value={p.nationality}
                        onChange={(e) => handleChange(index, 'nationality', e.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field id={`${p.id}-passport`} label="Passport number">
                      <input
                        id={`${p.id}-passport`}
                        className={fieldClass}
                        placeholder="Optional"
                        value={p.passportNumber}
                        onChange={(e) => handleChange(index, 'passportNumber', e.target.value)}
                      />
                    </Field>
                    <Field id={`${p.id}-expiry`} label="Passport expiry">
                      <input
                        id={`${p.id}-expiry`}
                        type="date"
                        className={fieldClass}
                        value={p.passportExpiry}
                        onChange={(e) => handleChange(index, 'passportExpiry', e.target.value)}
                      />
                    </Field>
                    <Field id={`${p.id}-pass-country`} label="Passport country">
                      <input
                        id={`${p.id}-pass-country`}
                        className={fieldClass}
                        placeholder="e.g. US"
                        value={p.passportCountry}
                        onChange={(e) => handleChange(index, 'passportCountry', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />

            {error && (
              <p className="mt-6 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-8">
              <FillButton
                type="submit"
                disabled={loading}
                className="inline-flex w-full cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3.5 text-sm font-semibold text-ink-950 disabled:opacity-60 sm:w-auto"
              >
                {loading ? 'Submitting…' : 'Submit booking request'}
              </FillButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
