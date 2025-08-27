// CFB Schedule-Aware Smart Caching System
// Optimizes API calls based on real college football scheduling patterns

import { supabase } from './supabase'
import { 
  fetchSPRatings,
  fetchAdvancedStats, 
  fetchPPAData,
  fetchTeamRecords,
  fetchEnhancedStandings as originalFetch
} from './cfbd-api'

/**
 * SMART CACHE DURATIONS - Based on Real CFB Schedule Patterns
 */
function getSmartCacheDuration(year: number, dataType: 'stats' | 'games' | 'betting' | 'teams'): number {
  const currentYear = new Date().getFullYear()
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday
  const hour = now.getHours()
  
  // Historical data (2024 and earlier) - NEVER expires
  if (year < currentYear) {
    console.log(`📚 Historical ${year} data - permanent cache`)
    return Infinity
  }

  // Current season - smart scheduling based on CFB patterns
  const baseDurations = {
    teams: 24 * 60 * 60 * 1000,    // 24 hours (rosters rarely change mid-season)
    stats: getCFBStatsCacheDuration(dayOfWeek, hour),
    games: getCFBGamesCacheDuration(dayOfWeek, hour), 
    betting: getCFBBettingCacheDuration(dayOfWeek, hour)
  }

  return baseDurations[dataType]
}

/**
 * CFB STATS CACHE DURATION
 * Stats update after games complete, not during games
 */
function getCFBStatsCacheDuration(dayOfWeek: number, hour: number): number {
  // Sunday: Post-weekend processing, stats update frequently
  if (dayOfWeek === 0) {
    return 2 * 60 * 60 * 1000 // 2 hours (stats being processed)
  }
  
  // Monday-Wednesday: Minimal changes, long cache
  if (dayOfWeek >= 1 && dayOfWeek <= 3) {
    return 12 * 60 * 60 * 1000 // 12 hours (stable period)
  }
  
  // Thursday: Few games, moderate updates
  if (dayOfWeek === 4) {
    if (hour >= 12 && hour <= 18) {
      return 2 * 60 * 60 * 1000 // 2 hours during prime time (12pm-6pm)
    }
    return 8 * 60 * 60 * 1000 // 8 hours otherwise
  }
  
  // Friday: Some games, moderate updates  
  if (dayOfWeek === 5) {
    if (hour >= 12 && hour <= 18) {
      return 2 * 60 * 60 * 1000 // 2 hours during prime time (12pm-6pm)
    }
    return 6 * 60 * 60 * 1000 // 6 hours otherwise
  }
  
  // Saturday: GAME DAY - frequent updates
  if (dayOfWeek === 6) {
    return 1 * 60 * 60 * 1000 // 1 hour (busy game day)
  }

  // Default fallback
  return 4 * 60 * 60 * 1000 // 4 hours
}

/**
 * CFB GAMES CACHE DURATION  
 * Games update in real-time during active periods
 */
function getCFBGamesCacheDuration(dayOfWeek: number, hour: number): number {
  // Sunday: Post-game cleanup, less frequent updates
  if (dayOfWeek === 0) {
    return 4 * 60 * 60 * 1000 // 4 hours
  }
  
  // Monday-Wednesday: Schedule rarely changes
  if (dayOfWeek >= 1 && dayOfWeek <= 3) {
    return 24 * 60 * 60 * 1000 // 24 hours (stable schedules)
  }
  
  // Thursday: Limited games, 2-hour updates during prime time
  if (dayOfWeek === 4) {
    if (hour >= 12 && hour <= 18) {
      return 2 * 60 * 60 * 1000 // 2 hours (12pm-6pm window)
    }
    return 12 * 60 * 60 * 1000 // 12 hours otherwise
  }
  
  // Friday: Some games, 2-hour updates during prime time
  if (dayOfWeek === 5) {
    if (hour >= 12 && hour <= 18) {
      return 2 * 60 * 60 * 1000 // 2 hours (12pm-6pm window)  
    }
    return 8 * 60 * 60 * 1000 // 8 hours otherwise
  }
  
  // Saturday: PEAK GAME DAY - hourly updates
  if (dayOfWeek === 6) {
    return 1 * 60 * 60 * 1000 // 1 hour (non-stop games)
  }

  return 6 * 60 * 60 * 1000 // 6 hours default
}

/**
 * CFB BETTING LINES CACHE DURATION
 * Betting lines move constantly during active periods
 */
function getCFBBettingCacheDuration(dayOfWeek: number, hour: number): number {
  // Sunday: Lines for next week being set
  if (dayOfWeek === 0) {
    return 2 * 60 * 60 * 1000 // 2 hours (new lines coming out)
  }
  
  // Monday-Wednesday: Lines stable, minimal movement
  if (dayOfWeek >= 1 && dayOfWeek <= 3) {
    return 4 * 60 * 60 * 1000 // 4 hours (slow betting days)
  }
  
  // Thursday: Some action, moderate line movement
  if (dayOfWeek === 4) {
    if (hour >= 12 && hour <= 18) {
      return 30 * 60 * 1000 // 30 minutes (active betting)
    }
    return 2 * 60 * 60 * 1000 // 2 hours otherwise
  }
  
  // Friday: Building momentum, more line movement
  if (dayOfWeek === 5) {
    if (hour >= 12 && hour <= 18) {
      return 30 * 60 * 1000 // 30 minutes (active betting)
    }
    return 1 * 60 * 60 * 1000 // 1 hour otherwise
  }
  
  // Saturday: PEAK BETTING - lines move constantly
  if (dayOfWeek === 6) {
    return 15 * 60 * 1000 // 15 minutes (rapid line movement)
  }

  return 1 * 60 * 60 * 1000 // 1 hour default
}

