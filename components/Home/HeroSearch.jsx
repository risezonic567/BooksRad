'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FlightSearchForm from '@/components/Flights/FlightSearchForm'
import { ensureGsapPlugins, safeRevert } from '@/lib/gsapSafe'

export default function HeroSearch() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    ensureGsapPlugins()
    const eyebrow = root.querySelector('[data-reveal="eyebrow"]')
    const title = root.querySelector('[data-reveal="title"]')
    const copy = root.querySelector('[data-reveal="copy"]')
    const form = root.querySelector('[data-reveal="form"]')
    const nodes = [eyebrow, title, copy, form].filter(Boolean)

    const ctx = gsap.context(() => {
      gsap.set(nodes, { autoAlpha: 0, y: 28 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.85 },
        onComplete: () => {
          gsap.set(nodes, { clearProps: 'transform' })
        },
      })

      if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.05)
      if (title) tl.to(title, { autoAlpha: 1, y: 0, duration: 0.95 }, 0.12)
      if (copy) tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.28)
      if (form) tl.to(form, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.4)
    }, root)

    return () => safeRevert(ctx, nodes)
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 80% -10%, rgba(140,198,63,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(140,198,63,0.12), transparent 50%), linear-gradient(180deg, rgba(18,22,18,0.2), transparent 40%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
        <div className="max-w-2xl">
          <p data-reveal="eyebrow" className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-400">
            BooksRad
          </p>
          <h1
            data-reveal="title"
            className="mt-3 font-display text-[2.35rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
          >
            Book flights with a clear path from search to request.
          </h1>
          <p data-reveal="copy" className="mt-5 max-w-xl text-[1.05rem] leading-7 text-ink-300">
            Compare live offers, pick the itinerary that fits, and send a booking request — human follow-up within one business day.
          </p>
        </div>

        <div data-reveal="form" className="relative mt-8 max-w-4xl sm:mt-10">
          <FlightSearchForm variant="hero" />
        </div>
      </div>
    </section>
  )
}
