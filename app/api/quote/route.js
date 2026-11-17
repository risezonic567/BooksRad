import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { isRateLimited, recordSubmission } from '@/lib/rateLimit'
import { getClientIp, lookupLocation } from '@/lib/geo'
import { getMailFrom, getMailTo, getTransporter } from '@/lib/mailer'
import { generateEmail } from '@/lib/emailTemplate'
import { emailDomainOk, isDisposableEmail, validateEmail, validatePhone } from '@/lib/validators'

export const runtime = 'nodejs'

async function validatePayload(payload) {
  const errors = []
  const trimAndCap = (value) => {
    if (typeof value !== 'string') return ''
    return value.trim().slice(0, 120).replace(/[\r\n]/g, '')
  }
  const sanitized = {}
  const fields = [
    'tripType',
    'origin',
    'destination',
    'departure',
    'returnDate',
    'passengers',
    'cabin',
    'countryCode',
    'website',
    'offerSummary',
    'totalPrice',
    'currency',
    'contactName',
  ]
  for (const f of fields) sanitized[f] = trimAndCap(payload[f] ?? '')

  sanitized.passengerNames = typeof payload.passengerNames === 'string'
    ? payload.passengerNames.trim().slice(0, 2000)
    : ''
  sanitized.notes = typeof payload.notes === 'string' ? payload.notes.trim().slice(0, 2000) : ''

  sanitized.travellers = Array.isArray(payload.travellers)
    ? payload.travellers.slice(0, 20).map((t) => ({
        type: trimAndCap(t?.type || 'adult'),
        firstName: trimAndCap(t?.firstName || ''),
        middleName: trimAndCap(t?.middleName || ''),
        lastName: trimAndCap(t?.lastName || ''),
        gender: trimAndCap(t?.gender || ''),
        dob: trimAndCap(t?.dob || ''),
        phone: typeof t?.phone === 'string' ? t.phone.trim().slice(0, 120) : '',
        email: typeof t?.email === 'string' ? t.email.trim().slice(0, 120).toLowerCase() : '',
        nationality: trimAndCap(t?.nationality || ''),
        passportNumber: trimAndCap(t?.passportNumber || ''),
        passportExpiry: trimAndCap(t?.passportExpiry || ''),
        passportCountry: trimAndCap(t?.passportCountry || ''),
      }))
    : []

  const { tripType, passengers } = sanitized
  const email = typeof payload.email === 'string' ? payload.email : ''
  const phone = typeof payload.phone === 'string' ? payload.phone.trim().slice(0, 120) : ''
  sanitized.email = email
  sanitized.phone = phone

  const required = ['tripType', 'origin', 'destination', 'departure', 'passengers', 'cabin', 'email', 'phone']
  for (const r of required) {
    if (!sanitized[r]) errors.push(r)
  }

  if (tripType === 'Round Trip' && !sanitized.returnDate) errors.push('returnDate')
  if (!['Round Trip', 'One Way'].includes(tripType)) errors.push('tripType')

  const pax = Number(passengers)
  if (!Number.isInteger(pax) || pax < 1 || pax > 999) errors.push('passengers')

  if (!validateEmail(email) || isDisposableEmail(email) || !(await emailDomainOk(email))) {
    errors.push('email')
  } else {
    sanitized.email = email.toLowerCase()
  }

  let validatedPhone = validatePhone(sanitized.countryCode || '+1', phone)
  if (!validatedPhone.valid && phone.startsWith('+')) {
    validatedPhone = validatePhone(phone.slice(0, 3), phone)
  }
  if (!validatedPhone.valid && phone.replace(/\D/g, '').length >= 7) {
    validatedPhone = { valid: true, e164: phone.replace(/\s/g, ''), country: null }
  }
  if (!validatedPhone.valid) errors.push('phone')
  sanitized.phoneE164 = validatedPhone.e164

  return { sanitized, errors: [...new Set(errors)] }
}

export async function POST(request) {
  try {
    const body = await request.json()
    if (body.website && String(body.website).trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const { sanitized, errors } = await validatePayload(body)
    if (errors.length) {
      return NextResponse.json(
        { success: false, error: 'Please check the form and try again.', fields: errors },
        { status: 400 },
      )
    }

    const ip = getClientIp(request)

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'We have already received your requests. Our team will contact you shortly.' },
        { status: 429 },
      )
    }

    const originHeader = request.headers.get('origin') || request.headers.get('host')
    let hostname = ''
    if (originHeader) {
      try {
        const url = new URL(originHeader.startsWith('http') ? originHeader : `https://${originHeader}`)
        hostname = url.hostname
      } catch {
        hostname = originHeader
      }
    }
    if (!hostname) hostname = process.env.SITE_DOMAIN || 'booksrad.com'
    const brandName = process.env.SITE_NAME || 'BooksRad'

    const location = await lookupLocation(ip)

    let transporter
    try {
      transporter = getTransporter()
    } catch (e) {
      console.error('SMTP configuration error:', e)
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please try again later.' },
        { status: 500 },
      )
    }

    const mailTo = getMailTo()
    if (!mailTo) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please try again later.' },
        { status: 500 },
      )
    }

    const { html, text } = generateEmail({ ...sanitized }, hostname, location, ip)
    await transporter.sendMail({
      from: getMailFrom(brandName),
      to: mailTo,
      replyTo: sanitized.email,
      subject: `New Booking Request: ${sanitized.origin} → ${sanitized.destination} (${sanitized.tripType}) | ${hostname}`,
      text,
      html,
    })

    recordSubmission(ip)
    const requestId = randomUUID()
    return NextResponse.json({ success: true, requestId })
  } catch (err) {
    console.error('Quote API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
