import { NextResponse } from 'next/server'
import { isRateLimited, recordSubmission } from '@/lib/rateLimit'
import { getClientIp, lookupLocation } from '@/lib/geo'
import { getMailFrom, getMailTo, getTransporter } from '@/lib/mailer'
import { generateContactEmail } from '@/lib/emailTemplate'
import { emailDomainOk, isDisposableEmail, validateEmail, validatePhone } from '@/lib/validators'

export const runtime = 'nodejs'

function cleanString(value, max) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

async function validatePayload(payload) {
  const errors = []
  const sanitized = {
    name: cleanString(payload.name, 100),
    email: typeof payload.email === 'string' ? payload.email : '',
    phone: cleanString(payload.phone, 20),
    countryCode: cleanString(payload.countryCode, 10),
    subject: cleanString(payload.subject, 150),
    details: cleanString(payload.details, 2000),
    website: typeof payload.website === 'string' ? payload.website.trim() : '',
  }

  if (!sanitized.name) errors.push('name')
  if (!sanitized.email) errors.push('email')
  if (!sanitized.subject) errors.push('subject')
  if (!sanitized.details) errors.push('details')

  if (!validateEmail(sanitized.email)) {
    errors.push('email')
  } else if (isDisposableEmail(sanitized.email)) {
    errors.push('email')
  } else if (!(await emailDomainOk(sanitized.email))) {
    errors.push('email')
  } else {
    sanitized.email = sanitized.email.toLowerCase()
  }

  if (sanitized.phone) {
    const validatedPhone = validatePhone(sanitized.countryCode, sanitized.phone)
    if (!validatedPhone.valid) errors.push('phone')
    sanitized.phoneE164 = validatedPhone.e164
  } else {
    sanitized.phoneE164 = ''
  }

  return { sanitized, errors: [...new Set(errors)] }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { website } = body
    if (typeof website === 'string' && website.trim() !== '') {
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

    if (isRateLimited(`contact:${ip}`)) {
      return NextResponse.json(
        { success: false, error: 'We have already received your request. Our team will contact you shortly.' },
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
      console.error('SMTP configuration error (contact):', e)
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

    const { html, text } = generateContactEmail(sanitized, hostname, location, ip)
    await transporter.sendMail({
      from: getMailFrom(brandName),
      to: mailTo,
      replyTo: sanitized.email,
      subject: `New Contact Query: ${sanitized.name} - ${sanitized.subject || 'No subject'} | ${hostname}`,
      text,
      html,
    })

    recordSubmission(`contact:${ip}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
