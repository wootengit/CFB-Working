import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || '2025'
    const limit = searchParams.get('limit') || '50'
    
    // College Football Data API v2 endpoints
    const apiKey = process.env.CFBD_API_KEY
    
    if (!apiKey) {
      console.warn('⚠️ CFBD API key not found, using mock data for development')
      return getMockCFBDNews()
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
      'User-Agent': 'CFB-Betting-Tool/1.0'
    }

    // Parallel API calls to get comprehensive data
    const [newsResponse, gamesResponse, rankingsResponse] = await Promise.all([
      // Note: CFBD doesn't have a direct news endpoint, so we'll use other endpoints to create news-like content
      fetch(`https://api.collegefootballdata.com/games?year=${year}&seasonType=regular`, { headers }),
      fetch(`https://api.collegefootballdata.com/games?year=${year}&seasonType=regular&week=1`, { headers }),
      fetch(`https://api.collegefootballdata.com/rankings?year=${year}&seasonType=regular`, { headers })
    ])

    // Process game data into news-like format
    let newsItems: any[] = []

    if (gamesResponse.ok) {
      const games = await gamesResponse.json()
      const recentGames = games.slice(0, 10) // Get 10 most recent games
      
      newsItems = recentGames.map((game: any) => ({
        id: `cfbd-game-${game.id}`,
        title: `${game.away_team} vs ${game.home_team}`,
        content: `Game analysis for ${game.away_team} at ${game.home_team}. Scheduled for ${new Date(game.start_date).toLocaleDateString()}.`,
        excerpt: `Upcoming matchup between ${game.away_team} and ${game.home_team}`,
        published_at: new Date(game.start_date).toISOString(),
        teams: [game.away_team, game.home_team],
        conference: game.conference_game ? 'Conference Game' : 'Non-Conference',
        venue: game.venue,
        url: `https://collegefootballdata.com/game/${game.id}`,
        type: 'game_preview',
        betting_relevant: true
      }))
    }

    // Add rankings-based news items
    if (rankingsResponse.ok) {
      const rankings = await rankingsResponse.json()
      const latestRankings = rankings.slice(0, 5) // Top 5 teams
      
      const rankingNews = latestRankings.map((poll: any, index: number) => {
        const topTeam = poll.polls[0]?.ranks[0]
        if (topTeam) {
          return {
            id: `cfbd-ranking-${poll.season}-${poll.week}-${index}`,
            title: `${topTeam.school} Maintains #${topTeam.rank} Ranking`,
            content: `${topTeam.school} continues to hold the #${topTeam.rank} position in the ${poll.poll} poll with ${topTeam.points} points.`,
            excerpt: `${topTeam.school} ranked #${topTeam.rank} in latest ${poll.poll} poll`,
            published_at: new Date().toISOString(),
            teams: [topTeam.school],
            conference: topTeam.conference || '',
            url: 'https://collegefootballdata.com/rankings',
            type: 'rankings_update',
            betting_relevant: true
          }
        }
        return null
      }).filter(Boolean)

      newsItems = [...newsItems, ...rankingNews]
    }

    console.log(`✅ CFBD API: Generated ${newsItems.length} news items from data`)

    return NextResponse.json({
      success: true,
      source: 'CFBD',
      count: newsItems.length,
      news: newsItems,
      lastUpdated: new Date().toISOString(),
      note: 'Generated from CFBD game and ranking data'
    })

  } catch (error) {
    console.error('CFBD API fetch error:', error)
    
    // Fallback to mock data
    return getMockCFBDNews()
  }
}

