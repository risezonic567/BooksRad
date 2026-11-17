/** Best-effort client IP from common proxy headers. */
export function getClientIp(request) {
  const candidates = [
    request.headers.get('x-forwarded-for')?.split(',')[0],
    request.headers.get('x-real-ip'),
    request.headers.get('cf-connecting-ip'),
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0],
  ]
  for (const raw of candidates) {
    const ip = String(raw || '').trim()
    if (ip) return ip
  }
  return 'unknown'
}

async function fetchIpInfo(ip, token) {
  const url = token
    ? `https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${encodeURIComponent(token)}`
    : `https://ipinfo.io/${encodeURIComponent(ip)}/json`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return { ok: false, status: res.status }
    const data = await res.json()
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error }
  } finally {
    clearTimeout(timeout)
  }
}

function isPrivateOrLocalIp(ip) {
  if (!ip) return true
  const v = String(ip).trim().toLowerCase()
  if (v === 'unknown' || v === 'localhost' || v === '::1' || v === '0.0.0.0') return true
  if (v.startsWith('127.')) return true
  if (v.startsWith('10.')) return true
  if (v.startsWith('192.168.')) return true
  if (v.startsWith('169.254.')) return true
  const m = v.match(/^172\.(\d+)\./)
  if (m) {
    const n = Number(m[1])
    if (n >= 16 && n <= 31) return true
  }
  return false
}

function formatLocation(data) {
  if (!data) return 'Unknown'
  if (data.bogon) return 'Local / private network'
  const parts = [data.city, data.region, data.country].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Unknown'
}

export async function lookupLocation(ip) {
  if (!ip || ip === 'unknown') return 'Unknown'

  const cleanIp = String(ip).trim().replace(/^::ffff:/i, '')
  if (!cleanIp) return 'Unknown'

  // Localhost / LAN — ipinfo cannot geolocate these (bogon).
  if (isPrivateOrLocalIp(cleanIp)) return 'Local / private network'

  const token = process.env.IPINFO_TOKEN?.trim()
  if (token) {
    const withToken = await fetchIpInfo(cleanIp, token)
    if (withToken.ok) return formatLocation(withToken.data)
  }

  const withoutToken = await fetchIpInfo(cleanIp, null)
  if (withoutToken.ok) return formatLocation(withoutToken.data)
  return 'Unknown'
}
