// College Football Betting Trends API
// Processes historical game data to generate comprehensive betting trend analytics
// Route: /api/betting-trends?year=2024&conference=SEC

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = parseInt(searchParams.get('year') || '2024')
  const conference = searchParams.get('conference') || 'All'

  try {
    console.log(`📊 Betting Trends API - Year: ${year}, Conference: ${conference}`)
    
    const startTime = Date.now()
    
    // Fetch games and betting lines data in parallel
    const [gamesResponse, linesResponse] = await Promise.all([
      fetch(`https://api.collegefootballdata.com/games?year=${year}&seasonType=regular`, {
        headers: {
          'Authorization': `Bearer ${process.env.CFBD_API_KEY || ''}`,
          'Accept': 'application/json'
        }
      }),
      fetch(`https://api.collegefootballdata.com/lines?year=${year}&seasonType=regular`, {
        headers: {
          'Authorization': `Bearer ${process.env.CFBD_API_KEY || ''}`, 
          'Accept': 'application/json'
        }
      })
    ])

    if (!gamesResponse.ok || !linesResponse.ok) {
      throw new Error('Failed to fetch data from CFBD API')
    }

    const games = await gamesResponse.json()
    const lines = await linesResponse.json()

    // Create lines lookup map
    const linesMap = new Map()
    lines.forEach((line: any) => {
      const key = `${line.homeTeam}_${line.awayTeam}_${line.week}`
      if (!linesMap.has(key) && line.lines && line.lines.length > 0) {
        // Use consensus or first available line
        const bestLine = line.lines.find((l: any) => l.provider === 'consensus') || line.lines[0]
        linesMap.set(key, {
          spread: bestLine.spread,
          overUnder: bestLine.overUnder,
          homeMoneyline: bestLine.homeMoneyline,
          awayMoneyline: bestLine.awayMoneyline
        })
      }
    })

    // Filter games by conference if specified  
    let filteredGames = games.filter((game: any) => 
      game.completed && 
      (game.homePoints !== null && game.homePoints !== undefined) && 
      (game.awayPoints !== null && game.awayPoints !== undefined)
    )
    
    if (conference !== 'All') {
      // CORRECTED: Conference name mapping to match exact CFBD API names
      const conferenceMapping: {[key: string]: string[]} = {
        'Independent': ['FBS Independents', 'FCS Independents', 'Independent DII', 'Independent DIII'],
        'American': ['American Athletic'],
        'C-USA': ['Conference USA'],
        'MAC': ['Mid-American'],
        'PAC-12': ['Pac-12'], 
        'Mountain West': ['Mountain West'],
        'Sun Belt': ['Sun Belt']
      }
      
      const allowedNames = conferenceMapping[conference] || [conference]
      
      filteredGames = filteredGames.filter((game: any) => 
        allowedNames.some(name => 
          game.homeConference?.toLowerCase().includes(name.toLowerCase()) ||
          game.awayConference?.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(game.homeConference?.toLowerCase() || '') ||
          name.toLowerCase().includes(game.awayConference?.toLowerCase() || '')
        )
      )
    }

    console.log(`🎯 Processing ${filteredGames.length} completed games...`)

    // Calculate betting trends
    const trends = calculateBettingTrends(filteredGames, linesMap)

    const processingTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      year,
      conference,
      totalGames: filteredGames.length,
      trends,
      meta: {
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        dataSource: 'CFBD API'
      }
    })

  } catch (error) {
    console.error('❌ Betting Trends API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate betting trends',
      details: error instanceof Error ? error.message : 'Unknown error',
      year,
      conference
    }, { status: 500 })
  }
}

