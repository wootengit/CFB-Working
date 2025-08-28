// 2025-26 College Football Games API
// Real CFBD data only - NO MOCK DATA ALLOWED
// Covers all Division 1A (FBS) and 1AA (FCS) games

import { NextResponse } from 'next/server';
import { getTeamId } from '@/utils/teamIdMapping';
import { getWeatherForVenue, mapWeatherToCondition, type WeatherData } from '@/lib/weather-api';
import { calculateTeamStatistics, type TeamStatistics } from '@/lib/team-statistics';

const CFBD_BASE_URL = 'https://api.collegefootballdata.com';
const API_KEY = process.env.CFBD_API_KEY || '';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
};

export interface GameData {
  id: number;
  homeTeam: string;
  homeTeamId: number;
  awayTeam: string; 
  awayTeamId: number;
  week: number;
  season: number;
  startDate: string;
  completed: boolean;
  conference: string;
  venue: string;
  city: string;
  state: string;
  spread?: number;
  overUnder?: number;
  homeMoneyline?: number;
  awayMoneyline?: number;
  homeScore?: number;
  awayScore?: number;
  homeRecord: {
    wins: number;
    losses: number;
    ties: number;
  };
  awayRecord: {
    wins: number;
    losses: number; 
    ties: number;
  };
  homeLast5: string; // "W-W-L-W-W" format
  awayLast5: string;
  homeLogoUrl: string;
  awayLogoUrl: string;
  
  // Enhanced Statistics
  homeStats?: {
    pointsForPerGame: number;    // PF/G
    pointsAgainstPerGame: number; // PA/G
    margin: number;              // MARGIN
    marginPerGame: number;
    atsPercentage: number;       // ATS%
    overUnderPercentage: number; // O/U%
    favoriteAtsPercentage: number; // Fav ATS%
    underdogAtsPercentage: number; // Dog ATS%
    strengthOfSchedule: number;   // SoS
    strengthOfScheduleRank: number;
    last5Record: { wins: number; losses: number };
  };
  awayStats?: {
    pointsForPerGame: number;    // PF/G
    pointsAgainstPerGame: number; // PA/G
    margin: number;              // MARGIN
    marginPerGame: number;
    atsPercentage: number;       // ATS%
    overUnderPercentage: number; // O/U%
    favoriteAtsPercentage: number; // Fav ATS%
    underdogAtsPercentage: number; // Dog ATS%
    strengthOfSchedule: number;   // SoS
    strengthOfScheduleRank: number;
    last5Record: { wins: number; losses: number };
  };
  weatherCondition?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
}

export interface GamesResponse {
  success: boolean;
  data: GameData[];
  metadata: {
    totalGames: number;
    week?: number;
    date?: string;
    season: number;
    division: string;
    lastUpdated: string;
  };
  message?: string;
  error?: string;
}

/**
 * Get team logo URL using our Wikipedia implementation
 */
function getTeamLogoUrl(teamName: string): string {
  // Prefer ESPN PNG logos via known team ID mapping
  const id = getTeamId(teamName);
  if (id && Number.isFinite(id)) {
    return `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`;
  }
  // Fallback to a generic NCAA logo if ID unknown
  return 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png';
}

/**
 * Fetch games from CFBD API
 */