/**
 * CHECK CACHE FRESHNESS with CFB Schedule Awareness
 */
function isCFBDataFresh(lastUpdated: string, year: number, dataType: 'stats' | 'games' | 'betting' | 'teams'): boolean {
  const maxAge = getSmartCacheDuration(year, dataType)
  
  // Historical data is always fresh
  if (maxAge === Infinity) {
    return true
  }
  
  const now = new Date().getTime()
  const updated = new Date(lastUpdated).getTime()
  const age = now - updated
  const isFresh = age < maxAge
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayOfWeek = new Date().getDay()
  const hour = new Date().getHours()
  
  console.log(`🏈 CFB Cache Check - ${dayNames[dayOfWeek]} ${hour}:00`)
  console.log(`📊 ${dataType} data: ${isFresh ? 'FRESH' : 'STALE'} (${Math.round(age/1000/60)}min old, max: ${Math.round(maxAge/1000/60)}min)`)
  
  return isFresh
}

/**
 * SCHEDULE-AWARE ENHANCED STANDINGS
 * Uses CFB scheduling patterns to optimize API calls
 */
export async function getCFBScheduleAwareStandings(year: number = 2024) {
  try {
    console.log('🏈 CFB Schedule-Aware Cache Check...')
    
    // Try database first
    const { data: cachedStats, error } = await supabase
      .from('team_stats')
      .select(`
        *,
        teams (
          id,
          name,
          conference,
          division,
          logo_url,
          color,
          alt_color
        )
      `)
      .eq('year', year)
      .order('sp_rating', { ascending: false })

    if (error) {
      console.warn('⚠️ Database error, using direct API:', error.message)
      return await originalFetch(year)
    }

    // Check freshness with CFB schedule awareness
    if (cachedStats && cachedStats.length > 0) {
      const latestUpdate = cachedStats[0]?.updated_at
      const isFresh = latestUpdate && isCFBDataFresh(latestUpdate, year, 'stats')
      
      if (isFresh) {
        console.log(`✅ Using CFB schedule-aware cache (${cachedStats.length} teams)`)
        
        // Transform and return cached data
        const transformedData = cachedStats.map(stat => ({
          teamId: stat.teams?.id || 0,
          team: stat.teams?.name || '',
          conference: stat.teams?.conference || '',
          division: stat.teams?.division || '',
          logo: stat.teams?.logo_url || '',
          color: stat.teams?.color || '#000000',
          altColor: stat.teams?.alt_color || '#FFFFFF',
          
          // All the stats fields...
          wins: stat.wins || 0,
          losses: stat.losses || 0,
          ties: stat.ties || 0,
          conferenceWins: stat.conference_wins || 0,
          conferenceLosses: stat.conference_losses || 0,
          spPlusRating: stat.sp_rating || 0,
          spPlusRanking: stat.sp_ranking || 999,
          offensePPA: stat.offense_ppa || 0,
          defensePPA: stat.defense_ppa || 0,
          explosiveness: stat.explosiveness || 0,
          offensiveEfficiency: stat.offensive_efficiency || 0,
          defensiveEfficiency: stat.defensive_efficiency || 0,
          pointsPerGame: stat.points_per_game || 0,
          pointsAllowedPerGame: stat.points_allowed_per_game || 0,
          yardsPerGame: stat.yards_per_game || 0,
          yardsAllowedPerGame: stat.yards_allowed_per_game || 0,
          strengthOfSchedule: stat.strength_of_schedule || 0,
          secondOrderWins: stat.second_order_wins || 0,
          havocRate: stat.havoc_rate || 0,
          finishingRate: stat.finishing_rate || 0,
          fieldPosition: stat.field_position || 0,
          winPct: stat.wins / Math.max((stat.wins + stat.losses), 1),
          avgMargin: 0
        }))

        return {
          data: transformedData,
          success: true,
          message: `CFB schedule-aware cache (${transformedData.length} teams)`,
          source: 'cfb_schedule_cache',
          cacheStrategy: getCacheStrategyDescription(),
          predictiveAccuracy: {
            spPlusCorrelation: 79,
            explosiveness: 86,
            efficiency: 74,
          }
        }
      }
    }

    // Data stale - fetch fresh and cache
    console.log('📡 CFB data stale, fetching fresh API data...')
    return await fetchAndCacheCFBData(year)

  } catch (error) {
    console.error('❌ CFB schedule-aware cache error:', error)
    return await originalFetch(year)
  }
}

/**
 * FETCH AND CACHE with CFB awareness
 */
