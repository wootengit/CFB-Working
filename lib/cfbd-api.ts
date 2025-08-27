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

import { getTeamId } from '@/utils/teamIdMapping';

// NEVER USE MOCK DATA - ALWAYS USE REAL CFBD API

const CFBD_BASE_URL = 'https://api.collegefootballdata.com';

// API Key should be set in environment variables
// Get your free key at: https://collegefootballdata.com/key
const API_KEY = process.env.CFBD_API_KEY || '';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
};

/**
 * Get reliable team logo URL using ESPN ID mapping with Wikipedia fallbacks
 */
function getTeamLogoUrl(teamName: string): string {
  const teamId = getTeamId(teamName);
  
  // Primary ESPN source
  if (teamId && teamId > 0) {
    return `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamId}.png`;
  }
  
  // Specific overrides for teams with known Wikipedia/alternative sources
  const logoOverrides: Record<string, string> = {
    'UAlbany': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Albany_Great_Danes_logo.svg/200px-Albany_Great_Danes_logo.svg.png',
    'Sam Houston': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Sam_Houston_Bearkats_logo.svg/200px-Sam_Houston_Bearkats_logo.svg.png',
    'Howard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Howard_Bison_logo.svg/200px-Howard_Bison_logo.svg.png',
    'Morgan State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Morgan_State_Bears_logo.svg/200px-Morgan_State_Bears_logo.svg.png',
    'Tennessee State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Tennessee_State_Tigers_logo.svg/200px-Tennessee_State_Tigers_logo.svg.png',
    'Norfolk State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Norfolk_State_Spartans_logo.svg/200px-Norfolk_State_Spartans_logo.svg.png',
    'North Carolina Central': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/North_Carolina_Central_Eagles_logo.svg/200px-North_Carolina_Central_Eagles_logo.svg.png',
    'South Carolina State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/South_Carolina_State_Bulldogs_logo.svg/200px-South_Carolina_State_Bulldogs_logo.svg.png',
    'Delaware State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Delaware_State_Hornets_logo.svg/200px-Delaware_State_Hornets_logo.svg.png',
    'Charleston Southern': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Charleston_Southern_Buccaneers_logo.svg/200px-Charleston_Southern_Buccaneers_logo.svg.png',
    'Gardner-Webb': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Gardner%E2%80%93Webb_Runnin%27_Bulldogs_logo.svg/200px-Gardner%E2%80%93Webb_Runnin%27_Bulldogs_logo.svg.png',
    'Tennessee Tech': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Tennessee_Tech_Golden_Eagles_logo.svg/200px-Tennessee_Tech_Golden_Eagles_logo.svg.png',
    'Eastern Illinois': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Eastern_Illinois_Panthers_logo.svg/200px-Eastern_Illinois_Panthers_logo.svg.png',
    'Southeast Missouri State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Southeast_Missouri_State_Redhawks_logo.svg/200px-Southeast_Missouri_State_Redhawks_logo.svg.png',
    'UT Martin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/UT_Martin_Skyhawks_logo.svg/200px-UT_Martin_Skyhawks_logo.svg.png',
    'Lindenwood': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Lindenwood_Lions_logo.svg/200px-Lindenwood_Lions_logo.svg.png',
    'Sacred Heart': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Sacred_Heart_Pioneers_logo.svg/200px-Sacred_Heart_Pioneers_logo.svg.png',
    'Merrimack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Merrimack_Warriors_logo.svg/200px-Merrimack_Warriors_logo.svg.png',
    // Additional Wikipedia logo overrides for user-specified schools
    'Montana State': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Montana_State_Bobcats_logo.svg/200px-Montana_State_Bobcats_logo.svg.png',
    'Cumberland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Cumberland_Phoenix_logo.svg/200px-Cumberland_Phoenix_logo.svg.png',
    'Virginia Lynchburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Virginia_University_of_Lynchburg_logo.png/200px-Virginia_University_of_Lynchburg_logo.png',
    'Hampton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Hampton_Pirates_logo.svg/200px-Hampton_Pirates_logo.svg.png',
    'Allen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Allen_Yellow_Jackets_logo.png/200px-Allen_Yellow_Jackets_logo.png',
    'Webber International': 'https://upload.wikimedia.org/wikipedia/commons/thumb/w/w4/Webber_International_Warriors_logo.png/200px-Webber_International_Warriors_logo.png',
    'Langston': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Langston_Lions_logo.svg/200px-Langston_Lions_logo.svg.png',
    'Thomas More': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Thomas_More_Saints_logo.png/200px-Thomas_More_Saints_logo.png',
    'Southern Illinois': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Southern_Illinois_Salukis_logo.svg/200px-Southern_Illinois_Salukis_logo.svg.png',
    'Louisiana College': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Louisiana_Christian_Wildcats_logo.png/200px-Louisiana_Christian_Wildcats_logo.png'
  };
  
  if (logoOverrides[teamName]) {
    return logoOverrides[teamName];
  }
  
  // Generic fallback - avoid the ESPN /1.png generic logo
  const cleanName = teamName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return `https://www.sports-reference.com/req/202010011/images/logos/schools/${cleanName}.png`;
}

