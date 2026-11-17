/**
 * Verify SMTP credentials from .env.local
 * Usage: npm run smtp:verify
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'
import { resolveSmtpConfig, SMTP_PROVIDERS } from '../lib/mailer.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env.local')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`.env.local not found at ${filePath}`)
  }
  const text = fs.readFileSync(filePath, 'utf8')
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    // Always prefer .env.local over inherited shell env (avoids stale Gmail creds).
    process.env[key] = value
  }
}

async function main() {
  console.log('\nBooksRad SMTP verification\n')
  console.log('Built-in hosts:')
  console.log(`  titan   → ${SMTP_PROVIDERS.titan.host}`)
  console.log(`  godaddy → ${SMTP_PROVIDERS.godaddy.host}`)
  console.log(`  gmail   → ${SMTP_PROVIDERS.gmail.host}`)
  console.log('')

  try {
    loadEnvFile(envPath)
  } catch (err) {
    console.error(`FAIL  ${err.message}`)
    process.exit(1)
  }

  const cfg = resolveSmtpConfig()
  const from = process.env.MAIL_FROM || cfg.user
  const to = process.env.MAIL_TO

  console.log(`SMTP_PROVIDER : ${cfg.providerKey || '(none)'}`)
  console.log(`Provider      : ${cfg.providerLabel || 'Custom / SMTP_HOST'}`)
  console.log(`Host          : ${cfg.host || '(missing)'}`)
  console.log(`Port          : ${cfg.port || '(missing)'}  secure=${cfg.secure}`)
  console.log(`User          : ${cfg.user || '(missing)'}`)
  console.log(`Pass          : ${cfg.pass ? '********' : '(missing)'}`)
  console.log(`MAIL_FROM     : ${from || '(missing)'}`)
  console.log(`MAIL_TO       : ${to || '(missing)'}`)
  console.log('')

  const missing = [
    !cfg.host && 'SMTP_HOST or SMTP_PROVIDER',
    !cfg.port && 'SMTP_PORT',
    !cfg.user && 'SMTP_USER',
    !cfg.pass && 'SMTP_PASS',
  ].filter(Boolean)

  if (missing.length) {
    console.error(`FAIL  Missing: ${missing.join(', ')}`)
    console.error('Fill .env.local then run: npm run smtp:verify\n')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  })

  try {
    await transporter.verify()
    console.log('OK    SMTP connection verified — login works.')
    if (!to) {
      console.log('WARN  MAIL_TO empty — booking/contact emails have nowhere to go.')
    } else {
      console.log(`OK    MAIL_TO set — quote/contact will deliver to ${to}`)
    }
    console.log('')
    process.exit(0)
  } catch (err) {
    console.error('FAIL  SMTP verify failed')
    console.error(`      ${err?.message || err}`)
    console.error('\nTips:')
    console.error('  • Titan   → SMTP_PROVIDER=titan   (smtp.titan.email)')
    console.error('  • GoDaddy → SMTP_PROVIDER=godaddy (smtpout.secureserver.net)')
    console.error('  • Gmail   → SMTP_PROVIDER=gmail   + App Password')
    console.error('')
    process.exit(1)
  }
}

main()
