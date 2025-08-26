// Mock College Football Data for Development and Testing
// MIT Research High-Predictive-Value Fields
// Replace with real API data when CFBD_API_KEY is available

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

// Mock SP+ Ratings Data (2024 Season - Realistic Values)
const MOCK_SP_RATINGS: SPRating[] = [
  // SEC Teams with realistic SP+ ratings
  {
    team: 'Georgia',
    conference: 'SEC',
    rating: 22.4,
    ranking: 2,
    secondOrderWins: 10.8,
    sos: 3.2,
    offenseRating: 18.7,
    defenseRating: 3.7,
    specialTeamsRating: -0.3
  },
  {
    team: 'Alabama',
    conference: 'SEC',
    rating: 20.1,
    ranking: 4,
    secondOrderWins: 9.7,
    sos: 4.1,
    offenseRating: 16.2,
    defenseRating: 3.9,
    specialTeamsRating: 0.8
  },
  {
    team: 'Tennessee',
    conference: 'SEC',
    rating: 15.8,
    ranking: 8,
    secondOrderWins: 8.9,
    sos: 2.8,
    offenseRating: 19.4,
    defenseRating: -3.6,
    specialTeamsRating: 1.2
  },
  {
    team: 'LSU',
    conference: 'SEC',
    rating: 12.7,
    ranking: 15,
    secondOrderWins: 7.8,
    sos: 3.9,
    offenseRating: 11.2,
    defenseRating: 1.5,
    specialTeamsRating: -0.4
  },
  {
    team: 'Auburn',
    conference: 'SEC',
    rating: 8.4,
    ranking: 24,
    secondOrderWins: 6.2,
    sos: 4.7,
    offenseRating: 3.1,
    defenseRating: 5.3,
    specialTeamsRating: 0.6
  },
  {
    team: 'Florida',
    conference: 'SEC',
    rating: 6.2,
    ranking: 31,
    secondOrderWins: 5.8,
    sos: 3.6,
    offenseRating: 1.8,
    defenseRating: 4.4,
    specialTeamsRating: -0.2
  },
  {
    team: 'Kentucky',
    conference: 'SEC',
    rating: 3.1,
    ranking: 45,
    secondOrderWins: 4.7,
    sos: 2.9,
    offenseRating: -2.4,
    defenseRating: 5.5,
    specialTeamsRating: 0.8
  },
  {
    team: 'Texas A&M',
    conference: 'SEC',
    rating: 1.8,
    ranking: 52,
    secondOrderWins: 4.2,
    sos: 4.3,
    offenseRating: -4.1,
    defenseRating: 5.9,
    specialTeamsRating: -0.3
  },
  {
    team: 'Ole Miss',
    conference: 'SEC',
    rating: 4.7,
    ranking: 38,
    secondOrderWins: 5.1,
    sos: 3.4,
    offenseRating: 8.2,
    defenseRating: -3.5,
    specialTeamsRating: 1.1
  },
  {
    team: 'Arkansas',
    conference: 'SEC',
    rating: -1.2,
    ranking: 68,
    secondOrderWins: 3.8,
    sos: 4.1,
    offenseRating: -5.7,
    defenseRating: 4.5,
    specialTeamsRating: 0.2
  },
  {
    team: 'South Carolina',
    conference: 'SEC',
    rating: -0.8,
    ranking: 63,
    secondOrderWins: 4.1,
    sos: 3.2,
    offenseRating: -3.2,
    defenseRating: 2.4,
    specialTeamsRating: 0.6
  },
  {
    team: 'Missouri',
    conference: 'SEC',
    rating: 2.3,
    ranking: 48,
    secondOrderWins: 4.6,
    sos: 2.7,
    offenseRating: 0.8,
    defenseRating: 1.5,
    specialTeamsRating: -0.1
  },
  {
    team: 'Mississippi State',
    conference: 'SEC',
    rating: -3.7,
    ranking: 78,
    secondOrderWins: 3.2,
    sos: 4.2,
    offenseRating: -7.1,
    defenseRating: 3.4,
    specialTeamsRating: -0.5
  },
  {
    team: 'Vanderbilt',
    conference: 'SEC',
    rating: -8.4,
    ranking: 95,
    secondOrderWins: 2.1,
    sos: 4.8,
    offenseRating: -12.7,
    defenseRating: 4.3,
    specialTeamsRating: 0.4
  }
];

