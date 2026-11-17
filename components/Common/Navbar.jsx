'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import FillButton from '@/components/Common/FillButton'
import contactDetails from '@/data/contact'

const LINKS = [
  { href: '/flights', label: 'Flights' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/airlines', label: 'Airlines' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const navLinkClass =
  'relative cursor-pointer px-1 py-1 text-[15px] font-semibold tracking-wide text-ink-900 transition-colors hover:text-leaf-700 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-leaf-500 after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500'

function useHoverCall() {
  const callTimerRef = useRef(null)

  function clearCallTimer() {
    if (callTimerRef.current) {
      window.clearTimeout(callTimerRef.current)
      callTimerRef.current = null
    }
  }

  useEffect(() => () => clearCallTimer(), [])

  return {
    onMouseEnter: () => {
      clearCallTimer()
      callTimerRef.current = window.setTimeout(() => {
        window.location.href = contactDetails.phoneHref
      }, 280)
    },
    onMouseLeave: () => clearCallTimer(),
  }
}

/** Desktop: scrolling marquee CTA */
function BookingMarqueeCta({ className = '' }) {
  const hoverCall = useHoverCall()
  const chunk = (
    <span className="nav-cta-marquee-chunk">
      <span>Request booking</span>
      <span aria-hidden className="opacity-40">
        ·
      </span>
      <span>{contactDetails.phoneDisplay}</span>
      <span aria-hidden className="opacity-40">
        ·
      </span>
    </span>
  )

  return (
    <FillButton
      href={contactDetails.phoneHref}
      {...hoverCall}
      className={`nav-cta-marquee cursor-pointer bg-leaf-500 py-2.5 text-[13px] font-semibold tracking-wide text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500 ${className}`}
      contentClassName="w-full min-w-0"
      aria-label={`Call ${contactDetails.phoneDisplay}`}
    >
      <span className="nav-cta-marquee-track">
        {chunk}
        {chunk}
      </span>
    </FillButton>
  )
}

/** Mobile menu: Option A — stacked label + number, full tap = call */
function BookingStackedCta({ className = '', onClick }) {
  return (
    <FillButton
      href={contactDetails.phoneHref}
      onClick={onClick}
      className={`inline-flex w-full cursor-pointer items-center justify-center bg-leaf-500 px-4 py-3.5 text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500 ${className}`}
      contentClassName="w-full"
      aria-label={`Call ${contactDetails.phoneDisplay}`}
    >
      <span className="flex w-full flex-col items-center gap-0.5 text-center">
        <span className="text-sm font-semibold tracking-wide">Request booking</span>
        <span className="text-xs font-medium tabular-nums tracking-wide opacity-80">
          {contactDetails.phoneDisplay}
        </span>
      </span>
    </FillButton>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function close() {
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 cursor-pointer items-center" onClick={close} aria-label="BooksRad home">
          <Image
            src="/images/logo.png"
            alt="BooksRad"
            width={480}
            height={156}
            priority
            className="h-10 w-auto max-w-[min(220px,55vw)] object-contain object-left sm:h-11 lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-7 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          <BookingMarqueeCta className="ml-1 w-[11.5rem]" />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-ink-300 text-ink-900 transition hover:border-leaf-500 hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper px-4 py-5 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="cursor-pointer border-b border-line py-3.5 text-[15px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
              >
                {link.label}
              </Link>
            ))}
            <BookingStackedCta className="mt-5" onClick={close} />
          </nav>
        </div>
      )}
    </header>
  )
}