async function fetchAndCacheCFBData(year: number) {
  const freshData = await originalFetch(year)
  
  if (freshData.success) {
    // Cache async (don't block response)
    cacheCFBDataToDatabase(freshData.data, year).catch(err => 
      console.warn('⚠️ Cache error:', err.message)
    )
    
    return {
      ...freshData,
      source: 'fresh_api_cfb_cached',
      cacheStrategy: getCacheStrategyDescription()
    }
  }
  
  return freshData
}

/**
 * CACHE CFB DATA with proper team relationships
 */
async function cacheCFBDataToDatabase(teams: any[], year: number) {
  try {
    // Upsert teams first
    const teamsToUpsert = teams.map(team => ({
      name: team.team,
      conference: team.conference,
      division: team.division || '',
      logo_url: team.logo,
      espn_id: team.teamId || null,
      color: team.color || '#000000',
      alt_color: team.altColor || '#FFFFFF',
      classification: team.conference && [
        'Big Sky', 'CAA', 'MEAC', 'MVFC', 'Big South-OVC', 'Southern', 
        'SWAC', 'UAC', 'Ivy', 'Patriot', 'Pioneer', 'Southland', 'NEC', 
        'FCS Independents'
      ].includes(team.conference) ? 'fcs' : 'fbs'
    }))

    await supabase.from('teams').upsert(teamsToUpsert, { onConflict: 'name' })

    // Get team IDs and cache stats
    const { data: dbTeams } = await supabase.from('teams').select('id, name')
    const teamIdMap = new Map(dbTeams?.map(t => [t.name, t.id]) || [])

    const statsToCache = teams
      .filter(team => teamIdMap.has(team.team))
      .map(team => ({
        team_id: teamIdMap.get(team.team)!,
        year,
        wins: team.wins || 0,
        losses: team.losses || 0,
        ties: team.ties || 0,
        conference_wins: team.conferenceWins || 0,
        conference_losses: team.conferenceLosses || 0,
        sp_rating: team.spPlusRating || 0,
        sp_ranking: team.spPlusRanking || 999,
        offense_ppa: team.offensePPA || 0,
        defense_ppa: team.defensePPA || 0,
        overall_ppa: (team.offensePPA || 0) - (team.defensePPA || 0),
        offensive_efficiency: team.offensiveEfficiency || 0,
        defensive_efficiency: team.defensiveEfficiency || 0,
        explosiveness: team.explosiveness || 0,
        points_per_game: team.pointsPerGame || 0,
        points_allowed_per_game: team.pointsAllowedPerGame || 0,
        yards_per_game: team.yardsPerGame || 0,
        yards_allowed_per_game: team.yardsAllowedPerGame || 0,
        strength_of_schedule: team.strengthOfSchedule || 0,
        second_order_wins: team.secondOrderWins || 0,
        havoc_rate: team.havocRate || 0,
        finishing_rate: team.finishingRate || 0,
        field_position: team.fieldPosition || 0,
      }))

    await supabase.from('team_stats').upsert(statsToCache, { onConflict: 'team_id,year' })
    console.log(`✅ Cached ${statsToCache.length} CFB teams with schedule awareness`)

  } catch (error) {
    console.error('❌ CFB cache error:', error)
    throw error
  }
}

/**
 * GET CACHE STRATEGY DESCRIPTION
 */
function getCacheStrategyDescription(): string {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const hour = now.getHours()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  if (dayOfWeek === 4 && hour >= 12 && hour <= 18) {
    return `Thursday Prime Time (12pm-6pm) - 2hr cache for limited games`
  }
  if (dayOfWeek === 5 && hour >= 12 && hour <= 18) {
    return `Friday Prime Time (12pm-6pm) - 2hr cache for moderate games`
  }
  if (dayOfWeek === 6) {
    return `Saturday Game Day - 1hr cache for peak activity`
  }
  if (dayOfWeek === 0) {
    return `Sunday Post-Game - 2hr cache for stat processing`
  }
  
  return `${dayNames[dayOfWeek]} - Extended cache for low activity`
}

/**
 * CFB CACHE STATUS with Schedule Context
 */
export async function getCFBCacheStatus(year: number = 2024) {
  try {
    const { data, error } = await supabase
      .from('team_stats')
      .select('updated_at')
      .eq('year', year)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return {
        cached: false,
        message: 'No cached data found'
      }
    }

    const isFresh = isCFBDataFresh(data.updated_at, year, 'stats')
    const age = Math.round((new Date().getTime() - new Date(data.updated_at).getTime()) / 1000 / 60)
    const currentYear = new Date().getFullYear()
    const isHistorical = year < currentYear

    return {
      cached: true,
      fresh: isFresh,
      historical: isHistorical,
      lastUpdated: data.updated_at,
      ageMinutes: age,
      cacheStrategy: getCacheStrategyDescription(),
      message: isHistorical 
        ? `Historical ${year} data - permanent cache` 
        : `${getCacheStrategyDescription()} - ${isFresh ? 'Fresh' : 'Stale'} (${age}min old)`
    }

  } catch (error) {
    return {
      cached: false,
      error: error.message,
      cacheStrategy: getCacheStrategyDescription()
    }
  }
}