// Mock Advanced Stats (Efficiency & Explosiveness)
const MOCK_ADVANCED_STATS: AdvancedTeamStats[] = [
  {
    team: 'Georgia',
    conference: 'SEC',
    offensiveEfficiency: 0.58,
    defensiveEfficiency: 0.41,
    explosiveness: 1.87, // High explosiveness (86% win rate when superior)
    finishing: 0.82,
    fieldPosition: 0.45,
    havoc: 0.19,
    pacing: 67.2,
    redZoneOffense: 0.91,
    redZoneDefense: 0.78,
    thirdDownOffense: 0.47,
    thirdDownDefense: 0.31
  },
  {
    team: 'Alabama',
    conference: 'SEC',
    offensiveEfficiency: 0.54,
    defensiveEfficiency: 0.39,
    explosiveness: 1.71,
    finishing: 0.79,
    fieldPosition: 0.52,
    havoc: 0.17,
    pacing: 71.8,
    redZoneOffense: 0.88,
    redZoneDefense: 0.81,
    thirdDownOffense: 0.44,
    thirdDownDefense: 0.35
  },
  {
    team: 'Tennessee',
    conference: 'SEC',
    offensiveEfficiency: 0.61,
    defensiveEfficiency: 0.54,
    explosiveness: 2.14, // Very high explosiveness
    finishing: 0.74,
    fieldPosition: 0.41,
    havoc: 0.15,
    pacing: 74.3,
    redZoneOffense: 0.85,
    redZoneDefense: 0.68,
    thirdDownOffense: 0.51,
    thirdDownDefense: 0.42
  },
  {
    team: 'LSU',
    conference: 'SEC',
    offensiveEfficiency: 0.49,
    defensiveEfficiency: 0.43,
    explosiveness: 1.52,
    finishing: 0.71,
    fieldPosition: 0.38,
    havoc: 0.16,
    pacing: 69.1,
    redZoneOffense: 0.82,
    redZoneDefense: 0.75,
    thirdDownOffense: 0.39,
    thirdDownDefense: 0.37
  },
  {
    team: 'Auburn',
    conference: 'SEC',
    offensiveEfficiency: 0.42,
    defensiveEfficiency: 0.38,
    explosiveness: 1.28,
    finishing: 0.68,
    fieldPosition: 0.35,
    havoc: 0.21,
    pacing: 66.7,
    redZoneOffense: 0.76,
    redZoneDefense: 0.79,
    thirdDownOffense: 0.35,
    thirdDownDefense: 0.33
  }
];

// Mock PPA Data (Neural Network Predictions)
const MOCK_PPA_DATA: PPAData[] = [
  {
    team: 'Georgia',
    conference: 'SEC',
    season: 2024,
    offensePPA: 0.387,
    defensePPA: -0.241,
    overallPPA: 0.628,
    passingPPA: 0.412,
    rushingPPA: 0.361,
    passingDefPPA: -0.198,
    rushingDefPPA: -0.284,
    downsPPA: { first: 0.419, second: 0.278, third: 0.156, fourth: 0.089 }
  },
  {
    team: 'Alabama',
    conference: 'SEC',
    season: 2024,
    offensePPA: 0.341,
    defensePPA: -0.218,
    overallPPA: 0.559,
    passingPPA: 0.378,
    rushingPPA: 0.304,
    passingDefPPA: -0.176,
    rushingDefPPA: -0.260,
    downsPPA: { first: 0.389, second: 0.251, third: 0.142, fourth: 0.076 }
  },
  {
    team: 'Tennessee',
    conference: 'SEC',
    season: 2024,
    offensePPA: 0.423,
    defensePPA: 0.089,
    overallPPA: 0.334,
    passingPPA: 0.461,
    rushingPPA: 0.385,
    passingDefPPA: 0.112,
    rushingDefPPA: 0.066,
    downsPPA: { first: 0.445, second: 0.298, third: 0.187, fourth: 0.124 }
  }
];

// Mock Team Records
const MOCK_TEAM_RECORDS = [
  {
    team: 'Georgia',
    conference: 'SEC',
    division: 'FBS',
    total: { wins: 10, losses: 2, games: 12 },
    conferenceGames: { wins: 7, losses: 1 }
  },
  {
    team: 'Alabama',
    conference: 'SEC',
    division: 'FBS', 
    total: { wins: 9, losses: 3, games: 12 },
    conferenceGames: { wins: 6, losses: 2 }
  },
  {
    team: 'Tennessee',
    conference: 'SEC',
    division: 'FBS',
    total: { wins: 8, losses: 4, games: 12 },
    conferenceGames: { wins: 5, losses: 3 }
  },
  {
    team: 'LSU',
    conference: 'SEC',
    division: 'FBS',
    total: { wins: 7, losses: 5, games: 12 },
    conferenceGames: { wins: 4, losses: 4 }
  },
  {
    team: 'Auburn',
    conference: 'SEC',
    division: 'FBS',
    total: { wins: 6, losses: 6, games: 12 },
    conferenceGames: { wins: 3, losses: 5 }
  },
  {
    team: 'Florida',
    conference: 'SEC',
    division: 'FBS',
    total: { wins: 5, losses: 7, games: 12 },
    conferenceGames: { wins: 2, losses: 6 }
  }
];

