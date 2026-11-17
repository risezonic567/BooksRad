import nodemailer from 'nodemailer'

let transporter = null

/** Known SMTP hosts — pick via SMTP_PROVIDER or set SMTP_HOST directly. */
export const SMTP_PROVIDERS = {
  godaddy: {
    label: 'GoDaddy Professional Email (Titan)',
    host: 'smtpout.secureserver.net',
    port: 587,
    secure: false,
  },
  titan: {
    label: 'Direct Titan',
    host: 'smtp.titan.email',
    port: 587,
    secure: false,
  },
  gmail: {
    label: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
}

export function resolveSmtpConfig() {
  const providerKey = String(process.env.SMTP_PROVIDER || '').trim().toLowerCase()
  const preset = SMTP_PROVIDERS[providerKey] || null

  const host = process.env.SMTP_HOST || preset?.host || ''
  const port = Number(process.env.SMTP_PORT || preset?.port || 587)
  const secure =
    process.env.SMTP_SECURE === 'true'
    || process.env.SMTP_SECURE === '1'
    || (process.env.SMTP_SECURE == null && preset ? preset.secure : false)

  return {
    providerKey: providerKey || null,
    providerLabel: preset?.label || null,
    host,
    port,
    secure,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  }
}

function validateConfig(cfg) {
  const missing = []
  if (!cfg.host) missing.push('SMTP_HOST (or SMTP_PROVIDER=titan|godaddy|gmail)')
  if (!cfg.port) missing.push('SMTP_PORT')
  if (!cfg.user) missing.push('SMTP_USER')
  if (!cfg.pass) missing.push('SMTP_PASS')
  if (missing.length) {
    throw new Error(`Missing SMTP configuration env vars: ${missing.join(', ')}`)
  }
}

export function getTransporter() {
  if (transporter) return transporter
  const cfg = resolveSmtpConfig()
  validateConfig(cfg)

  transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  })

  return transporter
}

export function getMailFrom(brandName = 'BooksRad') {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  return `"${brandName}" <${from}>`
}

export function getMailTo() {
  return process.env.MAIL_TO || process.env.QUOTE_RECEIVER_EMAIL
}
