// Comprehensive Team Statistics Integration
// Systematic implementation of all required stats: PF/G, PA/G, MARGIN, ATS%, O/U%, Fav ATS%, Dog ATS%, L5 Form, SoS

const CFBD_BASE_URL = 'https://api.collegefootballdata.com';
const API_KEY = process.env.CFBD_API_KEY || '';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
};

export interface TeamStatistics {
  team: string;
  // Basic scoring stats
  pointsFor: number;
  pointsAgainst: number;
  gamesPlayed: number;
  
  // Calculated per-game stats
  pointsForPerGame: number;      // PF/G
  pointsAgainstPerGame: number;  // PA/G
  margin: number;                // MARGIN (PF - PA)
  marginPerGame: number;         // Margin per game
  
  // Betting stats
  atsWins: number;
  atsLosses: number;
  atsPushes: number;
  atsPercentage: number;         // ATS%
  
  overWins: number;
  underWins: number;
  ouPushes: number;
  overUnderPercentage: number;   // O/U%
  
  favoriteAtsWins: number;
  favoriteAtsLosses: number;
  favoriteAtsPercentage: number; // Fav ATS%
  
  underdogAtsWins: number;
  underdogAtsLosses: number;
  underdogAtsPercentage: number; // Dog ATS%
  
  // Form and strength
  last5Games: string;            // L5 Form (W-L-W-W-L format)
  last5Record: { wins: number; losses: number };
  strengthOfSchedule: number;    // SoS rating
  strengthOfScheduleRank: number;
}

/**
 * Fetch team game-by-game results for statistical calculations
 */
export async function fetchTeamGames(team: string, year: number = 2025): Promise<any[]> {
  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/games?year=${year}&team=${encodeURIComponent(team)}`,
      { headers: DEFAULT_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`Games API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching games for ${team}:`, error);
    return [];
  }
}

/**
 * Fetch team records with detailed stats
 */
export async function fetchTeamSeasonStats(team: string, year: number = 2025): Promise<any> {
  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/stats/season?year=${year}&team=${encodeURIComponent(team)}`,
      { headers: DEFAULT_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`Season Stats API error: ${response.status} ${response.statusText}`);
    }
    
    const stats = await response.json();
    return stats[0]; // Get the team's stats
  } catch (error) {
    console.error(`Error fetching season stats for ${team}:`, error);
    return null;
  }
}

/**
 * Fetch betting data for ATS and O/U calculations
 */
export async function fetchTeamBettingStats(team: string, year: number = 2025): Promise<any[]> {
  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/lines?year=${year}&team=${encodeURIComponent(team)}`,
      { headers: DEFAULT_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`Betting Lines API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching betting stats for ${team}:`, error);
    return [];
  }
}

/**
 * Fetch Strength of Schedule data
 */
export async function fetchStrengthOfSchedule(year: number = 2025): Promise<any[]> {
  try {
    const response = await fetch(
      `${CFBD_BASE_URL}/ratings/elo?year=${year}`,
      { headers: DEFAULT_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`SOS API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching strength of schedule:', error);
    return [];
  }
}

/**
 * Calculate comprehensive team statistics
 */
