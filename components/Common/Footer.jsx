'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import contactDetails from '@/data/contact'
const EXPLORE_LINKS = [
  { href: '/flights', label: 'Flights' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/airlines', label: 'Airlines' },
  { href: '/blog', label: 'Blog' },
]

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms-conditions', label: 'Terms & conditions' },
]

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-400'

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1 text-sm text-ink-200 transition hover:text-white ${linkFocus}`}
    >
      {children}
      <ArrowUpRight
        className="h-3 w-3 opacity-0 transition group-hover:opacity-70"
        aria-hidden
      />
    </Link>
  )
}

export default function Footer() {
  const office = contactDetails.offices?.[0]

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-300">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 0% 0%, rgba(140,198,63,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(140,198,63,0.06), transparent 50%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" aria-label="BooksRad home" className={`inline-block ${linkFocus}`}>
              <Image
                src="/images/logo-white.png"
                alt="BooksRad"
                width={320}
                height={104}
                className="h-11 w-auto object-contain sm:h-12"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-300">
              Flight search and booking requests with clear offer summaries and human desk support.
            </p>
          </div>

          {/* Explore */}
          <div className="sm:col-span-1 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-400">Explore</p>
            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="sm:col-span-1 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-400">Company</p>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Desk card */}
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-400">Desk details</p>
            <div className="mt-4 border border-ink-700 bg-ink-900/40 p-5">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-700 bg-ink-950 text-leaf-400">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-ink-500">Phone</p>
                    <a
                      href={contactDetails.phoneHref}
                      className={`mt-0.5 block truncate font-semibold text-white transition hover:text-leaf-400 ${linkFocus}`}
                    >
                      {contactDetails.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-700 bg-ink-950 text-leaf-400">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-ink-500">Email</p>
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className={`mt-0.5 block truncate font-semibold text-white transition hover:text-leaf-400 ${linkFocus}`}
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                </li>
                {office?.address ? (
                  <li className="flex gap-3 border-t border-ink-800 pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-700 bg-ink-950 text-leaf-400">
                      <MapPin className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-500">Office</p>
                      <p className="mt-0.5 leading-6 text-ink-200">{office.address}</p>
                    </div>
                  </li>
                ) : null}
              </ul>
              <p className="mt-4 text-xs leading-5 text-ink-500">
                Reply window: within one business day on booking and contact requests.
              </p>
            </div>
          </div>
        </div>

        {/* Oversized brand type — desktop only */}
        <p
          className="mt-12 hidden select-none border-t border-ink-800 pt-8 font-display text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-none tracking-tight text-ink-800/80 md:block"
          aria-hidden
        >
          BooksRad
        </p>

        <div className="mt-5 flex flex-col gap-3 border-t border-ink-800 pt-5 text-xs text-ink-500 md:mt-6 md:border-t-0 md:pt-0 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BooksRad. All rights reserved.</p>
          <p className="text-ink-500">
            <Link href="/flights" className={`hover:text-leaf-400 ${linkFocus}`}>
              Flight search
            </Link>
            <span className="mx-2 text-ink-700">·</span>
            <Link href="/booking" className={`hover:text-leaf-400 ${linkFocus}`}>
              Booking requests
            </Link>
            <span className="mx-2 text-ink-700">·</span>
            Worldwide routes
          </p>
        </div>
      </div>
    </footer>
  )
}
