import { NextResponse } from 'next/server'

// Lightweight proxy to fetch weekly odds/lines. Keeps it self-contained and cacheable.
// Query params: year, week, seasonType, conference, team, bookmaker
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || '2024'
    const week = searchParams.get('week') || '1'
    const seasonType = searchParams.get('seasonType') || 'regular'
    const bookmaker = searchParams.get('bookmaker') || 'consensus'

    // CFBD odds endpoint (proxy). Expect env CFBD_API_KEY present in the app.
    const cfbdKey = process.env.CFBD_API_KEY
    if (!cfbdKey) {
      return NextResponse.json({ success: false, error: 'CFBD_API_KEY not configured' }, { status: 500 })
    }

    // Lines by week
    const oddsUrl = `https://api.collegefootballdata.com/lines?year=${encodeURIComponent(
      year
    )}&week=${encodeURIComponent(week)}&seasonType=${encodeURIComponent(
      seasonType
    )}`

    const res = await fetch(oddsUrl, {
      headers: {
        Authorization: `Bearer ${cfbdKey}`,
        Accept: 'application/json'
      },
      // odds do not need to be ISR cached here; allow short cache
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ success: false, error: text || res.statusText }, { status: res.status })
    }

    const data = await res.json()

    // Optionally filter to bookmaker
    const normalized = Array.isArray(data)
      ? data.map((game) => {
          const books = Array.isArray(game.lines) ? game.lines : []
          let selected = books
          if (bookmaker && bookmaker !== 'consensus') {
            selected = books.filter((b: any) => (b?.provider?.toLowerCase?.() || '') === bookmaker.toLowerCase())
          }
          // Pick most recent line if multiple
          const latest = selected.sort((a: any, b: any) => (new Date(b?.updated) as any) - (new Date(a?.updated) as any))[0] || books[0]
          return { ...game, latestLine: latest }
        })
      : []

    return NextResponse.json({ success: true, data: normalized })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 })
  }
}