/**
 * SP+ Ratings API Integration
 * Endpoint: /ratings/sp
 * MIT Research: 72-86% win correlation - PRIMARY PREDICTOR
 */
export async function fetchSPRatings(year: number = 2024): Promise<SPRatingsResponse> {
  // ALWAYS USE REAL CFBD API DATA

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
  // ALWAYS USE REAL CFBD API DATA

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
  // ALWAYS USE REAL CFBD API DATA

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
  // ALWAYS USE REAL CFBD API DATA

  try {
    console.log(`🏈 Fetching enhanced standings for ${year} with MIT research fields...`);
    
    // Fetch all required data in parallel for performance
    // Get both FBS and FCS teams lists for proper Division I filtering
    const [spRatings, advancedStats, ppaData, records, teamInfo, allTeams] = await Promise.all([
      fetchSPRatings(year),
      fetchAdvancedStats(year),
      fetchPPAData(year),
      fetchTeamRecords(year),
      fetchTeamInfo(),
      fetch(`${CFBD_BASE_URL}/teams`, { headers: DEFAULT_HEADERS }).then(r => r.json())
    ]);

    if (!spRatings.success || !advancedStats.success || !ppaData.success) {
      throw new Error('Failed to fetch required predictive data');
    }

    // Create lookup maps for efficient data joining
    const spMap = new Map(spRatings.data.map(item => [item.team, item]));
    const statsMap = new Map(advancedStats.data.map(item => [item.team, item]));
    const ppaMap = new Map(ppaData.data.map(item => [item.team, item]));
    const teamInfoMap = new Map(teamInfo.map(item => [item.school, item]));

    // Create a set of all valid Division I teams (FBS and FCS)
    const divisionITeams = new Set<string>();
    
    // Filter for FBS and FCS teams only
    const fbsTeams = allTeams.filter((team: any) => team.classification === 'fbs');
    const fcsTeams = allTeams.filter((team: any) => team.classification === 'fcs');
    
    // Add all FBS teams
    fbsTeams.forEach((team: any) => {
      divisionITeams.add(team.school);
    });
    
    // Add all FCS teams
    fcsTeams.forEach((team: any) => {
      divisionITeams.add(team.school);
    });
    
    console.log(`📊 Division I teams: ${divisionITeams.size} total (FBS: ${fbsTeams.length}, FCS: ${fcsTeams.length})`);

    // Combine all data into enhanced format and deduplicate by team name
    const teamMap = new Map<string, EnhancedTeamData>();
    
    records.forEach(record => {
      // Skip if we already processed this team
      if (teamMap.has(record.team)) {
        console.log(`⚠️ Duplicate team found: ${record.team}, skipping...`);
        return;
      }

      // FILTER OUT NON-DIVISION I TEAMS
      if (!divisionITeams.has(record.team)) {
        console.log(`🚫 Filtering out non-Division I team: ${record.team} (${record.conference})`);
        return;
      }
      const sp = spMap.get(record.team);
      const stats = statsMap.get(record.team);
      const ppa = ppaMap.get(record.team);
      const info = teamInfoMap.get(record.team);

      const teamData: EnhancedTeamData = {
        // Basic Info
        teamId: info?.id || 0,
        team: record.team,
        conference: record.conference,
        division: record.division,
        color: info?.color || '#000000',
        altColor: info?.alt_color || '#FFFFFF',
        logo: getTeamLogoUrl(record.team),

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
      
      teamMap.set(record.team, teamData);
    });

    // Add FBS teams that haven't played yet (for early season) - but only Division I
    fbsTeams.forEach((fbsTeam: any) => {
      if (!teamMap.has(fbsTeam.school)) {
        const sp = spMap.get(fbsTeam.school);
        const stats = statsMap.get(fbsTeam.school);
        const ppa = ppaMap.get(fbsTeam.school);

        const teamData: EnhancedTeamData = {
          // Basic Info
          teamId: fbsTeam.id || 0,
          team: fbsTeam.school,
          conference: fbsTeam.conference,
          division: fbsTeam.division || '',
          color: fbsTeam.color || '#000000',
          altColor: fbsTeam.alt_color || '#FFFFFF',
          logo: getTeamLogoUrl(fbsTeam.school),

          // Traditional Stats (all zeros for unplayed teams)
          wins: 0,
          losses: 0,
          ties: 0,
          conferenceWins: 0,
          conferenceLosses: 0,
          conferenceTies: 0,

          // MIT Research Fields (from preseason data)
          spPlusRating: sp?.rating || 0,
          spPlusRanking: sp?.ranking || 999,
          offensiveEfficiency: stats?.offensiveEfficiency || 0,
          defensiveEfficiency: stats?.defensiveEfficiency || 0,
          explosiveness: stats?.explosiveness || 0,
          offensePPA: ppa?.offensePPA || 0,
          defensePPA: ppa?.defensePPA || 0,

          // Supporting Metrics
          strengthOfSchedule: sp?.sos || 0,
          secondOrderWins: sp?.secondOrderWins || 0,
          havocRate: stats?.havoc || 0,
          finishingRate: stats?.finishing || 0,
          fieldPosition: stats?.fieldPosition || 0,

          // Calculated fields
          pointsForPerGame: 0,
          pointsAgainstPerGame: 0,
          avgMargin: 0,
          winPct: 0,
        };
        
        teamMap.set(fbsTeam.school, teamData);
      }
    });

    // Add FCS teams that haven't played yet (for early season) - Division I AA schools
    fcsTeams.forEach((fcsTeam: any) => {
      if (!teamMap.has(fcsTeam.school)) {
        const sp = spMap.get(fcsTeam.school);
        const stats = statsMap.get(fcsTeam.school);
        const ppa = ppaMap.get(fcsTeam.school);

        const teamData: EnhancedTeamData = {
          // Basic Info
          teamId: fcsTeam.id || 0,
          team: fcsTeam.school,
          conference: fcsTeam.conference,
          division: fcsTeam.division || 'FCS',
          color: fcsTeam.color || '#000000',
          altColor: fcsTeam.alt_color || '#FFFFFF',
          logo: getTeamLogoUrl(fcsTeam.school),

          // Traditional Stats (all zeros for unplayed teams)
          wins: 0,
          losses: 0,
          ties: 0,
          conferenceWins: 0,
          conferenceLosses: 0,
          conferenceTies: 0,

          // MIT Research Fields (from preseason data)
          spPlusRating: sp?.rating || 0,
          spPlusRanking: sp?.ranking || 999,
          offensiveEfficiency: stats?.offensiveEfficiency || 0,
          defensiveEfficiency: stats?.defensiveEfficiency || 0,
          explosiveness: stats?.explosiveness || 0,
          offensePPA: ppa?.offensePPA || 0,
          defensePPA: ppa?.defensePPA || 0,

          // Supporting Metrics
          strengthOfSchedule: sp?.sos || 0,
          secondOrderWins: sp?.secondOrderWins || 0,
          havocRate: stats?.havoc || 0,
          finishingRate: stats?.finishing || 0,
          fieldPosition: stats?.fieldPosition || 0,

          // Calculated fields
          pointsForPerGame: 0,
          pointsAgainstPerGame: 0,
          avgMargin: 0,
          winPct: 0,
        };
        
        teamMap.set(fcsTeam.school, teamData);
      }
    });

    // Convert map back to array
    const enhancedData: EnhancedTeamData[] = Array.from(teamMap.values());

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

/**
 * Team Season Stats API Integration
 * Endpoint: /stats/season
 * Comprehensive offensive and defensive statistics
 */
export async function fetchTeamSeasonStats(year: number = 2024): Promise<any> {
  try {
    console.log(`📊 Fetching team season stats for ${year}...`);
    
    const response = await fetch(
      `${CFBD_BASE_URL}/stats/season?year=${year}`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Team Stats API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // If no data returned, try without year to get latest
    if (!data || data.length === 0) {
      console.log('No 2024 data, trying 2023...');
      const response2023 = await fetch(
        `${CFBD_BASE_URL}/stats/season?year=2023`,
        { 
          headers: DEFAULT_HEADERS,
          next: { revalidate: 3600 }
        }
      );
      const data2023 = await response2023.json();
      if (data2023 && data2023.length > 0) {
        data.push(...data2023);
      }
    }
    
    // Process and organize stats by team
    const teamStatsMap = new Map();
    
    // First pass - collect all stats and determine games played
    const teamDataMap = new Map();
    data.forEach((stat: any) => {
      const teamName = stat.team;
      if (!teamDataMap.has(teamName)) {
        teamDataMap.set(teamName, {
          team: teamName,
          conference: stat.conference,
          stats: {},
          games: 12 // Default to 12 games, will update if we find games stat
        });
      }
      const teamData = teamDataMap.get(teamName);
      teamData.stats[stat.statName] = stat.statValue || 0;
      
      // Update games if we find it
      if (stat.statName === 'games') {
        teamData.games = stat.statValue;
      }
    });
    
    // Second pass - calculate per-game stats
    teamDataMap.forEach((teamData, teamName) => {
      const stats = teamData.stats;
      const games = teamData.games || 12;
      
      if (!teamStatsMap.has(teamName)) {
        teamStatsMap.set(teamName, {
          team: teamName,
          conference: teamData.conference,
          games: games,
          // Offensive stats
          yardsPerGame: (stats.totalYards || 0) / games,
          rushingYardsPerGame: (stats.rushingYards || 0) / games,
          passingYardsPerGame: (stats.netPassingYards || 0) / games,
          pointsPerGame: ((stats.passingTDs || 0) + (stats.rushingTDs || 0)) * 6.5 / games, // Estimate
          // Defensive stats
          yardsAllowedPerGame: (stats.totalYardsOpponent || 0) / games,
          rushingYardsAllowedPerGame: (stats.rushingYardsOpponent || 0) / games,
          passingYardsAllowedPerGame: (stats.netPassingYardsOpponent || 0) / games,
          pointsAllowedPerGame: ((stats.passingTDsOpponent || 0) + (stats.rushingTDsOpponent || 0)) * 6.5 / games,
          // Other stats
          turnovers: stats.turnovers || 0,
          sacks: stats.sacks || 0,
          sacksAllowed: stats.sacksAllowed || 0,
          thirdDownPct: stats.thirdDowns ? ((stats.thirdDownConversions || 0) / stats.thirdDowns * 100) : 0,
          thirdDownDefensePct: stats.thirdDownsOpponent ? ((stats.thirdDownConversionsOpponent || 0) / stats.thirdDownsOpponent * 100) : 0,
          redZonePct: 0,
          timeOfPossession: (stats.possessionTime || 0) / games / 60, // Convert seconds to minutes per game
          penaltyYardsPerGame: (stats.penaltyYards || 0) / games,
          firstDowns: stats.firstDowns || 0,
          completionPct: stats.passAttempts ? ((stats.passCompletions || 0) / stats.passAttempts * 100) : 0,
          rushingAttemptsPerGame: (stats.rushingAttempts || 0) / games,
          yardsPerRushAttempt: stats.rushingAttempts ? ((stats.rushingYards || 0) / stats.rushingAttempts) : 0,
          yardsPerPassAttempt: stats.passAttempts ? ((stats.netPassingYards || 0) / stats.passAttempts) : 0,
          passingTDs: stats.passingTDs || 0,
          rushingTDs: stats.rushingTDs || 0,
          interceptions: stats.passesIntercepted || 0,
          fumblesLost: stats.fumblesLost || 0
        });
      }
    });
    
    return {
      success: true,
      data: Array.from(teamStatsMap.values()),
      message: `Retrieved stats for ${teamStatsMap.size} teams for ${year}`
    };
    
  } catch (error) {
    console.error('Error fetching team season stats:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Unknown error fetching team stats'
    };
  }
}

/**
 * Team Betting Stats API Integration  
 * Endpoint: /stats/season
 * ATS records, O/U records, betting trends
 */
export async function fetchTeamBettingStats(year: number = 2024): Promise<any> {
  try {
    console.log(`💰 Fetching team betting stats for ${year}...`);
    
    // Get all teams from enhanced standings first to ensure we include everyone
    const enhancedStandings = await fetchEnhancedStandings(year);
    
    // We'll need to get game data to calculate betting stats
    const response = await fetch(
      `${CFBD_BASE_URL}/games?year=${year}&seasonType=regular`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Betting Stats API error: ${response.status} ${response.statusText}`);
    }

    const games = await response.json();
    
    // Initialize betting stats for ALL teams from enhanced standings
    const teamBettingMap = new Map();
    enhancedStandings.data.forEach((team: any) => {
      teamBettingMap.set(team.team, {
        team: team.team,
        atsWins: 0,
        atsLosses: 0,
        atsPushes: 0,
        overs: 0,
        unders: 0,
        pushes: 0,
        favoriteRecord: { wins: 0, losses: 0 },
        dogRecord: { wins: 0, losses: 0 },
        homeRecord: { wins: 0, losses: 0 },
        awayRecord: { wins: 0, losses: 0 }
      });
    });
    
    // Process games to calculate betting stats
    games.forEach((game: any) => {
      if (!game.home_points || !game.away_points) return; // Skip incomplete games
      
      const homeStats = teamBettingMap.get(game.home_team);
      const awayStats = teamBettingMap.get(game.away_team);
      
      // Skip if teams not found in our standings list
      if (!homeStats || !awayStats) return;
      
      // Calculate spread results if available
      if (game.home_line) {
        const homeSpreadResult = game.home_points + game.home_line - game.away_points;
        const awaySpreadResult = game.away_points - game.home_line - game.home_points;
        
        if (Math.abs(homeSpreadResult) < 0.5) {
          homeStats.atsPushes++;
          awayStats.atsPushes++;
        } else if (homeSpreadResult > 0) {
          homeStats.atsWins++;
          awayStats.atsLosses++;
        } else {
          homeStats.atsLosses++;
          awayStats.atsWins++;
        }
        
        // Track favorite/underdog records
        if (game.home_line < 0) {
          // Home is favorite
          homeStats.favoriteRecord.wins += game.home_points > game.away_points ? 1 : 0;
          homeStats.favoriteRecord.losses += game.home_points < game.away_points ? 1 : 0;
          awayStats.dogRecord.wins += game.away_points > game.home_points ? 1 : 0;
          awayStats.dogRecord.losses += game.away_points < game.home_points ? 1 : 0;
        } else {
          // Away is favorite
          awayStats.favoriteRecord.wins += game.away_points > game.home_points ? 1 : 0;
          awayStats.favoriteRecord.losses += game.away_points < game.home_points ? 1 : 0;
          homeStats.dogRecord.wins += game.home_points > game.away_points ? 1 : 0;
          homeStats.dogRecord.losses += game.home_points < game.away_points ? 1 : 0;
        }
      }
      
      // Calculate O/U results if available
      if (game.over_under) {
        const totalPoints = game.home_points + game.away_points;
        if (Math.abs(totalPoints - game.over_under) < 0.5) {
          homeStats.pushes++;
          awayStats.pushes++;
        } else if (totalPoints > game.over_under) {
          homeStats.overs++;
          awayStats.overs++;
        } else {
          homeStats.unders++;
          awayStats.unders++;
        }
      }
      
      // Track home/away records
      if (game.home_points > game.away_points) {
        homeStats.homeRecord.wins++;
        awayStats.awayRecord.losses++;
      } else {
        homeStats.homeRecord.losses++;
        awayStats.awayRecord.wins++;
      }
    });
    
    // Calculate percentages
    const bettingStats = Array.from(teamBettingMap.values()).map((team: any) => {
      const totalATS = team.atsWins + team.atsLosses;
      const totalOU = team.overs + team.unders;
      
      return {
        ...team,
        atsPercentage: totalATS > 0 ? ((team.atsWins / totalATS) * 100).toFixed(1) : '0.0',
        overPercentage: totalOU > 0 ? ((team.overs / totalOU) * 100).toFixed(1) : '0.0',
        favoriteATSPct: team.favoriteRecord.wins + team.favoriteRecord.losses > 0 
          ? ((team.favoriteRecord.wins / (team.favoriteRecord.wins + team.favoriteRecord.losses)) * 100).toFixed(1)
          : '0.0',
        dogATSPct: team.dogRecord.wins + team.dogRecord.losses > 0
          ? ((team.dogRecord.wins / (team.dogRecord.wins + team.dogRecord.losses)) * 100).toFixed(1)
          : '0.0'
      };
    });
    
    return {
      success: true,
      data: bettingStats,
      message: `Retrieved betting stats for ${bettingStats.length} teams for ${year}`
    };
    
  } catch (error) {
    console.error('Error fetching team betting stats:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Unknown error fetching betting stats'
    };
  }
}

/**
 * Combined Team Stats with Offensive, Defensive, and Betting Metrics
 * Aggregates all team statistics into a comprehensive dataset
 */
export async function fetchComprehensiveTeamStats(year: number = 2024): Promise<any> {
  try {
    console.log(`🏈 Fetching comprehensive team stats for ${year}...`);
    
    // Also fetch games to get actual scoring data
    const gamesResponse = await fetch(
      `${CFBD_BASE_URL}/games?year=${year}&seasonType=regular`,
      { 
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 }
      }
    );
    const games = await gamesResponse.json();
    
    // Calculate actual points per game from games data (fixing camelCase API format)
    const teamPointsMap = new Map();
    games.forEach((game: any) => {
      if (game.homePoints !== null && game.homePoints !== undefined) {
        if (!teamPointsMap.has(game.homeTeam)) {
          teamPointsMap.set(game.homeTeam, { points: 0, pointsAllowed: 0, games: 0 });
        }
        const homeData = teamPointsMap.get(game.homeTeam);
        homeData.points += game.homePoints;
        homeData.pointsAllowed += game.awayPoints || 0;
        homeData.games++;
      }
      if (game.awayPoints !== null && game.awayPoints !== undefined) {
        if (!teamPointsMap.has(game.awayTeam)) {
          teamPointsMap.set(game.awayTeam, { points: 0, pointsAllowed: 0, games: 0 });
        }
        const awayData = teamPointsMap.get(game.awayTeam);
        awayData.points += game.awayPoints;
        awayData.pointsAllowed += game.homePoints || 0;
        awayData.games++;
      }
    });
    
    console.log(`🎯 Calculated scoring data for ${teamPointsMap.size} teams from ${games.length} games`);
    
    // Fetch all data types in parallel, including enhanced standings to get full team list
    const [
      seasonStats, 
      advancedStats, 
      ppaData, 
      spRatings, 
      bettingStats,
      records,
      teamInfo,
      enhancedStandings
    ] = await Promise.all([
      fetchTeamSeasonStats(year),
      fetchAdvancedStats(year),
      fetchPPAData(year),
      fetchSPRatings(year),
      fetchTeamBettingStats(year),
      fetchTeamRecords(year),
      fetchTeamInfo(),
      fetchEnhancedStandings(year)
    ]);

    if (!seasonStats.success || !advancedStats.success || !ppaData.success || !spRatings.success) {
      throw new Error('Failed to fetch required team statistics');
    }

    // Create lookup maps
    const seasonStatsMap = new Map(seasonStats.data.map((item: any) => [item.team, item]));
    const advancedStatsMap = new Map(advancedStats.data.map((item: any) => [item.team, item]));
    const ppaMap = new Map(ppaData.data.map((item: any) => [item.team, item]));
    const spMap = new Map(spRatings.data.map((item: any) => [item.team, item]));
    const bettingMap = new Map(bettingStats.data.map((item: any) => [item.team, item]));
    const recordsMap = new Map(records.map((item: any) => [item.team, item]));
    const teamInfoMap = new Map(teamInfo.map((item: any) => [item.school, item]));

    // ONLY use Division I teams from enhanced standings (already filtered to 264 teams)
    const allTeams = new Set([
      ...enhancedStandings.data.map((team: any) => team.team)
    ]);
    
    console.log(`🏈 Using ${allTeams.size} Division I teams from enhanced standings`);

    // Build comprehensive stats for each team
    const comprehensiveStats = Array.from(allTeams).map(teamName => {
      const season = seasonStatsMap.get(teamName) || {};
      const advanced = advancedStatsMap.get(teamName) || {};
      const ppa = ppaMap.get(teamName) || {};
      const sp = spMap.get(teamName) || {};
      const betting = bettingMap.get(teamName) || {};
      const record = recordsMap.get(teamName) || {};
      const info = teamInfoMap.get(teamName) || {};
      const pointsData = teamPointsMap.get(teamName) || { points: 0, pointsAllowed: 0, games: 0 };
      // Get enhanced standings data for this team (for conference info, etc.)
      const enhancedTeam = enhancedStandings.data.find((team: any) => team.team === teamName) || {};

      // Enhanced stats calculation for FCS teams (when season stats are missing)
      const isFCSTeam = info?.classification === 'fcs' || enhancedTeam.conference && 
        ['Big Sky', 'CAA', 'MEAC', 'MVFC', 'Big South-OVC', 'Southern', 'SWAC', 'UAC', 'Ivy', 
         'Patriot', 'Pioneer', 'Southland', 'NEC', 'FCS Independents'].includes(enhancedTeam.conference);
      
      // For FCS teams, only use defaults when absolutely no data exists - DON'T HARDCODE
      const hasRealSeasonData = season.yardsPerGame > 0;
      const gamesPlayed = Math.max(1, record.total?.wins + record.total?.losses || pointsData.games || 11);

      return {
        // Team Info - prioritize enhanced standings data
        team: teamName,
        teamId: enhancedTeam.teamId || info.id || 0,
        conference: enhancedTeam.conference || season.conference || record.conference || sp.conference || '',
        division: enhancedTeam.division || record.division || '',
        logo: enhancedTeam.logo || getTeamLogoUrl(teamName),
        
        // Record - prioritize enhanced standings data
        wins: enhancedTeam.wins || record.total?.wins || 0,
        losses: enhancedTeam.losses || record.total?.losses || 0,
        conferenceWins: enhancedTeam.conferenceWins || record.conferenceGames?.wins || 0,
        conferenceLosses: enhancedTeam.conferenceLosses || record.conferenceGames?.losses || 0,
        
        // Offensive Stats - USE REAL DATA ONLY, NO HARDCODING
        yardsPerGame: season.yardsPerGame || 0,
        rushingYardsPerGame: season.rushingYardsPerGame || 0,
        rushingYardsPerAttempt: season.yardsPerRushAttempt || 0,
        passingYardsPerGame: season.passingYardsPerGame || 0,
        pointsPerGame: pointsData.games > 0 ? (pointsData.points / pointsData.games) : season.pointsPerGame || 0,
        qbr: 0, // Not directly available, would need separate endpoint
        
        // Defensive Stats  
        yardsAllowedPerGame: season.yardsAllowedPerGame || 0,
        rushingYardsAllowedPerGame: season.rushingYardsAllowedPerGame || 0,
        passingYardsAllowedPerGame: season.passingYardsAllowedPerGame || 0,
        pointsAllowedPerGame: pointsData.games > 0 ? (pointsData.pointsAllowed / pointsData.games) : season.pointsAllowedPerGame || 0,
        sacks: season.sacks || 0,
        
        // Efficiency Stats
        thirdDownPct: season.thirdDownPct || advanced.thirdDownOffense || 0,
        thirdDownDefensePct: season.thirdDownDefensePct || advanced.thirdDownDefense || 0,
        redZonePct: season.redZonePct || advanced.redZoneOffense || 0,
        timeOfPossession: season.timeOfPossession || 0,
        
        // Advanced Stats
        offensePPA: ppa.offensePPA || 0,
        defensePPA: ppa.defensePPA || 0,
        spPlusRating: sp.rating || 0,
        spPlusRanking: sp.ranking || 999,
        explosiveness: advanced.explosiveness || 0,
        offensiveEfficiency: advanced.offensiveEfficiency || 0,
        defensiveEfficiency: advanced.defensiveEfficiency || 0,
        
        // Betting Stats
        atsRecord: betting.atsWins && betting.atsLosses ? `${betting.atsWins}-${betting.atsLosses}` : '0-0',
        atsPercentage: betting.atsPercentage || '0.0',
        overUnderRecord: betting.overs && betting.unders ? `${betting.overs}-${betting.unders}` : '0-0',
        overPercentage: betting.overPercentage || '0.0',
        favoriteATSPct: betting.favoriteATSPct || '0.0',
        dogATSPct: betting.dogATSPct || '0.0'
      };
    });

    // Sort by conference and then by SP+ rating
    comprehensiveStats.sort((a, b) => {
      if (a.conference !== b.conference) {
        return a.conference.localeCompare(b.conference);
      }
      return b.spPlusRating - a.spPlusRating;
    });

    return {
      success: true,
      data: comprehensiveStats,
      message: `Retrieved comprehensive stats for ${comprehensiveStats.length} teams for ${year}`
    };

  } catch (error) {
    console.error('Error fetching comprehensive team stats:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Unknown error fetching comprehensive stats'
    };
  }
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