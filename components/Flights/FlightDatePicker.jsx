'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseISO(iso) {
  if (!iso) return null
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function sameDay(a, b) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isBefore(a, b) {
  return toISODate(a) < toISODate(b)
}

function formatChip(iso) {
  const d = parseISO(iso)
  if (!d) return ''
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function MonthGrid({ monthDate, minDate, departure, returnDate, isRound, onPick }) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day))

  const dep = parseISO(departure)
  const ret = parseISO(returnDate)

  return (
    <div className="w-full min-w-0 select-none">
      <p className="mb-3 select-none text-center text-sm font-semibold text-ink-950">
        {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((w, i) => (
          <div key={`${w}-${i}`} className="py-1 text-center text-[11px] font-medium text-ink-400">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} className="aspect-square" />
          const disabled = minDate && isBefore(date, minDate)
          const isDep = sameDay(date, dep)
          const isRet = isRound && sameDay(date, ret)
          const inRange =
            isRound && dep && ret && !isBefore(date, dep) && !isBefore(ret, date) && !isDep && !isRet

          let cellCls =
            'relative flex aspect-square w-full cursor-pointer items-center justify-center text-sm tabular-nums transition '
          if (disabled) cellCls += 'cursor-not-allowed text-ink-300'
          else if (isDep || isRet) cellCls += 'bg-leaf-500 font-semibold text-ink-950'
          else if (inRange) cellCls += 'bg-leaf-500/15 font-medium text-leaf-700'
          else cellCls += 'text-ink-800 hover:bg-ink-100'

          return (
            <button
              key={toISODate(date)}
              type="button"
              disabled={disabled}
              className={cellCls}
              onClick={() => onPick(date)}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Google Flights–style dual-month date picker for BooksRad search.
 * tripType: 'oneway' | 'roundtrip'
 */
export default function FlightDatePicker({
  tripType = 'oneway',
  departureDate = '',
  returnDate = '',
  minDate,
  onChange,
  variant = 'page',
}) {
  const isHero = variant === 'hero'
  const isRound = tripType === 'roundtrip' || tripType === 'round'
  const min = parseISO(minDate) || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  const [open, setOpen] = useState(false)
  const [focusField, setFocusField] = useState('departure')
  const [draftDep, setDraftDep] = useState(departureDate)
  const [draftRet, setDraftRet] = useState(returnDate)
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(parseISO(departureDate) || min))
  const [mounted, setMounted] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      setDraftDep(departureDate)
      setDraftRet(returnDate)
    }
  }, [departureDate, returnDate, open])

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openPicker = (field) => {
    if (!isRound && field === 'return') return
    setFocusField(field)
    setDraftDep(departureDate)
    setDraftRet(returnDate)
    setViewMonth(startOfMonth(parseISO(departureDate) || min))
    setOpen(true)
  }

  const handlePick = (date) => {
    const iso = toISODate(date)
    if (!isRound || focusField === 'departure') {
      setDraftDep(iso)
      if (draftRet && isBefore(parseISO(draftRet), date)) setDraftRet('')
      if (isRound) setFocusField('return')
      else {
        onChange?.({ departureDate: iso, returnDate: '' })
        setOpen(false)
      }
      return
    }
    const dep = parseISO(draftDep)
    if (dep && isBefore(date, dep)) {
      setDraftDep(iso)
      setDraftRet('')
      setFocusField('return')
      return
    }
    setDraftRet(iso)
  }

  const handleDone = () => {
    onChange?.({
      departureDate: draftDep || '',
      returnDate: isRound ? draftRet || '' : '',
    })
    setOpen(false)
  }

  const chipCls = (active, disabled) => {
    if (isHero) {
      return `flex min-h-[52px] flex-1 cursor-pointer items-center gap-2 border bg-white px-3 py-2 text-left text-sm transition ${
        disabled
          ? 'cursor-not-allowed border-white/10 bg-white/80 text-ink-400'
          : active
            ? 'border-leaf-500 ring-2 ring-leaf-500/30'
            : 'border-white/15 hover:border-leaf-500/60'
      }`
    }
    return `flex min-h-[52px] flex-1 cursor-pointer items-center gap-2 border bg-white px-3 py-2 text-left text-sm transition ${
      disabled
        ? 'cursor-not-allowed border-line bg-ink-50 text-ink-400'
        : active
          ? 'border-leaf-500 ring-2 ring-leaf-500/25'
          : 'border-line hover:border-ink-300'
    }`
  }

  const months = useMemo(() => [viewMonth, addMonths(viewMonth, 1)], [viewMonth])
  const labelCls = isHero
    ? 'text-xs font-semibold uppercase tracking-[0.14em] text-leaf-400'
    : 'text-xs font-semibold uppercase tracking-[0.14em] text-ink-500'

  return (
    <div className="relative" ref={wrapRef}>
      <div className={`grid gap-3 ${isRound ? 'sm:grid-cols-2' : ''}`}>
        <div>
          <p className={labelCls}>Depart</p>
          <button
            type="button"
            className={`${chipCls(open && focusField === 'departure', false)} mt-1.5 w-full`}
            onClick={() => openPicker('departure')}
          >
            <Calendar className="h-4 w-4 shrink-0 text-leaf-600" aria-hidden />
            <span className="min-w-0">
              <span className="block truncate font-semibold text-ink-900">
                {formatChip(departureDate) || 'Select date'}
              </span>
            </span>
          </button>
        </div>
        {isRound ? (
          <div>
            <p className={labelCls}>Return</p>
            <button
              type="button"
              className={`${chipCls(open && focusField === 'return', false)} mt-1.5 w-full`}
              onClick={() => openPicker('return')}
            >
              <Calendar className="h-4 w-4 shrink-0 text-ink-500" aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink-900">
                  {formatChip(returnDate) || 'Select date'}
                </span>
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <button
                type="button"
                className="absolute inset-0 cursor-pointer bg-ink-950/55"
                aria-label="Close calendar"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Choose dates"
                className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-[44rem] flex-col border border-line bg-white shadow-2xl"
              >
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`cursor-pointer border px-3 py-1.5 text-xs font-semibold ${
                        focusField === 'departure'
                          ? 'border-leaf-500 bg-leaf-500/10 text-leaf-700'
                          : 'border-line text-ink-600'
                      }`}
                      onClick={() => setFocusField('departure')}
                    >
                      Depart · {formatChip(draftDep) || 'Select'}
                    </button>
                    {isRound ? (
                      <button
                        type="button"
                        className={`cursor-pointer border px-3 py-1.5 text-xs font-semibold ${
                          focusField === 'return'
                            ? 'border-leaf-500 bg-leaf-500/10 text-leaf-700'
                            : 'border-line text-ink-600'
                        }`}
                        onClick={() => setFocusField('return')}
                      >
                        Return · {formatChip(draftRet) || 'Select'}
                      </button>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-pointer text-xs font-semibold text-leaf-700 underline-offset-2 hover:underline"
                      onClick={() => {
                        setDraftDep('')
                        setDraftRet('')
                        setFocusField('departure')
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer p-1.5 text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      className="cursor-pointer border border-line p-2 text-ink-700 hover:bg-ink-50"
                      onClick={() => setViewMonth((m) => addMonths(m, -1))}
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="select-none text-center text-sm font-semibold text-ink-700">
                      {viewMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      <span className="mx-2 text-ink-300">–</span>
                      {addMonths(viewMonth, 1).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <button
                      type="button"
                      className="cursor-pointer border border-line p-2 text-ink-700 hover:bg-ink-50"
                      onClick={() => setViewMonth((m) => addMonths(m, 1))}
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0">
                    {months.map((m, index) => (
                      <div
                        key={toISODate(m)}
                        className={index === 1 ? 'sm:border-l sm:border-line sm:pl-8' : 'sm:pr-8'}
                      >
                        <MonthGrid
                          monthDate={m}
                          minDate={min}
                          departure={draftDep}
                          returnDate={draftRet}
                          isRound={isRound}
                          onPick={handlePick}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 justify-end border-t border-line px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    disabled={!draftDep || (isRound && !draftRet)}
                    className="cursor-pointer bg-leaf-500 px-5 py-2.5 text-sm font-semibold text-ink-950 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleDone}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
