'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { revealOnScroll, safeRevert } from '@/lib/gsapSafe'

const points = [
  {
    title: 'Live offer search',
    copy: 'Airport suggestions and flight offers powered by Duffel — real schedules, real cabins.',
  },
  {
    title: 'Human booking desk',
    copy: 'You select an offer; we confirm seats and reply with clear next steps — no surprise auto-charge.',
  },
  {
    title: 'Mobile-first flow',
    copy: 'Search, compare, and request from your phone without wrestling a desktop-only form.',
  },
]

export default function WhyUs() {
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
          vars: { y: 36, stagger: 0.16, duration: 0.9, start: 'top 80%' },
        })
      }
    }, root)

    return () => safeRevert(ctx, [heading, ...cards].filter(Boolean))
  }, [])

  return (
    <section ref={rootRef} className="border-b border-line bg-paper py-16 sm:py-20" aria-labelledby="why-us-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl" data-reveal="heading">
          <h2 id="why-us-heading" className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Why travelers use BooksRad
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-600">
            A focused flight path — search, select, request — with lime-clear guidance and desk support.
          </p>
        </div>

        <ul data-reveal-grid className="mt-10 grid gap-8 border-t border-line pt-10 sm:grid-cols-3 sm:gap-0">
          {points.map((item, index) => (
            <li
              key={item.title}
              data-reveal="card"
              className={`sm:px-6 ${index > 0 ? 'sm:border-l sm:border-line' : ''} ${index === 0 ? 'sm:pl-0' : ''} ${index === points.length - 1 ? 'sm:pr-0' : ''}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-600">0{index + 1}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-ink-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-600">{item.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
