'use client'

import { useState } from 'react'

export default function AirlineMark({ name, logoUrl, code, size = 'md' }) {
  const [broken, setBroken] = useState(false)
  const label = name || code || 'Airline'
  const initials = (code || label).slice(0, 2).toUpperCase()
  const box =
    size === 'lg'
      ? 'h-12 w-12'
      : size === 'sm'
        ? 'h-8 w-8'
        : 'h-11 w-11'
  const img =
    size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
  const tile =
    `inline-flex ${box} shrink-0 items-center justify-center overflow-hidden border border-line bg-white`

  if (logoUrl && !broken) {
    return (
      <span className={tile}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${label} logo`}
          className={`${img} object-contain`}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      </span>
    )
  }

  return (
    <span className={`${tile} bg-ink-50 text-xs font-bold text-ink-700`} aria-hidden>
      {initials}
    </span>
  )
}