export async function calculateTeamStatistics(team: string, year: number = 2025): Promise<TeamStatistics | null> {
  try {
    console.log(`📊 Calculating comprehensive stats for ${team} (${year})`);
    
    // Fetch all required data in parallel
    const [games, seasonStats, bettingData, sosData] = await Promise.all([
      fetchTeamGames(team, year),
      fetchTeamSeasonStats(team, year),
      fetchTeamBettingStats(team, year),
      fetchStrengthOfSchedule(year)
    ]);
    
    if (!games.length) {
      console.warn(`No games found for ${team}`);
      return null;
    }
    
    // Calculate basic scoring stats
    let pointsFor = 0;
    let pointsAgainst = 0;
    let gamesPlayed = 0;
    let last5Games: string[] = [];
    
    // Process completed games
    const completedGames = games.filter((game: any) => game.completed);
    
    for (const game of completedGames) {
      gamesPlayed++;
      
      const isHome = game.home_team === team;
      const teamScore = isHome ? game.home_points : game.away_points;
      const opponentScore = isHome ? game.away_points : game.home_points;
      
      pointsFor += teamScore || 0;
      pointsAgainst += opponentScore || 0;
      
      // Track last 5 games (most recent first)
      if (last5Games.length < 5) {
        last5Games.unshift(teamScore > opponentScore ? 'W' : 'L');
      }
    }
    
    // Calculate per-game averages
    const pointsForPerGame = gamesPlayed > 0 ? pointsFor / gamesPlayed : 0;
    const pointsAgainstPerGame = gamesPlayed > 0 ? pointsAgainst / gamesPlayed : 0;
    const margin = pointsFor - pointsAgainst;
    const marginPerGame = gamesPlayed > 0 ? margin / gamesPlayed : 0;
    
    // Calculate betting statistics
    let atsWins = 0, atsLosses = 0, atsPushes = 0;
    let overWins = 0, underWins = 0, ouPushes = 0;
    let favoriteAtsWins = 0, favoriteAtsLosses = 0;
    let underdogAtsWins = 0, underdogAtsLosses = 0;
    
    // Process betting data
    for (const game of completedGames) {
      const bettingLine = bettingData.find((line: any) => line.game_id === game.id);
      if (!bettingLine) continue;
      
      const isHome = game.home_team === team;
      const teamScore = isHome ? game.home_points : game.away_points;
      const opponentScore = isHome ? game.away_points : game.home_points;
      const actualMargin = teamScore - opponentScore;
      
      // Find the relevant betting line
      const line = bettingLine.lines?.[0];
      if (!line) continue;
      
      const spread = isHome ? line.spread : -line.spread;
      const overUnder = line.formatted_spread;
      
      // ATS calculation
      if (spread !== undefined) {
        const atsMargin = actualMargin + spread;
        if (Math.abs(atsMargin) < 0.5) {
          atsPushes++;
        } else if (atsMargin > 0) {
          atsWins++;
          
          // Favorite vs Underdog ATS
          if (spread < 0) { // Team was favorite
            favoriteAtsWins++;
          } else { // Team was underdog
            underdogAtsWins++;
          }
        } else {
          atsLosses++;
          
          // Favorite vs Underdog ATS
          if (spread < 0) { // Team was favorite
            favoriteAtsLosses++;
          } else { // Team was underdog
            underdogAtsLosses++;
          }
        }
      }
      
      // Over/Under calculation
      if (overUnder !== undefined) {
        const totalPoints = teamScore + opponentScore;
        const ouDiff = Math.abs(totalPoints - overUnder);
        
        if (ouDiff < 0.5) {
          ouPushes++;
        } else if (totalPoints > overUnder) {
          overWins++;
        } else {
          underWins++;
        }
      }
    }
    
    // Calculate percentages
    const totalAtsGames = atsWins + atsLosses;
    const atsPercentage = totalAtsGames > 0 ? (atsWins / totalAtsGames) * 100 : 0;
    
    const totalOuGames = overWins + underWins;
    const overUnderPercentage = totalOuGames > 0 ? (overWins / totalOuGames) * 100 : 0;
    
    const totalFavAtsGames = favoriteAtsWins + favoriteAtsLosses;
    const favoriteAtsPercentage = totalFavAtsGames > 0 ? (favoriteAtsWins / totalFavAtsGames) * 100 : 0;
    
    const totalDogAtsGames = underdogAtsWins + underdogAtsLosses;
    const underdogAtsPercentage = totalDogAtsGames > 0 ? (underdogAtsWins / totalDogAtsGames) * 100 : 0;
    
    // Get Strength of Schedule
    const sosEntry = sosData.find((entry: any) => entry.team === team);
    const strengthOfSchedule = sosEntry?.sos || 0;
    const strengthOfScheduleRank = sosEntry?.sos_rank || 0;
    
    // Format L5 record
    const last5Record = {
      wins: last5Games.filter(g => g === 'W').length,
      losses: last5Games.filter(g => g === 'L').length
    };
    
    return {
      team,
      pointsFor,
      pointsAgainst,
      gamesPlayed,
      pointsForPerGame: Math.round(pointsForPerGame * 10) / 10,
      pointsAgainstPerGame: Math.round(pointsAgainstPerGame * 10) / 10,
      margin,
      marginPerGame: Math.round(marginPerGame * 10) / 10,
      atsWins,
      atsLosses,
      atsPushes,
      atsPercentage: Math.round(atsPercentage * 10) / 10,
      overWins,
      underWins,
      ouPushes,
      overUnderPercentage: Math.round(overUnderPercentage * 10) / 10,
      favoriteAtsWins,
      favoriteAtsLosses,
      favoriteAtsPercentage: Math.round(favoriteAtsPercentage * 10) / 10,
      underdogAtsWins,
      underdogAtsLosses,
      underdogAtsPercentage: Math.round(underdogAtsPercentage * 10) / 10,
      last5Games: last5Games.join('-'),
      last5Record,
      strengthOfSchedule: Math.round(strengthOfSchedule * 100) / 100,
      strengthOfScheduleRank
    };
    
  } catch (error) {
    console.error(`Error calculating statistics for ${team}:`, error);
    return null;
  }
}

/**
 * Batch calculate statistics for multiple teams
 */
export async function calculateMultipleTeamStats(teams: string[], year: number = 2025): Promise<Map<string, TeamStatistics>> {
  const results = new Map<string, TeamStatistics>();
  
  console.log(`📊 Calculating stats for ${teams.length} teams`);
  
  // Process teams in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < teams.length; i += batchSize) {
    const batch = teams.slice(i, i + batchSize);
    
    const batchPromises = batch.map(team => calculateTeamStatistics(team, year));
    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach((stats, index) => {
      if (stats) {
        results.set(batch[index], stats);
      }
    });
    
    // Small delay between batches
    if (i + batchSize < teams.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Calculated stats for ${results.size}/${teams.length} teams`);
  return results;
}