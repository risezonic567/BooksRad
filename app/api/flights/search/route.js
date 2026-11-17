import { NextResponse } from 'next/server'
import { searchOffersPage } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      from,
      to,
      departDate,
      returnDate,
      tripType = 'oneway',
      cabin = 'economy',
      adults = 1,
      children = 0,
      infants = 0,
      page = 1,
      limit = 20,
      filters = {},
    } = body || {}

    if (!from || !to || !departDate) {
      return NextResponse.json(
        { offers: [], error: 'from, to, and departDate are required' },
        { status: 400 },
      )
    }

    const token = process.env.FLIGHT_SEARCH_TOKEN
    if (!token) {
      return NextResponse.json(
        { offers: [], error: 'Flight search token not configured' },
        { status: 500 },
      )
    }

    const result = await searchOffersPage({
      from,
      to,
      departDate,
      returnDate,
      tripType,
      cabin,
      adults,
      children,
      infants,
      page,
      limit,
      filters,
      token,
    })

    return NextResponse.json({
      success: true,
      offers: result.offers,
      pagination: result.pagination,
      filtersData: result.filtersData,
    })
  } catch (err) {
    console.error('Flight search error:', err?.message || err, err?.details || '')
    const status = err?.status && Number.isInteger(err.status) ? err.status : 500
    return NextResponse.json(
      {
        offers: [],
        pagination: null,
        error: err?.message || 'Failed to search flights',
      },
      { status: status >= 400 && status < 600 ? status : 500 },
    )
  }
}