// Mock Team Info
const MOCK_TEAM_INFO = [
  {
    school: 'Georgia',
    mascot: 'Bulldogs',
    color: '#BA0C2F',
    alt_color: '#000000',
    logos: ['https://a.espncdn.com/i/teamlogos/ncaa/500/61.png']
  },
  {
    school: 'Alabama',
    mascot: 'Crimson Tide',
    color: '#9E1B32',
    alt_color: '#FFFFFF',
    logos: ['https://a.espncdn.com/i/teamlogos/ncaa/500/333.png']
  },
  {
    school: 'Tennessee',
    mascot: 'Volunteers',
    color: '#FF8200',
    alt_color: '#FFFFFF', 
    logos: ['https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png']
  }
];

// Mock API Functions
export async function getMockSPRatings(): Promise<SPRatingsResponse> {
  console.log('📊 Using mock SP+ ratings data (MIT research: 72-86% correlation)');
  
  return {
    data: MOCK_SP_RATINGS,
    success: true,
    message: `Mock SP+ ratings for ${MOCK_SP_RATINGS.length} teams (Development Mode)`
  };
}

export async function getMockAdvancedStats(): Promise<AdvancedStatsResponse> {
  console.log('⚡ Using mock advanced stats data (Efficiency & Explosiveness)');
  
  return {
    data: MOCK_ADVANCED_STATS,
    success: true,
    message: `Mock advanced stats for ${MOCK_ADVANCED_STATS.length} teams (Development Mode)`
  };
}

export async function getMockPPAData(): Promise<PPAResponse> {
  console.log('🧠 Using mock PPA data (Neural network predictions)');
  
  return {
    data: MOCK_PPA_DATA,
    success: true,
    message: `Mock PPA data for ${MOCK_PPA_DATA.length} teams (Development Mode)`
  };
}

export async function getMockEnhancedStandings(): Promise<EnhancedStandingsResponse> {
  console.log('🏈 Generating mock enhanced standings with MIT research fields...');
  
  // Create lookup maps
  const spMap = new Map(MOCK_SP_RATINGS.map(item => [item.team, item]));
  const statsMap = new Map(MOCK_ADVANCED_STATS.map(item => [item.team, item]));
  const ppaMap = new Map(MOCK_PPA_DATA.map(item => [item.team, item]));
  const teamInfoMap = new Map(MOCK_TEAM_INFO.map(item => [item.school, item]));

  // Combine data into enhanced format
  const enhancedData: EnhancedTeamData[] = MOCK_TEAM_RECORDS.map(record => {
    const sp = spMap.get(record.team);
    const stats = statsMap.get(record.team);
    const ppa = ppaMap.get(record.team);
    const info = teamInfoMap.get(record.team);

    return {
      // Basic Info
      teamId: Math.floor(Math.random() * 1000),
      team: record.team,
      conference: record.conference,
      division: record.division,
      color: info?.color || '#000000',
      altColor: info?.alt_color || '#FFFFFF',
      logo: info?.logos?.[0] || '',

      // Traditional Stats
      wins: record.total?.wins || 0,
      losses: record.total?.losses || 0,
      ties: 0,
      conferenceWins: record.conferenceGames?.wins || 0,
      conferenceLosses: record.conferenceGames?.losses || 0,
      conferenceTies: 0,

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
      pointsForPerGame: 0,
      pointsAgainstPerGame: 0,
      avgMargin: 0,
      winPct: (record.total?.wins || 0) / Math.max((record.total?.games || 1), 1),
    };
  });

  // Sort by SP+ rating (primary predictor)
  enhancedData.sort((a, b) => b.spPlusRating - a.spPlusRating);

  return {
    data: enhancedData,
    success: true,
    message: `Mock enhanced standings with MIT research fields (Development Mode)`,
    predictiveAccuracy: {
      spPlusCorrelation: 79, // Average from MIT research (72-86%)
      explosiveness: 86,     // Win rate when superior
      efficiency: 74,        // Overall efficiency correlation
    }
  };
}

export function isMockMode(): boolean {
  return !process.env.CFBD_API_KEY;
}