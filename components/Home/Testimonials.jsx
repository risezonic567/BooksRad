'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    quote: 'Found a clean London–Dubai option on my phone and the desk confirmed within a day.',
    name: 'Priya N.',
    role: 'Solo traveler',
  },
  {
    quote: 'Comparing stops and cabin was easier than the usual maze of pop-ups. Request felt straightforward.',
    name: 'Marcus T.',
    role: 'Business trip',
  },
  {
    quote: 'We booked premium economy for a family of four — clear offer summary before we submitted.',
    name: 'Elena R.',
    role: 'Family trip',
  },
  {
    quote: 'I shortlisted two nonstops, picked one, and the reply email had everything we needed to decide.',
    name: 'Jordan K.',
    role: 'Weekend getaway',
  },
  {
    quote: 'Desk followed up with cabin alternatives when my first pick sold out — calm, no pressure.',
    name: 'Aisha M.',
    role: 'Premium economy',
  },
]

const AUTO_MS = 5500

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length
  const active = testimonials[index]

  useEffect(() => {
    if (paused || count <= 1) return undefined
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, count])

  function go(delta) {
    setIndex((i) => (i + delta + count) % count)
  }

  return (
    <section
      className="border-y border-line bg-paper py-16 sm:py-20"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="testimonials-heading"
            className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
          >
            What travelers say
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-600">
            Short notes from people who searched, selected, and requested through BooksRad.
          </p>
        </div>

        <div className="mt-10 grid gap-0 border border-line bg-white lg:grid-cols-12">
          {/* Name rail — desktop only; phone shows review + arrows only */}
          <div className="hidden border-b border-line lg:col-span-4 lg:block lg:border-b-0 lg:border-r">
            <ul className="divide-y divide-line" role="tablist" aria-label="Travelers">
              {testimonials.map((item, i) => {
                const selected = i === index
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setIndex(i)}
                      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition sm:px-5 ${
                        selected ? 'bg-leaf-500/10' : 'hover:bg-ink-50'
                      }`}
                    >
                      <span
                        className={`h-8 w-0.5 shrink-0 ${selected ? 'bg-leaf-500' : 'bg-transparent'}`}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-semibold ${
                            selected ? 'text-ink-950' : 'text-ink-700'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-500">{item.role}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Active quote */}
          <div className="flex flex-col justify-between lg:col-span-8">
            <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <blockquote
                key={active.name}
                className="mt-5 font-display text-2xl font-medium leading-snug tracking-tight text-ink-950 sm:text-3xl sm:leading-snug"
              >
                “{active.quote}”
              </blockquote>
              <p className="mt-8 text-sm text-ink-600">
                <span className="font-semibold text-ink-950">{active.name}</span>
                <span className="mx-2 text-ink-300">·</span>
                {active.role}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 sm:px-8">
              <p className="hidden text-xs text-ink-500 sm:block">Auto-advances · hover to pause</p>
              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-line text-ink-800 hover:bg-ink-50"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-line text-ink-800 hover:bg-ink-50"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
