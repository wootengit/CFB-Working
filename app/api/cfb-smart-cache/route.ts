// CFB Schedule-Aware Smart Cache API
// Intelligently caches based on real college football scheduling patterns
// 🏈 Thursday/Friday: 2hr cache 12pm-6pm, longer otherwise
// 🏈 Saturday: 1hr cache (game day peak)
// 🏈 Sunday: 2hr cache (post-game processing) 
// 🏈 Mon-Wed: Long cache (quiet days)

import { NextRequest, NextResponse } from 'next/server'
import { getCFBScheduleAwareStandings, getCFBCacheStatus } from '@/lib/cfb-schedule-aware-cache'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = parseInt(searchParams.get('year') || '2024')
  const statusOnly = searchParams.get('status') === 'true'

  try {
    // Return cache status with CFB schedule context
    if (statusOnly) {
      const cacheStatus = await getCFBCacheStatus(year)
      
      return NextResponse.json({
        success: true,
        cache: cacheStatus,
        year,
        cfbScheduleContext: getCFBScheduleContext()
      })
    }

    console.log(`🏈 CFB Smart Cache API - Year: ${year}`)
    
    const startTime = Date.now()
    
    // Get data using CFB schedule-aware caching
    const standings = await getCFBScheduleAwareStandings(year)
    
    const endTime = Date.now()
    const responseTime = endTime - startTime

    console.log(`⚡ CFB Response: ${responseTime}ms`)
    console.log(`🏈 Teams: ${standings.data?.length || 0}`)
    console.log(`📊 Source: ${standings.source || 'unknown'}`)
    console.log(`🕐 Strategy: ${standings.cacheStrategy || 'default'}`)

    return NextResponse.json({
      ...standings,
      meta: {
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString(),
        year,
        source: standings.source || 'cfb_smart_cache',
        cacheStrategy: standings.cacheStrategy || 'CFB schedule-aware',
        cfbScheduleContext: getCFBScheduleContext()
      }
    })

  } catch (error) {
    console.error('❌ CFB Smart Cache Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: [],
      meta: {
        timestamp: new Date().toISOString(),
        year,
        cfbScheduleContext: getCFBScheduleContext()
      }
    }, { 
      status: 500 
    })
  }
}

/**
 * GET CFB SCHEDULE CONTEXT
 * Provides context about current CFB scheduling patterns
 */
function getCFBScheduleContext() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const hour = now.getHours()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  let gameActivity = 'Low'
  let expectedUpdates = 'Minimal'
  let optimalCaching = '12+ hours'
  
  // Thursday
  if (dayOfWeek === 4) {
    if (hour >= 12 && hour <= 18) {
      gameActivity = 'Moderate'
      expectedUpdates = 'Some games'
      optimalCaching = '2 hours (prime time)'
    } else {
      gameActivity = 'Low'
      expectedUpdates = 'Few games'
      optimalCaching = '8 hours'
    }
  }
  
  // Friday
  else if (dayOfWeek === 5) {
    if (hour >= 12 && hour <= 18) {
      gameActivity = 'Moderate'
      expectedUpdates = 'Several games'
      optimalCaching = '2 hours (prime time)'
    } else {
      gameActivity = 'Low-Moderate'
      expectedUpdates = 'Some games'
      optimalCaching = '6 hours'
    }
  }
  
  // Saturday
  else if (dayOfWeek === 6) {
    gameActivity = 'PEAK'
    expectedUpdates = 'Constant games'
    optimalCaching = '1 hour (game day)'
  }
  
  // Sunday
  else if (dayOfWeek === 0) {
    gameActivity = 'Post-Game'
    expectedUpdates = 'Stats processing'
    optimalCaching = '2 hours'
  }
  
  // Monday-Wednesday
  else if (dayOfWeek >= 1 && dayOfWeek <= 3) {
    gameActivity = 'Very Low'
    expectedUpdates = 'Rare'
    optimalCaching = '12+ hours'
  }

  return {
    currentDay: dayNames[dayOfWeek],
    currentHour: hour,
    gameActivity,
    expectedUpdates,
    optimalCaching,
    isPrimeTime: (dayOfWeek === 4 || dayOfWeek === 5) && hour >= 12 && hour <= 18,
    isGameDay: dayOfWeek === 6,
    isPostGame: dayOfWeek === 0,
    isQuietPeriod: dayOfWeek >= 1 && dayOfWeek <= 3
  }
}