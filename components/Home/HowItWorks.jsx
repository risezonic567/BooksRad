'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { revealOnScroll, safeRevert } from '@/lib/gsapSafe'

const steps = [
  {
    title: 'Search your route',
    copy: 'Enter airports, dates, travelers, and cabin. We query live offers for that itinerary.',
  },
  {
    title: 'Compare offers',
    copy: 'Review airline, stops, duration, and price in a clean list — pick what fits.',
  },
  {
    title: 'Request booking',
    copy: 'Send passenger and contact details. Our desk confirms availability and next steps.',
  },
  {
    title: 'Fly with clarity',
    copy: 'You get a human reply with confirmation guidance — not a mystery charge at click.',
  },
]

export default function HowItWorks() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const heading = root.querySelector('[data-reveal="heading"]')
    const cards = root.querySelectorAll('[data-reveal="card"]')
    const ctx = gsap.context(() => {
      if (heading) {
        revealOnScroll(heading, {
          trigger: heading,
          vars: { y: 28, duration: 0.8, stagger: 0, start: 'top 85%' },
        })
      }
      if (cards.length) {
        revealOnScroll(cards, {
          trigger: root.querySelector('[data-reveal-grid]') || root,
          vars: { y: 40, stagger: 0.14, duration: 0.9, start: 'top 82%' },
        })
      }
    }, root)

    return () => safeRevert(ctx, [heading, ...cards].filter(Boolean))
  }, [])

  return (
    <section ref={rootRef} className="bg-white py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center" data-reveal="heading">
          <h2 id="how-heading" className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-600">
            Four steps from search to a booking request — built for phones first.
          </p>
        </div>

        <ol data-reveal-grid className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} data-reveal="card" className="relative">
              <span className="font-display text-4xl font-bold text-leaf-500/40">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-display text-lg font-bold text-ink-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-600">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
