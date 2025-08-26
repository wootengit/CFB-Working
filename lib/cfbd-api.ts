// College Football Data API Integration
// Focused on MIT Research High-Predictive-Value Fields
// API Documentation: https://collegefootballdata.com/

import { 
  SPRating, 
  AdvancedTeamStats, 
  PPAData, 
  EnhancedTeamData,
  SPRatingsResponse,
  AdvancedStatsResponse,
  PPAResponse,
  EnhancedStandingsResponse,
  SEC_TEAMS
} from '@/types/cfb-api';

import {
  getMockSPRatings,
  getMockAdvancedStats,
  getMockPPAData,
  getMockEnhancedStandings,
  isMockMode
} from './mock-cfbd-data';

const CFBD_BASE_URL = 'https://api.collegefootballdata.com';

// API Key should be set in environment variables
// Get your free key at: https://collegefootballdata.com/key
const API_KEY = process.env.CFBD_API_KEY || '';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
};

/**
 * SP+ Ratings API Integration
 * Endpoint: /ratings/sp
 * MIT Research: 72-86% win correlation - PRIMARY PREDICTOR
 */
export async function fetchSPRatings(year: number = 2024): Promise<SPRatingsResponse> {
  // Use mock data if no API key is available
  if (isMockMode()) {
    console.log('🔧 Development mode: Using mock SP+ ratings data');
    return getMockSPRatings();
  }

  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/ratings/sp?year=${year}`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`SP+ Ratings API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const spRatings: SPRating[] = data.map((item: any) => ({
      team: item.team,
      conference: item.conference,
      rating: item.rating || 0,
      ranking: item.ranking || 999,
      secondOrderWins: item.secondOrderWins || 0,
      sos: item.sos || 0,
      offenseRating: item.offense?.rating || 0,
      defenseRating: item.defense?.rating || 0,
      specialTeamsRating: item.specialTeams?.rating || 0,
    }));

    return {
      data: spRatings,
      success: true,
      message: `Retrieved ${spRatings.length} SP+ ratings for ${year}`
    };
  } catch (error) {
    console.error('Error fetching SP+ ratings:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error fetching SP+ ratings'
    };
  }
}

/**
 * Advanced Team Statistics API Integration
 * Endpoint: /stats/season/advanced  
 * MIT Research: Core efficiency metrics with high predictive value
 */
export async function fetchAdvancedStats(year: number = 2024): Promise<AdvancedStatsResponse> {
  // Use mock data if no API key is available
  if (isMockMode()) {
    console.log('🔧 Development mode: Using mock advanced stats data');
    return getMockAdvancedStats();
  }

  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/stats/season/advanced?year=${year}&excludeGarbageTime=true`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Advanced Stats API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const advancedStats: AdvancedTeamStats[] = data.map((item: any) => ({
      team: item.team,
      conference: item.conference,
      offensiveEfficiency: item.offense?.standardDowns?.rate || 0,
      defensiveEfficiency: item.defense?.standardDowns?.rate || 0,
      explosiveness: item.offense?.explosiveness || 0, // 86% win correlation when superior
      finishing: item.offense?.stuffRate || 0,
      fieldPosition: item.offense?.lineYards || 0,
      havoc: item.defense?.havoc?.total || 0,
      pacing: item.offense?.pace || 0,
      redZoneOffense: item.offense?.redZone || 0,
      redZoneDefense: item.defense?.redZone || 0,
      thirdDownOffense: item.offense?.thirdDown || 0,
      thirdDownDefense: item.defense?.thirdDown || 0,
    }));

    return {
      data: advancedStats,
      success: true,
      message: `Retrieved ${advancedStats.length} advanced stats for ${year}`
    };
  } catch (error) {
    console.error('Error fetching advanced stats:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error fetching advanced stats'
    };
  }
}

/**
 * PPA (Predicted Points Added) API Integration
 * Endpoint: /ppa/teams
 * MIT Research: Neural network based predictions - HIGH VALUE
 */
export async function fetchPPAData(year: number = 2024): Promise<PPAResponse> {
  // Use mock data if no API key is available
  if (isMockMode()) {
    console.log('🔧 Development mode: Using mock PPA data');
    return getMockPPAData();
  }

  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/ppa/teams?year=${year}&excludeGarbageTime=true`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`PPA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const ppaData: PPAData[] = data.map((item: any) => ({
      team: item.team,
      conference: item.conference,
      season: year,
      offensePPA: item.offense?.overall || 0,
      defensePPA: item.defense?.overall || 0,
      overallPPA: (item.offense?.overall || 0) - (item.defense?.overall || 0),
      passingPPA: item.offense?.passing || 0,
      rushingPPA: item.offense?.rushing || 0,
      passingDefPPA: item.defense?.passing || 0,
      rushingDefPPA: item.defense?.rushing || 0,
      downsPPA: {
        first: item.offense?.firstDown || 0,
        second: item.offense?.secondDown || 0,
        third: item.offense?.thirdDown || 0,
        fourth: item.offense?.fourthDown || 0,
      }
    }));

    return {
      data: ppaData,
      success: true,
      message: `Retrieved ${ppaData.length} PPA records for ${year}`
    };
  } catch (error) {
    console.error('Error fetching PPA data:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error fetching PPA data'
    };
  }
}

/**
 * Team Records API Integration
 * Endpoint: /records
 * Basic win/loss records and conference standings
 */
export async function fetchTeamRecords(year: number = 2024): Promise<any[]> {
  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/records?year=${year}`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Records API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching team records:', error);
    return [];
  }
}

/**
 * Team Info API Integration  
 * Endpoint: /teams
 * Team metadata including logos, colors, conference info
 */
