// CORRECTED College Football Betting Trends API
// This file contains the fixed calculateBettingTrends function that addresses
// the issues causing all 0s in wins/losses display
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
      game.completed && game.homeScore !== null && game.awayScore !== null
    )

    if (conference !== 'All') {
      filteredGames = filteredGames.filter((game: any) => 
        game.homeConference === conference || game.awayConference === conference
      )
    }

    console.log(`🎯 Processing ${filteredGames.length} completed games...`)

    // Calculate betting trends using corrected function
    const trends = calculateBettingTrendsCorrected(filteredGames, linesMap)

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
        dataSource: 'CFBD API',
        fixes: 'Applied corrected calculation logic - v2.0'
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

/**
 * CORRECTED BETTING TRENDS CALCULATION FUNCTION
 * 
 * Key fixes implemented:
 * 1. Process ALL games for straight up trends (not just games with betting lines)
 * 2. Correct ATS calculation with proper spread interpretation
 * 3. Fixed favorite/dog identification and tracking
 * 4. Proper push detection for exact spreads
 * 5. Correct tie handling in all scenarios
 * 6. Enhanced data validation and edge case handling
 */
function calculateBettingTrendsCorrected(games: any[], linesMap: Map<string, any>) {
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
    
    const homeScore = game.homeScore
    const awayScore = game.awayScore
    const homeWin = homeScore > awayScore
    const awayWin = awayScore > homeScore
    const tie = homeScore === awayScore
    const totalScore = homeScore + awayScore
    const margin = Math.abs(homeScore - awayScore)
    
    // CRITICAL FIX: Process ALL games for straight up trends (not just games with betting lines)
    if (homeWin) {
      trends.straightUp.homeTeams.wins++
      trends.straightUp.awayTeams.losses++
    } else if (awayWin) {
      trends.straightUp.awayTeams.wins++
      trends.straightUp.homeTeams.losses++
    } else if (tie) {
      trends.straightUp.homeTeams.ties++
      trends.straightUp.awayTeams.ties++
    }

    // Process betting lines if available
    if (line && line.spread !== undefined && line.spread !== null) {
      const spread = parseFloat(line.spread)
      const overUnder = line.overUnder ? parseFloat(line.overUnder) : null
      
      // Validate data integrity
      if (isNaN(spread) || homeScore === null || awayScore === null) {
        return // Skip invalid data
      }
      
      // CORRECTED: Proper spread interpretation
      // Negative spread = home team favored by that amount
      // Positive spread = away team favored by that amount  
      // Zero spread = pick'em (no favorite/dog)
      const homeFavorite = spread < 0
      const awayFavorite = spread > 0
      const pickEm = spread === 0
      
      // CORRECTED: ATS calculations with proper spread logic
      let homeATS = false
      let awayATS = false
      let push = false
      
      if (pickEm) {
        // Pick'em game - straight up winner covers, tie is push
        if (tie) {
          push = true
        } else if (homeWin) {
          homeATS = true
        } else {
          awayATS = true
        }
      } else {
        // Games with spread
        if (homeFavorite) {
          // Home team favored - they need to win by MORE than |spread|
          const requiredMargin = Math.abs(spread)
          const actualMargin = homeScore - awayScore
          
          if (actualMargin > requiredMargin) {
            homeATS = true // Home covers
          } else if (actualMargin === requiredMargin) {
            push = true // Exact push
          } else {
            awayATS = true // Away covers
          }
        } else { // awayFavorite
          // Away team favored - they need to win by MORE than spread
          const requiredMargin = spread
          const actualMargin = awayScore - homeScore
          
          if (actualMargin > requiredMargin) {
            awayATS = true // Away covers
          } else if (actualMargin === requiredMargin) {
            push = true // Exact push
          } else {
            homeATS = true // Home covers
          }
        }
      }

      // CORRECTED: Track straight up favorite/dog results (only for non-pick'em games)
      if (homeFavorite) {
        // Home team is favorite
        if (homeWin) {
          trends.straightUp.favorites.wins++
          trends.straightUp.homeFavorites.wins++
          trends.straightUp.dogs.losses++
          trends.straightUp.awayDogs.losses++
        } else if (awayWin) {
          trends.straightUp.favorites.losses++
          trends.straightUp.homeFavorites.losses++
          trends.straightUp.dogs.wins++
          trends.straightUp.awayDogs.wins++
        } else if (tie) {
          trends.straightUp.favorites.ties++
          trends.straightUp.homeFavorites.ties++
          trends.straightUp.dogs.ties++
          trends.straightUp.awayDogs.ties++
        }
      } else if (awayFavorite) {
        // Away team is favorite
        if (awayWin) {
          trends.straightUp.favorites.wins++
          trends.straightUp.awayFavorites.wins++
          trends.straightUp.dogs.losses++
          trends.straightUp.homeDogs.losses++
        } else if (homeWin) {
          trends.straightUp.favorites.losses++
          trends.straightUp.awayFavorites.losses++
          trends.straightUp.dogs.wins++
          trends.straightUp.homeDogs.wins++
        } else if (tie) {
          trends.straightUp.favorites.ties++
          trends.straightUp.awayFavorites.ties++
          trends.straightUp.dogs.ties++
          trends.straightUp.homeDogs.ties++
        }
      }
      // Pick'em games don't contribute to favorite/dog stats

      // CORRECTED: Track ATS results with proper favorite/dog assignment
      if (push) {
        trends.againstTheSpread.homeTeams.pushes++
        trends.againstTheSpread.awayTeams.pushes++
        
        if (homeFavorite) {
          trends.againstTheSpread.favorites.pushes++
          trends.againstTheSpread.homeFavorites.pushes++
          trends.againstTheSpread.dogs.pushes++
          trends.againstTheSpread.awayDogs.pushes++
        } else if (awayFavorite) {
          trends.againstTheSpread.favorites.pushes++
          trends.againstTheSpread.awayFavorites.pushes++
          trends.againstTheSpread.dogs.pushes++
          trends.againstTheSpread.homeDogs.pushes++
        }
      } else if (homeATS) {
        trends.againstTheSpread.homeTeams.wins++
        trends.againstTheSpread.awayTeams.losses++
        
        if (homeFavorite) {
          // Home favorite covers
          trends.againstTheSpread.favorites.wins++
          trends.againstTheSpread.homeFavorites.wins++
          trends.againstTheSpread.dogs.losses++
          trends.againstTheSpread.awayDogs.losses++
        } else if (awayFavorite) {
          // Home underdog covers
          trends.againstTheSpread.dogs.wins++
          trends.againstTheSpread.homeDogs.wins++
          trends.againstTheSpread.favorites.losses++
          trends.againstTheSpread.awayFavorites.losses++
        }
      } else if (awayATS) {
        trends.againstTheSpread.awayTeams.wins++
        trends.againstTheSpread.homeTeams.losses++
        
        if (awayFavorite) {
          // Away favorite covers
          trends.againstTheSpread.favorites.wins++
          trends.againstTheSpread.awayFavorites.wins++
          trends.againstTheSpread.dogs.losses++
          trends.againstTheSpread.homeDogs.losses++
        } else if (homeFavorite) {
          // Away underdog covers
          trends.againstTheSpread.dogs.wins++
          trends.againstTheSpread.awayDogs.wins++
          trends.againstTheSpread.favorites.losses++
          trends.againstTheSpread.homeFavorites.losses++
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
      
      if (!pickEm) {
        if ((homeFavorite && homeWin) || (awayFavorite && awayWin)) {
          trends.spreadRanges[spreadCategory].favWins++
        } else if ((homeFavorite && awayWin) || (awayFavorite && homeWin)) {
          trends.spreadRanges[spreadCategory].dogWins++
        }
        // Ties don't count for spread range win/loss analysis
      }

      // Situational analysis
      if (margin >= 21) {
        trends.situational.blowouts.games++
        if (overUnder) {
          if (totalScore > overUnder) {
            trends.situational.blowouts.overs++
          } else {
            trends.situational.blowouts.unders++
          }
        }
      }
    }
  })

  // Calculate percentages for all categories
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

  // Situational percentages
  if (trends.situational.blowouts.games > 0) {
    const blowoutTotal = trends.situational.blowouts.overs + trends.situational.blowouts.unders
    trends.situational.blowouts.overPercentage = blowoutTotal > 0 ? 
      Math.round((trends.situational.blowouts.overs / blowoutTotal) * 100) : 0
  }

  return trends
}