function calculateBettingTrends(games: any[], linesMap: Map<string, any>) {
  const trends = {
    straightUp: {
      awayTeams: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      homeTeams: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      favorites: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      dogs: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      awayFavorites: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      awayDogs: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      homeFavorites: { wins: 0, losses: 0, ties: 0, percentage: 0 },
      homeDogs: { wins: 0, losses: 0, ties: 0, percentage: 0 }
    },
    againstTheSpread: {
      awayTeams: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      homeTeams: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      favorites: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      dogs: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      awayFavorites: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      awayDogs: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      homeFavorites: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
      homeDogs: { wins: 0, losses: 0, pushes: 0, percentage: 0 }
    },
    overUnder: {
      overtimeGames: { overs: 0, unders: 0, pushes: 0, overPercentage: 0, underPercentage: 0 },
      nonOvertimeGames: { overs: 0, unders: 0, pushes: 0, overPercentage: 0, underPercentage: 0 },
      allGames: { overs: 0, unders: 0, pushes: 0, overPercentage: 0, underPercentage: 0 }
    },
    // Enhanced categories
    spreadRanges: {
      small: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 },
      medium: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 },
      large: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 },
      huge: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 }
    },
    situational: {
      ranked: { games: 0, favWins: 0, atsWins: 0, percentage: 0 },
      primetime: { games: 0, homeWins: 0, awayWins: 0, homePercentage: 0 },
      rivalry: { games: 0, homeWins: 0, awayWins: 0, homePercentage: 0 },
      blowouts: { games: 0, overs: 0, unders: 0, overPercentage: 0 }
    }
  }

  games.forEach((game: any) => {
    const lineKey = `${game.homeTeam}_${game.awayTeam}_${game.week}`
    const line = linesMap.get(lineKey)
    
    // FIXED: CFBD API uses homePoints/awayPoints not homeScore/awayScore
    const homeScore = game.homePoints || game.homeScore
    const awayScore = game.awayPoints || game.awayScore  
    const homeWin = homeScore > awayScore
    const awayWin = awayScore > homeScore
    const tie = homeScore === awayScore
    const totalScore = homeScore + awayScore
    const margin = Math.abs(homeScore - awayScore)
    
    // FIXED: Process straight up trends for ALL completed games (not just those with betting lines)
    if (homeWin) {
      trends.straightUp.homeTeams.wins++
      trends.straightUp.awayTeams.losses++
    } else if (awayWin) {
      trends.straightUp.awayTeams.wins++
      trends.straightUp.homeTeams.losses++
    } else {
      trends.straightUp.homeTeams.ties++
      trends.straightUp.awayTeams.ties++
    }

    // Process betting lines if available (separate from straight up trends)
    if (line && line.spread !== undefined && line.spread !== null) {
      const spread = parseFloat(line.spread)
      const overUnder = line.overUnder ? parseFloat(line.overUnder) : null
      
      // Validate data integrity
      if (isNaN(spread) || homeScore === null || awayScore === null || homeScore === undefined || awayScore === undefined) {
        return // Skip invalid data
      }
      
      // Determine favorite/dog (negative spread = home favored)
      const homeFavorite = spread < 0
      
      // CORRECTED: ATS calculations with proper spread application
      const adjustedHomeScore = homeScore + spread
      const scoreDiff = adjustedHomeScore - awayScore
      
      let homeATS = false
      let awayATS = false
      let push = false
      
      // CORRECTED: Proper push detection
      if (Math.abs(scoreDiff) < 0.01) {
        push = true
      } else {
        homeATS = scoreDiff > 0
        awayATS = scoreDiff < 0
      }

      // CORRECTED: Complete straight up favorites/dogs tracking with losses
      if (homeFavorite) {
        // Home team is favored
        if (homeWin) {
          trends.straightUp.favorites.wins++
          trends.straightUp.dogs.losses++
          trends.straightUp.homeFavorites.wins++
          trends.straightUp.awayDogs.losses++
        } else if (awayWin) {
          trends.straightUp.favorites.losses++
          trends.straightUp.dogs.wins++
          trends.straightUp.homeFavorites.losses++
          trends.straightUp.awayDogs.wins++
        } else if (tie) {
          trends.straightUp.favorites.ties++
          trends.straightUp.dogs.ties++
          trends.straightUp.homeFavorites.ties++
          trends.straightUp.awayDogs.ties++
        }
      } else {
        // Away team is favored
        if (awayWin) {
          trends.straightUp.favorites.wins++
          trends.straightUp.dogs.losses++
          trends.straightUp.awayFavorites.wins++
          trends.straightUp.homeDogs.losses++
        } else if (homeWin) {
          trends.straightUp.favorites.losses++
          trends.straightUp.dogs.wins++
          trends.straightUp.awayFavorites.losses++
          trends.straightUp.homeDogs.wins++
        } else if (tie) {
          trends.straightUp.favorites.ties++
          trends.straightUp.dogs.ties++
          trends.straightUp.awayFavorites.ties++
          trends.straightUp.homeDogs.ties++
        }
      }

      // CORRECTED: Complete ATS trends tracking
      if (push) {
        trends.againstTheSpread.homeTeams.pushes++
        trends.againstTheSpread.awayTeams.pushes++
        if (homeFavorite) {
          trends.againstTheSpread.favorites.pushes++
          trends.againstTheSpread.dogs.pushes++
          trends.againstTheSpread.homeFavorites.pushes++
          trends.againstTheSpread.awayDogs.pushes++
        } else {
          trends.againstTheSpread.favorites.pushes++
          trends.againstTheSpread.dogs.pushes++
          trends.againstTheSpread.awayFavorites.pushes++
          trends.againstTheSpread.homeDogs.pushes++
        }
      } else if (homeATS) {
        trends.againstTheSpread.homeTeams.wins++
        trends.againstTheSpread.awayTeams.losses++
        if (homeFavorite) {
          trends.againstTheSpread.favorites.wins++
          trends.againstTheSpread.dogs.losses++
          trends.againstTheSpread.homeFavorites.wins++
          trends.againstTheSpread.awayDogs.losses++
        } else {
          trends.againstTheSpread.favorites.losses++
          trends.againstTheSpread.dogs.wins++
          trends.againstTheSpread.awayFavorites.losses++
          trends.againstTheSpread.homeDogs.wins++
        }
      } else if (awayATS) {
        trends.againstTheSpread.awayTeams.wins++
        trends.againstTheSpread.homeTeams.losses++
        if (homeFavorite) {
          trends.againstTheSpread.favorites.losses++
          trends.againstTheSpread.dogs.wins++
          trends.againstTheSpread.homeFavorites.losses++
          trends.againstTheSpread.awayDogs.wins++
        } else {
          trends.againstTheSpread.favorites.wins++
          trends.againstTheSpread.dogs.losses++
          trends.againstTheSpread.awayFavorites.wins++
          trends.againstTheSpread.homeDogs.losses++
        }
      }

      // Over/Under trends
      if (overUnder && overUnder > 0) {
        const isOvertime = game.periods && game.periods > 4
        const overHit = totalScore > overUnder
        const underHit = totalScore < overUnder
        const ouPush = Math.abs(totalScore - overUnder) < 0.5

        if (ouPush) {
          trends.overUnder.allGames.pushes++
          if (isOvertime) {
            trends.overUnder.overtimeGames.pushes++
          } else {
            trends.overUnder.nonOvertimeGames.pushes++
          }
        } else if (overHit) {
          trends.overUnder.allGames.overs++
          if (isOvertime) {
            trends.overUnder.overtimeGames.overs++
          } else {
            trends.overUnder.nonOvertimeGames.overs++
          }
        } else {
          trends.overUnder.allGames.unders++
          if (isOvertime) {
            trends.overUnder.overtimeGames.unders++
          } else {
            trends.overUnder.nonOvertimeGames.unders++
          }
        }
      }

      // Spread range analysis
      const absSpread = Math.abs(spread)
      let spreadCategory: 'small' | 'medium' | 'large' | 'huge'
      
      if (absSpread <= 3) spreadCategory = 'small'
      else if (absSpread <= 7) spreadCategory = 'medium'
      else if (absSpread <= 14) spreadCategory = 'large'
      else spreadCategory = 'huge'

      trends.spreadRanges[spreadCategory].games++
      if ((homeFavorite && homeWin) || (!homeFavorite && awayWin)) {
        trends.spreadRanges[spreadCategory].favWins++
      } else {
        trends.spreadRanges[spreadCategory].dogWins++
      }

      // Situational analysis
      if (margin >= 21) {
        trends.situational.blowouts.games++
        if (totalScore > overUnder) {
          trends.situational.blowouts.overs++
        } else {
          trends.situational.blowouts.unders++
        }
      }
    }
  })

  // Calculate percentages
  Object.keys(trends.straightUp).forEach(key => {
    const category = trends.straightUp[key as keyof typeof trends.straightUp]
    const total = category.wins + category.losses + category.ties
    category.percentage = total > 0 ? Math.round((category.wins / total) * 100) : 0
  })

  Object.keys(trends.againstTheSpread).forEach(key => {
    const category = trends.againstTheSpread[key as keyof typeof trends.againstTheSpread] 
    const total = category.wins + category.losses + category.pushes
    category.percentage = total > 0 ? Math.round((category.wins / total) * 100) : 0
  })

  // Over/Under percentages
  Object.keys(trends.overUnder).forEach(key => {
    const category = trends.overUnder[key as keyof typeof trends.overUnder]
    const total = category.overs + category.unders + category.pushes
    category.overPercentage = total > 0 ? Math.round((category.overs / total) * 100) : 0
    category.underPercentage = total > 0 ? Math.round((category.unders / total) * 100) : 0
  })

  // Spread ranges percentages
  Object.keys(trends.spreadRanges).forEach(key => {
    const category = trends.spreadRanges[key as keyof typeof trends.spreadRanges]
    if (category.games > 0) {
      category.favPercentage = Math.round((category.favWins / category.games) * 100)
      category.dogPercentage = Math.round((category.dogWins / category.games) * 100)
    }
  })

  return trends
}