'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import FillButton from '@/components/Common/FillButton'
import contactDetails from '@/data/contact'
import { readConfirmationGate } from '@/lib/quoteStorage'

function ConfirmationFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-ink-600 sm:px-6 lg:px-8">
      Checking your request…
    </div>
  )
}

function BookingConfirmationInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || ''
  const [route, setRoute] = useState('')
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const gate = readConfirmationGate(ref)
    if (!gate) {
      router.replace('/flights')
      return
    }
    setRoute(gate.route || '')
    setAllowed(true)
    setReady(true)
  }, [ref, router])

  if (!ready || !allowed) {
    return <ConfirmationFallback />
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Request received</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink-950">
        We have your booking request
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-ink-600">
        {route ? (
          <>
            Thanks for requesting{' '}
            <span className="font-medium text-ink-900 underline decoration-ink-400 underline-offset-4">
              {route}
            </span>
            .{' '}
          </>
        ) : null}
        Our desk will review the offer and reply within one business day with confirmation steps or alternatives.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <FillButton
          href="/flights"
          className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3 text-sm font-semibold text-ink-950"
        >
          Search another flight
        </FillButton>
        <FillButton
          href={contactDetails.phoneHref}
          className="inline-flex cursor-pointer items-center justify-center border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900"
        >
          Call {contactDetails.phoneDisplay}
        </FillButton>
      </div>
      <p className="mt-8 text-sm text-ink-500">
        Prefer email?{' '}
        <Link href="/contact" className="font-semibold text-ink-900 underline-offset-4 hover:underline">
          Contact the desk
        </Link>
      </p>
    </div>
  )
}

export default function BookingConfirmation() {
  return (
    <Suspense fallback={<ConfirmationFallback />}>
      <BookingConfirmationInner />
    </Suspense>
  )
}