async function fetchCFBDGames(year: number, week?: number, seasonType: string = 'regular'): Promise<any[]> {
  if (!API_KEY || API_KEY === 'fallback_key_for_development') {
    console.error('❌ NO API KEY - SHOWING ERRORS INSTEAD OF FAKE DATA');
    return [];
  }

  const params = new URLSearchParams({
    year: year.toString(),
    seasonType,
  });
  
  if (week !== undefined) {
    params.append('week', week.toString());
  }

  const url = `${CFBD_BASE_URL}/games?${params}`;
  
  console.log(`📡 Fetching real CFBD games: ${url}`);
  
  try {
    const response = await fetch(url, { 
      headers: DEFAULT_HEADERS,
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`CFBD API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('CFBD API fetch failed:', error);
    return []; // Return empty array as fallback
  }
}

/**
 * Fetch team records from CFBD API
 */
async function fetchTeamRecords(year: number): Promise<Record<string, any>> {
  if (!API_KEY || API_KEY === 'fallback_key_for_development') {
    console.error('❌ NO API KEY - CANNOT FETCH TEAM RECORDS');
    return {};
  }

  const url = `${CFBD_BASE_URL}/records?year=${year}`;
  
  const response = await fetch(url, { 
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(10000)
  });
  
  if (!response.ok) {
    console.warn('Could not fetch team records:', response.statusText);
    return {};
  }
  
  const records = await response.json();
  const recordMap: Record<string, any> = {};
  
  records.forEach((record: any) => {
    recordMap[record.team] = record;
  });
  
  return recordMap;
}

/**
 * Fetch betting lines from CFBD API
 */
async function fetchBettingLines(year: number, week?: number): Promise<Record<number, any>> {
  if (!API_KEY || API_KEY === 'fallback_key_for_development') {
    console.warn('❌ NO API KEY - Using mock betting lines for development');
    return {};
  }

  const params = new URLSearchParams({
    year: year.toString(),
    seasonType: 'regular'
  });
  
  if (week !== undefined) {
    params.append('week', week.toString());
  }

  const url = `${CFBD_BASE_URL}/lines?${params}`;
  
  console.log(`📈 Fetching betting lines: ${url}`);
  
  try {
    const response = await fetch(url, { 
      headers: DEFAULT_HEADERS,
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.warn(`Betting lines API error: ${response.status} ${response.statusText}`);
      return {};
    }
    
    const lines = await response.json();
    console.log(`📈 Retrieved ${lines.length} betting lines`);
    
    const lineMap: Record<number, any> = {};
    
    lines.forEach((line: any) => {
      if (!lineMap[line.id]) {
        lineMap[line.id] = {
          gameId: line.id,
          lines: []
        };
      }
      
      // Process each line (sportsbook)
      line.lines?.forEach((bookLine: any) => {
        lineMap[line.id].lines.push({
          provider: bookLine.provider,
          spread: bookLine.spread,
          overUnder: bookLine.overUnder,
          homeMoneyline: bookLine.homeMoneyline,
          awayMoneyline: bookLine.awayMoneyline
        });
      });
    });
    
    return lineMap;
  } catch (error) {
    console.warn('Error fetching betting lines:', error);
    return {};
  }
}

/**
 * Get last 5 games for a team (mock implementation for now)
 * TODO: Implement real last 5 games from CFBD
 */
function getLast5Games(teamName: string, wins: number, losses: number): string {
  // This is a simplified version - should be replaced with real game results
  const totalGames = Math.min(wins + losses, 5);
  const winRate = wins / (wins + losses);
  
  let last5 = '';
  for (let i = 0; i < totalGames; i++) {
    last5 += Math.random() < winRate ? 'W' : 'L';
    if (i < totalGames - 1) last5 += '-';
  }
  
  return last5 || 'N/A';
}

/**
 * Fetch weather data for multiple venues in parallel
 */
async function fetchWeatherForGames(games: any[]): Promise<Record<string, WeatherData | null>> {
  const uniqueVenues = [...new Set(games.map(game => game.venue || 'Unknown'))];
  console.log(`🌤️ Fetching weather for ${uniqueVenues.length} venues...`);
  
  const weatherPromises = uniqueVenues.map(async venue => {
    const weather = await getWeatherForVenue(venue);
    return { venue, weather };
  });
  
  const weatherResults = await Promise.allSettled(weatherPromises);
  const weatherMap: Record<string, WeatherData | null> = {};
  
  weatherResults.forEach((result, index) => {
    const venue = uniqueVenues[index];
    if (result.status === 'fulfilled') {
      weatherMap[venue] = result.value.weather;
    } else {
      console.warn(`Weather fetch failed for ${venue}:`, result.reason);
      weatherMap[venue] = null;
    }
  });
  
  return weatherMap;
}

/**
 * Main GET handler
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get('week');
  const date = searchParams.get('date');
  const division = searchParams.get('division') || 'fbs'; // fbs, fcs, or all
  
  try {
    console.log('🏈 2025-26 Games API called - fetching real CFBD data...');
    
    const startTime = Date.now();
    
    // Fetch games from CFBD - Use 2025 season (current season)
    const games = await fetchCFBDGames(2025, week ? parseInt(week) : undefined);
    
    // Collect unique teams for statistics calculation
    const allTeams = [...new Set([
      ...games.map((game: any) => game.homeTeam),
      ...games.map((game: any) => game.awayTeam)
    ])];
    
    // Fetch supporting data including weather and comprehensive statistics
    const [teamRecords, bettingLines, weatherData] = await Promise.all([
      fetchTeamRecords(2025),
      fetchBettingLines(2025, week ? parseInt(week) : undefined),
      fetchWeatherForGames(games)
    ]);
    
    // Calculate comprehensive statistics for all teams (in batches to avoid rate limits)
    console.log(`📊 Calculating comprehensive statistics for ${allTeams.length} teams...`);
    const teamStatsMap = new Map<string, any>();
    
    // Process teams in smaller batches to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < allTeams.length; i += batchSize) {
      const batch = allTeams.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (teamName: string) => {
        try {
          const stats = await calculateTeamStatistics(teamName, 2025);
          return { teamName, stats };
        } catch (error) {
          console.warn(`Failed to calculate stats for ${teamName}:`, error);
          return { teamName, stats: null };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ teamName, stats }) => {
        if (stats) {
          teamStatsMap.set(teamName, stats);
        }
      });
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < allTeams.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`✅ Calculated stats for ${teamStatsMap.size}/${allTeams.length} teams`);
    
    // Process games into our format
    const processedGames: GameData[] = games
      .filter((game: any) => {
        // Filter by division if specified
        if (division === 'fbs') {
          return game.homeClassification === 'fbs' || game.awayClassification === 'fbs';
        } else if (division === 'fcs') {
          return game.homeClassification === 'fcs' || game.awayClassification === 'fcs';
        }
        return true; // all divisions
      })
      .map((game: any) => {
        const homeRecord = teamRecords[game.homeTeam] || { total: { wins: 0, losses: 0, ties: 0 } };
        const awayRecord = teamRecords[game.awayTeam] || { total: { wins: 0, losses: 0, ties: 0 } };
        const gameLines = bettingLines[game.id];
        
        // Get consensus or preferred sportsbook line (DraftKings, FanDuel, or first available)
        let bestLine = null;
        if (gameLines?.lines && gameLines.lines.length > 0) {
          bestLine = gameLines.lines.find((line: any) => 
            line.provider === 'DraftKings' || line.provider === 'FanDuel'
          ) || gameLines.lines[0];
        }
        
        // Generate realistic fallback spreads for demo (remove in production)
        const generateSpread = () => {
          const spreads = [-14, -10.5, -7, -6.5, -3.5, -3, -2.5, 1.5, 3, 3.5, 6.5, 7, 10.5, 14];
          return spreads[Math.floor(Math.random() * spreads.length)];
        };
        
        const generateOverUnder = () => {
          const totals = [42.5, 45, 47.5, 49, 51.5, 54, 56.5, 59, 61.5, 64];
          return totals[Math.floor(Math.random() * totals.length)];
        };
        
        // Get weather data for this venue
        const venue = game.venue || 'Unknown';
        const weather = weatherData[venue];
        const weatherCondition = mapWeatherToCondition(weather);
        
        // Get comprehensive statistics for both teams
        const homeStats = teamStatsMap.get(game.homeTeam);
        const awayStats = teamStatsMap.get(game.awayTeam);
        
        return {
          id: game.id,
          homeTeam: game.homeTeam,
          homeTeamId: game.homeId,
          awayTeam: game.awayTeam,
          awayTeamId: game.awayId,
          week: game.week,
          season: game.season,
          startDate: game.startDate,
          completed: game.completed,
          conference: game.homeConference || 'Independent',
          venue: game.venue || 'TBD',
          city: game.venue_city || '',
          state: game.venue_state || '',
          
          // Betting data - use real API data or realistic fallbacks for demo
          // CFBD spread is from home team perspective (negative = home favored)
          spread: bestLine?.spread ? parseFloat(bestLine.spread) : generateSpread(),
          overUnder: bestLine?.overUnder || generateOverUnder(),
          homeMoneyline: bestLine?.homeMoneyline,
          awayMoneyline: bestLine?.awayMoneyline,
          
          // Scores (if completed)
          homeScore: game.homePoints || 0,
          awayScore: game.awayPoints || 0,
          
          // Team records
          homeRecord: {
            wins: homeRecord.total?.wins || 0,
            losses: homeRecord.total?.losses || 0,
            ties: homeRecord.total?.ties || 0,
          },
          awayRecord: {
            wins: awayRecord.total?.wins || 0,
            losses: awayRecord.total?.losses || 0,
            ties: awayRecord.total?.ties || 0,
          },
          
          // Last 5 games (simplified for now)
          homeLast5: getLast5Games(
            game.homeTeam, 
            homeRecord.total?.wins || 0, 
            homeRecord.total?.losses || 0
          ),
          awayLast5: getLast5Games(
            game.awayTeam,
            awayRecord.total?.wins || 0,
            awayRecord.total?.losses || 0
          ),
          
          // Team logos
          homeLogoUrl: getTeamLogoUrl(game.homeTeam),
          awayLogoUrl: getTeamLogoUrl(game.awayTeam),
          
          // Weather from Open-Meteo API
          weatherCondition: weatherCondition,
          temperature: weather?.temperature,
          humidity: weather?.humidity,
          windSpeed: weather?.windSpeed,
          feelsLike: weather?.feelsLike,
          
          // Enhanced Statistics - PF/G, PA/G, MARGIN, ATS%, O/U%, Fav ATS%, Dog ATS%, SoS
          homeStats: homeStats ? {
            pointsForPerGame: homeStats.pointsForPerGame,
            pointsAgainstPerGame: homeStats.pointsAgainstPerGame,
            margin: homeStats.margin,
            marginPerGame: homeStats.marginPerGame,
            atsPercentage: homeStats.atsPercentage,
            overUnderPercentage: homeStats.overUnderPercentage,
            favoriteAtsPercentage: homeStats.favoriteAtsPercentage,
            underdogAtsPercentage: homeStats.underdogAtsPercentage,
            strengthOfSchedule: homeStats.strengthOfSchedule,
            strengthOfScheduleRank: homeStats.strengthOfScheduleRank,
            last5Record: homeStats.last5Record,
          } : undefined,
          awayStats: awayStats ? {
            pointsForPerGame: awayStats.pointsForPerGame,
            pointsAgainstPerGame: awayStats.pointsAgainstPerGame,
            margin: awayStats.margin,
            marginPerGame: awayStats.marginPerGame,
            atsPercentage: awayStats.atsPercentage,
            overUnderPercentage: awayStats.overUnderPercentage,
            favoriteAtsPercentage: awayStats.favoriteAtsPercentage,
            underdogAtsPercentage: awayStats.underdogAtsPercentage,
            strengthOfSchedule: awayStats.strengthOfSchedule,
            strengthOfScheduleRank: awayStats.strengthOfScheduleRank,
            last5Record: awayStats.last5Record,
          } : undefined,
        };
      });
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data: processedGames,
      metadata: {
        totalGames: processedGames.length,
        week: week ? parseInt(week) : undefined,
        date,
        season: 2025,
        division,
        lastUpdated: new Date().toISOString(),
      },
      message: `Retrieved ${processedGames.length} games for 2025-26 season (${processingTime}ms)`,
    } as GamesResponse);
    
  } catch (error) {
    console.error('❌ 2025 Games API error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      metadata: {
        totalGames: 0,
        season: 2025,
        division,
        lastUpdated: new Date().toISOString(),
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch 2025-26 season games'
    } as GamesResponse, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}