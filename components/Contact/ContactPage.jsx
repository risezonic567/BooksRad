'use client'

import { useState } from 'react'
import contactDetails from '@/data/contact'
import FillButton from '@/components/Common/FillButton'
import PhoneInputField from '@/components/PhoneInputField'
import { isDisposableEmail, sanitizePhoneInput, validateEmail, validatePhone } from '@/lib/validationRules'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return

    const next = {}
    if (!name.trim()) next.name = 'Enter your name.'
    if (!validateEmail(email) || isDisposableEmail(email)) next.email = 'Enter a valid email.'
    if (!subject.trim()) next.subject = 'Enter a subject.'
    if (!details.trim()) next.details = 'Enter a message.'
    if (phone && !validatePhone(countryCode, phone).valid) next.phone = 'Enter a valid phone number.'
    if (Object.keys(next).length) {
      setFieldErrors(next)
      setError(null)
      return
    }

    setFieldErrors({})
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          countryCode,
          phone: phone.trim(),
          subject: subject.trim(),
          details: details.trim(),
          website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.error || 'Unable to send message.')
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-950">Talk to the BooksRad desk</h1>
          <p className="mt-4 text-base leading-7 text-ink-600">
            Questions about a search, an offer, or a booking request — send a note or call.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <a href={contactDetails.phoneHref} className="block font-bold text-ink-900 hover:text-leaf-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500">
              {contactDetails.phoneDisplay}
            </a>
            <a href={`mailto:${contactDetails.email}`} className="block text-ink-600 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500">
              {contactDetails.email}
            </a>
            {contactDetails.offices?.[0]?.address ? (
              <p className="pt-1 leading-6 text-ink-600">{contactDetails.offices[0].address}</p>
            ) : null}
          </div>
        </div>

        <div className="border border-line bg-white p-5 sm:p-7">
          {success ? (
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950">Message sent</h2>
              <p className="mt-3 text-sm leading-7 text-ink-600">
                Thanks — we will reply within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Name
                </label>
                <input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="search-field mt-1.5 h-12 w-full border border-line px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/25"
                  required
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-700">{fieldErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="search-field mt-1.5 h-12 w-full border border-line px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/25"
                  required
                />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-700">{fieldErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-phone" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Phone (optional)
                </label>
                <PhoneInputField
                  id="contact-phone"
                  countryCode={countryCode}
                  phone={phone}
                  invalid={Boolean(fieldErrors.phone)}
                  describedBy={fieldErrors.phone ? 'contact-phone-error' : undefined}
                  onCountryCodeChange={(code) => {
                    setCountryCode(code)
                    setFieldErrors((current) => {
                      if (!phone) {
                        const next = { ...current }
                        delete next.phone
                        return next
                      }
                      const phoneError = validatePhone(code, phone).valid
                        ? ''
                        : 'Enter a valid phone number.'
                      const next = { ...current }
                      if (phoneError) next.phone = phoneError
                      else delete next.phone
                      return next
                    })
                  }}
                  onPhoneChange={(nextPhone) => {
                    const value = sanitizePhoneInput(nextPhone)
                    setPhone(value)
                    setFieldErrors((current) => {
                      if (!current.phone && !value) return current
                      const phoneError = value && !validatePhone(countryCode, value).valid
                        ? 'Enter a valid phone number.'
                        : ''
                      const next = { ...current }
                      if (phoneError) next.phone = phoneError
                      else delete next.phone
                      return next
                    })
                  }}
                />
                {fieldErrors.phone && (
                  <p id="contact-phone-error" className="mt-1 text-xs text-red-700">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="search-field mt-1.5 h-12 w-full border border-line px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/25"
                  required
                />
                {fieldErrors.subject && <p className="mt-1 text-xs text-red-700">{fieldErrors.subject}</p>}
              </div>
              <div>
                <label htmlFor="contact-details" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Message
                </label>
                <textarea
                  id="contact-details"
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="search-field mt-1.5 w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/25"
                  required
                />
                {fieldErrors.details && <p className="mt-1 text-xs text-red-700">{fieldErrors.details}</p>}
              </div>
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              {error && (
                <p className="text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              <FillButton
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center bg-leaf-500 px-5 py-3 text-sm font-semibold text-ink-950 disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send message'}
              </FillButton>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
