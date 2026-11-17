'use client'

import {
  Briefcase,
  Leaf,
  Luggage,
  Plane,
  Plug,
  Tag,
  Wifi,
} from 'lucide-react'
import FillButton from '@/components/Common/FillButton'
import AirlineMark from '@/components/Flights/AirlineMark'

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

function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Chip({ icon: Icon, children, tone = 'neutral' }) {
  const tones = {
    neutral: 'border-line bg-ink-50 text-ink-800',
    good: 'border-leaf-500/30 bg-leaf-500/10 text-leaf-800',
    muted: 'border-line bg-white text-ink-500',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 text-xs font-medium ${tones[tone] || tones.neutral}`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
      {children}
    </span>
  )
}

export default function OfferCard({ offer, onSelect }) {
  const outbound = offer?.slices?.[0]
  const inbound = offer?.slices?.[1]

  return (
    <article className="border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <AirlineMark
                name={offer.airline}
                logoUrl={offer.logoUrl}
                code={offer.airlineCode}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-bold text-ink-950">{offer.airline}</h3>
                {offer.cabin && (
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-leaf-700">
                    {offer.cabin}
                  </span>
                )}
                {outbound?.flightNumber ? (
                  <span className="text-xs font-medium text-ink-500">{outbound.flightNumber}</span>
                ) : null}
              </div>

              <div className="mt-3 space-y-2 text-sm text-ink-700">
                {outbound && (
                  <p>
                    <span className="font-semibold text-ink-900">
                      {outbound.origin} → {outbound.destination}
                    </span>
                    <span className="text-ink-400"> · </span>
                    {formatWhen(outbound.departure)}
                    <span className="text-ink-400"> · </span>
                    {outbound.duration || '—'}
                    <span className="text-ink-400"> · </span>
                    {outbound.stops === 0 ? 'Nonstop' : `${outbound.stops} stop${outbound.stops === 1 ? '' : 's'}`}
                    {outbound.layovers?.length ? (
                      <>
                        <span className="text-ink-400"> · </span>
                        via {outbound.layovers.join(', ')}
                      </>
                    ) : null}
                  </p>
                )}
                {inbound && (
                  <p>
                    <span className="font-semibold text-ink-900">
                      {inbound.origin} → {inbound.destination}
                    </span>
                    <span className="text-ink-400"> · </span>
                    {formatWhen(inbound.departure)}
                    <span className="text-ink-400"> · </span>
                    {inbound.duration || '—'}
                    <span className="text-ink-400"> · </span>
                    {inbound.stops === 0 ? 'Nonstop' : `${inbound.stops} stop${inbound.stops === 1 ? '' : 's'}`}
                    {inbound.flightNumber ? (
                      <>
                        <span className="text-ink-400"> · </span>
                        {inbound.flightNumber}
                      </>
                    ) : null}
                    {inbound.layovers?.length ? (
                      <>
                        <span className="text-ink-400"> · </span>
                        via {inbound.layovers.join(', ')}
                      </>
                    ) : null}
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {offer.fareBrand ? (
                  <Chip icon={Tag}>{offer.fareBrand}</Chip>
                ) : null}

                {offer.checkedBags > 0 ? (
                  <Chip icon={Briefcase} tone="good">
                    {offer.checkedBags} checked
                  </Chip>
                ) : (
                  <Chip icon={Briefcase} tone="muted">
                    No checked bag
                  </Chip>
                )}

                {offer.carryOnBags > 0 ? (
                  <Chip icon={Luggage} tone="good">
                    {offer.carryOnBags} cabin bag
                  </Chip>
                ) : (
                  <Chip icon={Luggage} tone="muted">
                    No cabin bag
                  </Chip>
                )}

                {offer.wifi ? (
                  <Chip icon={Wifi} tone="good">
                    Wi‑Fi{offer.wifiCost ? ` · ${offer.wifiCost}` : ''}
                  </Chip>
                ) : (
                  <Chip icon={Wifi} tone="muted">
                    No Wi‑Fi
                  </Chip>
                )}

                {offer.power ? (
                  <Chip icon={Plug} tone="good">
                    Power
                  </Chip>
                ) : null}

                {offer.aircraft ? (
                  <Chip icon={Plane}>{offer.aircraft}</Chip>
                ) : null}

                {offer.emissionsKg ? (
                  <Chip icon={Leaf}>
                    CO₂ {Number(offer.emissionsKg)} kg
                  </Chip>
                ) : null}

                {offer.seatPitch ? (
                  <Chip>Seat pitch {offer.seatPitch}</Chip>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
          <p className="font-display text-2xl font-bold tracking-tight text-ink-950">
            {formatMoney(offer.price, offer.currency)}
          </p>
          <FillButton
            type="button"
            onClick={() => onSelect?.(offer)}
            className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-4 py-2.5 text-sm font-semibold text-ink-950"
          >
            Select
          </FillButton>
        </div>
      </div>
    </article>
  )
}