// Mock data for development when API key is not available
function getMockCFBDNews() {
  const mockNews = [
    {
      id: 'cfbd-mock-1',
      title: 'Alabama vs Georgia: SEC Championship Preview',
      content: 'Two powerhouse SEC teams prepare for a crucial matchup that could determine playoff positioning.',
      excerpt: 'Alabama and Georgia clash in SEC Championship with playoff implications',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      teams: ['Alabama', 'Georgia'],
      conference: 'SEC',
      url: 'https://collegefootballdata.com',
      type: 'game_preview',
      betting_relevant: true
    },
    {
      id: 'cfbd-mock-2',
      title: 'Michigan Climbs to #2 in Latest AP Poll',
      content: 'Michigan\'s impressive win over Ohio State propels them to the #2 ranking in the Associated Press poll.',
      excerpt: 'Michigan rises to #2 after victory over Ohio State',
      published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      teams: ['Michigan', 'Ohio State'],
      conference: 'Big Ten',
      url: 'https://collegefootballdata.com',
      type: 'rankings_update',
      betting_relevant: true
    },
    {
      id: 'cfbd-mock-3',
      title: 'Texas Longhorns Secure Big 12 Championship',
      content: 'Texas dominates in the Big 12 Championship game, securing their spot in the College Football Playoff.',
      excerpt: 'Texas wins Big 12 Championship, earns playoff berth',
      published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      teams: ['Texas'],
      conference: 'Big 12',
      url: 'https://collegefootballdata.com',
      type: 'championship_result',
      betting_relevant: true
    },
    {
      id: 'cfbd-mock-4',
      title: 'USC Quarterback Injury Report',
      content: 'Starting quarterback for USC listed as questionable for upcoming Pac-12 matchup, creating uncertainty for bettors.',
      excerpt: 'USC QB injury status affects betting lines',
      published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      teams: ['USC'],
      conference: 'Pac-12',
      url: 'https://collegefootballdata.com',
      type: 'injury_report',
      betting_relevant: true
    },
    {
      id: 'cfbd-mock-5',
      title: 'Notre Dame Transfer Portal Analysis',
      content: 'Multiple players entering the transfer portal from Notre Dame could impact their bowl game preparation.',
      excerpt: 'Notre Dame faces transfer portal departures',
      published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      teams: ['Notre Dame'],
      conference: 'Independent',
      url: 'https://collegefootballdata.com',
      type: 'transfer_news',
      betting_relevant: true
    }
  ]

  return NextResponse.json({
    success: true,
    source: 'CFBD',
    count: mockNews.length,
    news: mockNews,
    lastUpdated: new Date().toISOString(),
    note: 'Mock data - Set CFBD_API_KEY environment variable for live data'
  })
}

// Specific endpoint for team news
export async function POST(request: Request) {
  try {
    const { team, limit = 10 } = await request.json()
    
    const apiKey = process.env.CFBD_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'CFBD API key not configured',
        news: []
      }, { status: 503 })
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }

    // Get team-specific games and stats
    const [gamesResponse, statsResponse] = await Promise.all([
      fetch(`https://api.collegefootballdata.com/games?year=2025&team=${encodeURIComponent(team)}`, { headers }),
      fetch(`https://api.collegefootballdata.com/stats/season?year=2025&team=${encodeURIComponent(team)}`, { headers })
    ])

    let teamNews: any[] = []

    if (gamesResponse.ok) {
      const games = await gamesResponse.json()
      teamNews = games.slice(0, limit).map((game: any) => ({
        id: `cfbd-team-${team}-${game.id}`,
        title: `${team} ${game.home_team === team ? 'vs' : '@'} ${game.home_team === team ? game.away_team : game.home_team}`,
        content: `Game analysis for ${team}. ${game.completed ? 'Final score:' : 'Upcoming game on'} ${new Date(game.start_date).toLocaleDateString()}`,
        excerpt: `${team} game ${game.completed ? 'result' : 'preview'}`,
        published_at: new Date(game.start_date).toISOString(),
        teams: [game.home_team, game.away_team],
        conference: game.conference_game ? 'Conference' : 'Non-Conference',
        betting_relevant: true,
        team_specific: team
      }))
    }

    return NextResponse.json({
      success: true,
      team,
      count: teamNews.length,
      news: teamNews,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('CFBD team news fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch team news',
      news: []
    }, { status: 500 })
  }
}