function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const rowEsc = (label, value) => `
  <tr>
    <td style="padding: 6px 8px; font-weight: bold; vertical-align: top;">${escapeHtml(label)}</td>
    <td style="padding: 6px 8px; vertical-align: top;">${escapeHtml(value)}</td>
  </tr>`

const rowHtml = (label, htmlValue) => `
  <tr>
    <td style="padding: 6px 8px; font-weight: bold; vertical-align: top;">${escapeHtml(label)}</td>
    <td style="padding: 6px 8px; vertical-align: top;">${htmlValue}</td>
  </tr>`

export function generateEmail(data, hostname, location, ip) {
  const {
    tripType,
    origin,
    destination,
    departure,
    returnDate,
    passengers,
    cabin,
    email,
    countryCode,
    phone,
    phoneE164,
    passengerNames,
    offerSummary,
    totalPrice,
    currency,
    notes,
    travellers,
  } = data

  let detailsRows = ''
  detailsRows += rowEsc('Trip Type', tripType)
  detailsRows += rowEsc('Flying From', origin)
  detailsRows += rowEsc('Flying To', destination)
  detailsRows += rowEsc('Departure', departure)
  if (tripType === 'Round Trip' && returnDate) detailsRows += rowEsc('Return Date', returnDate)
  detailsRows += rowEsc('Passengers', passengers)
  detailsRows += rowEsc('Class', cabin)
  if (offerSummary) detailsRows += rowEsc('Selected offer', offerSummary)
  if (totalPrice) detailsRows += rowEsc('Quoted total', `${currency || ''} ${totalPrice}`.trim())
  if (passengerNames) detailsRows += rowEsc('Passenger names', passengerNames)
  if (notes) detailsRows += rowEsc('Notes', notes)

  let travellerBlock = ''
  if (Array.isArray(travellers) && travellers.length) {
    travellerBlock = travellers
      .map((t, i) => {
        const name = [t.firstName, t.middleName, t.lastName].filter(Boolean).join(' ')
        return `<h4 style="margin:16px 0 6px;font-size:14px;">Traveller ${i + 1} (${escapeHtml(t.type || 'adult')})</h4>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowEsc('Name', name)}
          ${rowEsc('Gender', t.gender || '')}
          ${rowEsc('DOB', t.dob || '')}
          ${rowEsc('Email', t.email || '')}
          ${rowEsc('Phone', t.phone || '')}
          ${rowEsc('Nationality', t.nationality || '')}
          ${t.passportNumber ? rowEsc('Passport', t.passportNumber) : ''}
          ${t.passportExpiry ? rowEsc('Passport expiry', t.passportExpiry) : ''}
        </table>`
      })
      .join('')
  }

  const safeEmail = escapeHtml(email)
  const emailLink = `<a href="mailto:${safeEmail}">${safeEmail}</a>`
  const displayPhone = `${countryCode || ''} ${phone || ''}`.trim()
  const phoneLink = phoneE164
    ? `<a href="tel:${escapeHtml(phoneE164)}">${escapeHtml(displayPhone)}</a>`
    : escapeHtml(displayPhone)

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#121612; color:#fff;">
        <tr><td style="padding:20px; text-align:center;">
          <h1 style="margin:0; font-size:24px;">New Booking Request</h1>
          <div style="font-size:14px; color:#9fd24a;">${escapeHtml(hostname)}</div>
        </td></tr>
      </table>
      <div style="padding:20px; max-width:600px; margin:auto;">
        <div style="margin-bottom:12px;">
          <span style="background:#e4e9e2; color:#121612; padding:4px 8px; border-radius:4px; font-size:12px;">${escapeHtml(tripType)}</span>
        </div>
        <h2 style="font-size:20px; margin:0 0 12px;">${escapeHtml(origin)} → ${escapeHtml(destination)}</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${detailsRows}
        </table>
        <h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Lead contact</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowHtml('Email', emailLink)}
          ${rowHtml('Phone', phoneLink)}
        </table>
        ${travellerBlock ? `<h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Travellers</h3>${travellerBlock}` : ''}
        <h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Request Info</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowEsc('Website', hostname)}
          ${rowEsc('Submitted at (UTC)', new Date().toISOString())}
          ${rowEsc('IP Address', ip)}
          ${rowEsc('Approx. location', location)}
        </table>
      </div>
    </div>`

  const travellersText =
    Array.isArray(travellers) && travellers.length
      ? travellers
          .map((t, i) => {
            const name = [t.firstName, t.middleName, t.lastName].filter(Boolean).join(' ')
            return `Traveller ${i + 1} (${t.type || 'adult'}): ${name}
  Gender: ${t.gender || ''}
  DOB: ${t.dob || ''}
  Email: ${t.email || ''}
  Phone: ${t.phone || ''}
  Nationality: ${t.nationality || ''}
  Passport: ${t.passportNumber || ''}
  Passport expiry: ${t.passportExpiry || ''}`
          })
          .join('\n\n')
      : ''

  const text = `New Booking Request

Trip Type: ${tripType}
Flying From: ${origin}
Flying To: ${destination}
Departure: ${departure}
${tripType === 'Round Trip' && returnDate ? `Return Date: ${returnDate}\n` : ''}Passengers: ${passengers}
Class: ${cabin}
${offerSummary ? `Selected offer: ${offerSummary}\n` : ''}${totalPrice ? `Quoted total: ${currency || ''} ${totalPrice}\n` : ''}${passengerNames ? `Passenger names: ${passengerNames}\n` : ''}${notes ? `Notes: ${notes}\n` : ''}
Lead contact:
Email: ${email}
Phone: ${countryCode} ${phone}

${travellersText ? `Travellers:\n${travellersText}\n\n` : ''}Website: ${hostname}
IP: ${ip}
Location: ${location}`

  return { html, text }
}

export function generateContactEmail(data, hostname, location, ip) {
  const { name, email, phone, phoneE164, subject, details } = data
  const safeEmail = escapeHtml(email)
  const emailLink = `<a href="mailto:${safeEmail}">${safeEmail}</a>`
  const displayPhone = phone ? escapeHtml(phone) : ''
  const phoneLink = phoneE164
    ? `<a href="tel:${escapeHtml(phoneE164)}">${displayPhone}</a>`
    : ''

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#121612; color:#fff;">
        <tr><td style="padding:20px; text-align:center;">
          <h1 style="margin:0; font-size:24px;">New Contact Query</h1>
          <div style="font-size:14px; color:#9fd24a;">${escapeHtml(hostname)}</div>
        </td></tr>
      </table>
      <div style="padding:20px; max-width:600px; margin:auto;">
        <h2 style="font-size:20px; margin:0 0 12px;">${escapeHtml(subject || 'No subject')}</h2>
        <p style="white-space: pre-wrap;">${escapeHtml(details)}</p>
        <h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Customer Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowHtml('Name', escapeHtml(name))}
          ${rowHtml('Email', emailLink)}
          ${phone ? rowHtml('Phone', phoneLink) : ''}
          ${rowEsc('Subject', subject)}
        </table>
        <h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Request Info</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowEsc('Website', hostname)}
          ${rowEsc('Submitted at (UTC)', new Date().toISOString())}
          ${rowEsc('IP Address', ip)}
          ${rowEsc('Approx. location', location)}
        </table>
      </div>
    </div>`

  const text = `New Contact Query

Subject: ${subject}

Message:
${details}

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}

Website: ${hostname}
IP: ${ip}
Location: ${location}`

  return { html, text }
}