export async function fetchTeamInfo(): Promise<any[]> {
  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/teams`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 86400 } // Cache for 24 hours (static data)
      }
    );

    if (!response.ok) {
      throw new Error(`Team Info API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching team info:', error);
    return [];
  }
}

/**
 * Enhanced Standings Integration
 * Combines all MIT research high-value fields into unified dataset
 * Prioritizes SEC teams as requested
 */
export async function fetchEnhancedStandings(year: number = 2024): Promise<EnhancedStandingsResponse> {
  // Use mock data if no API key is available
  if (isMockMode()) {
    console.log('🔧 Development mode: Using mock enhanced standings');
    return getMockEnhancedStandings();
  }

  try {
    console.log(`🏈 Fetching enhanced standings for ${year} with MIT research fields...`);
    
    // Fetch all required data in parallel for performance
    const [spRatings, advancedStats, ppaData, records, teamInfo] = await Promise.all([
      fetchSPRatings(year),
      fetchAdvancedStats(year),
      fetchPPAData(year),
      fetchTeamRecords(year),
      fetchTeamInfo()
    ]);

    if (!spRatings.success || !advancedStats.success || !ppaData.success) {
      throw new Error('Failed to fetch required predictive data');
    }

    // Create lookup maps for efficient data joining
    const spMap = new Map(spRatings.data.map(item => [item.team, item]));
    const statsMap = new Map(advancedStats.data.map(item => [item.team, item]));
    const ppaMap = new Map(ppaData.data.map(item => [item.team, item]));
    const teamInfoMap = new Map(teamInfo.map(item => [item.school, item]));

    // Combine all data into enhanced format
    const enhancedData: EnhancedTeamData[] = records.map(record => {
      const sp = spMap.get(record.team);
      const stats = statsMap.get(record.team);
      const ppa = ppaMap.get(record.team);
      const info = teamInfoMap.get(record.team);

      return {
        // Basic Info
        teamId: info?.id || 0,
        team: record.team,
        conference: record.conference,
        division: record.division,
        color: info?.color || '#000000',
        altColor: info?.alt_color || '#FFFFFF',
        logo: info?.logos?.[0] || '',

        // Traditional Stats
        wins: record.total?.wins || 0,
        losses: record.total?.losses || 0,
        ties: record.total?.ties || 0,
        conferenceWins: record.conferenceGames?.wins || 0,
        conferenceLosses: record.conferenceGames?.losses || 0,
        conferenceTies: record.conferenceGames?.ties || 0,

        // MIT Research Tier 1 Fields (High Predictive Value)
        spPlusRating: sp?.rating || 0,
        spPlusRanking: sp?.ranking || 999,
        offensiveEfficiency: stats?.offensiveEfficiency || 0,
        defensiveEfficiency: stats?.defensiveEfficiency || 0,
        explosiveness: stats?.explosiveness || 0, // 86% win correlation
        offensePPA: ppa?.offensePPA || 0,
        defensePPA: ppa?.defensePPA || 0,

        // Supporting Metrics
        strengthOfSchedule: sp?.sos || 0,
        secondOrderWins: sp?.secondOrderWins || 0,
        havocRate: stats?.havoc || 0,
        finishingRate: stats?.finishing || 0,
        fieldPosition: stats?.fieldPosition || 0,

        // Traditional Metrics
        pointsForPerGame: 0, // Would need separate API call
        pointsAgainstPerGame: 0,
        avgMargin: 0,
        winPct: (record.total?.wins || 0) / Math.max((record.total?.games || 1), 1),
      };
    });

    // Prioritize SEC teams as requested
    const secTeams = enhancedData.filter(team => 
      SEC_TEAMS.includes(team.team as any) || team.conference === 'SEC'
    );
    
    const otherTeams = enhancedData.filter(team => 
      !SEC_TEAMS.includes(team.team as any) && team.conference !== 'SEC'
    );

    // Sort SEC teams by SP+ rating (primary predictor)
    secTeams.sort((a, b) => b.spPlusRating - a.spPlusRating);
    otherTeams.sort((a, b) => b.spPlusRating - a.spPlusRating);

    const sortedData = [...secTeams, ...otherTeams];

    console.log(`✅ Enhanced standings ready: ${secTeams.length} SEC teams, ${otherTeams.length} others`);

    return {
      data: sortedData,
      success: true,
      message: `Enhanced standings with MIT research fields for ${year}`,
      predictiveAccuracy: {
        spPlusCorrelation: 79, // Average from MIT research (72-86%)
        explosiveness: 86,     // Win rate when superior
        efficiency: 74,        // Overall efficiency correlation
      }
    };

  } catch (error) {
    console.error('Error creating enhanced standings:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error creating enhanced standings'
    };
  }
}

/**
 * SEC-Specific Standings Helper
 * Focused specifically on SEC teams with all predictive fields
 */
export async function fetchSECStandings(year: number = 2024): Promise<EnhancedStandingsResponse> {
  const fullStandings = await fetchEnhancedStandings(year);
  
  if (!fullStandings.success) {
    return fullStandings;
  }

  // Filter for SEC teams only
  const secData = fullStandings.data.filter(team => 
    SEC_TEAMS.includes(team.team as any) || team.conference === 'SEC'
  );

  return {
    ...fullStandings,
    data: secData,
    message: `SEC-only standings with MIT research predictive fields for ${year}`
  };
}

// Utility function to check API status
export async function checkAPIStatus(): Promise<{ status: 'healthy' | 'unhealthy', message: string }> {
  try {
    const response = await fetch(`${CFBD_BASE_URL}/teams/fbs`, {
      headers: DEFAULT_HEADERS,
    });
    
    if (response.ok) {
      return { status: 'healthy', message: 'CFBD API is accessible' };
    } else {
      return { status: 'unhealthy', message: `API returned ${response.status}` };
    }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}