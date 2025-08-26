// MIT Research - High Predictive Value Types for College Football Betting
// Based on research showing 72-86% win correlation rates

/**
 * Tier 1 Priority Fields (Highest Predictive Value)
 * - SP+ Overall Rating: 72-86% win correlation
 * - Offensive/Defensive Efficiency: Core efficiency metrics
 * - Explosiveness Rating: 86% win rate when superior
 * - PPA (Predicted Points Added): Neural network based predictions
 */

// SP+ Ratings Interface (Primary Predictor)
export interface SPRating {
  team: string;
  conference: string;
  rating: number;          // Overall SP+ rating
  ranking: number;         // National ranking
  secondOrderWins: number; // Expected wins based on SP+
  sos: number;            // Strength of Schedule
  offenseRating: number;   // Offensive SP+ rating
  defenseRating: number;   // Defensive SP+ rating
  specialTeamsRating: number;
}

// Advanced Team Statistics (Efficiency Metrics)
export interface AdvancedTeamStats {
  team: string;
  conference: string;
  offensiveEfficiency: number;    // Yards per play efficiency
  defensiveEfficiency: number;    // Opponent yards per play allowed
  explosiveness: number;          // Big play percentage (86% win correlation)
  finishing: number;              // Red zone conversion rates
  fieldPosition: number;          // Average field position
  havoc: number;                 // Defensive havoc rate (TFL, INT, FF)
  pacing: number;                // Plays per minute
  redZoneOffense: number;        // RZ scoring percentage
  redZoneDefense: number;        // RZ defense percentage
  thirdDownOffense: number;      // 3rd down conversion rate
  thirdDownDefense: number;      // 3rd down stop rate
}

// Advanced Standings Team Data
export interface StandingsAdvancedTeam {
  teamId?: number;
  team?: string;
  name?: string;
  conference: string;
  wins: number;
  losses: number;
  ties?: number;
  winPct?: number;
  conferenceWins: number;
  conferenceLosses: number;
  pointsForPerGame: number;
  pointsAgainstPerGame: number;
  avgMargin: number;
  
  // Advanced Metrics
  atsPercentage?: number;
  coverMarginAvg?: number;
  overPercentage?: number;
  favoriteAtsPercentage?: number;
  dogAtsPercentage?: number;
  last5Wins?: number;
  last5Losses?: number;
  last5AtsPercentage?: number;
  sosRank?: number;
  spOverallRank?: number;
  offensivePPA?: number;
  defensivePPA?: number;
  talentRank?: number;
  
  // Logo and branding
  logo?: string;
  logoUrl?: string;
}

// PPA (Predicted Points Added) - Neural Network Predictions
export interface PPAData {
  team: string;
  conference: string;
  season: number;
  offensePPA: number;            // Offensive PPA per play
  defensePPA: number;            // Defensive PPA allowed per play
  overallPPA: number;            // Total PPA differential
  passingPPA: number;            // Passing PPA per attempt
  rushingPPA: number;            // Rushing PPA per attempt
  passingDefPPA: number;         // Passing defense PPA allowed
  rushingDefPPA: number;         // Rushing defense PPA allowed
  downsPPA: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
}

// Enhanced Team Interface with MIT Research Fields
export interface EnhancedTeamData {
  // Basic Info
  teamId: number;
  team: string;
  conference: string;
  division: string;
  color: string;
  altColor: string;
  logo: string;
  
  // Traditional Stats
  wins: number;
  losses: number;
  ties: number;
  conferenceWins: number;
  conferenceLosses: number;
  conferenceTies: number;
  
  // MIT Research Tier 1 Fields (High Predictive Value)
  spPlusRating: number;          // SP+ Overall Rating (72-86% correlation)
  spPlusRanking: number;         // SP+ National Ranking
  offensiveEfficiency: number;    // Offensive efficiency rating
  defensiveEfficiency: number;    // Defensive efficiency rating
  explosiveness: number;          // Explosiveness rating (86% win rate)
  offensePPA: number;            // Offensive PPA (neural network)
  defensePPA: number;            // Defensive PPA (neural network)
  
  // Supporting Metrics
  strengthOfSchedule: number;     // SOS rating
  secondOrderWins: number;       // Expected wins based on advanced metrics
  havocRate: number;             // Defensive havoc rate
  finishingRate: number;         // Red zone efficiency
  fieldPosition: number;         // Average starting field position
  
  // Traditional Metrics (for context)
  pointsForPerGame: number;
  pointsAgainstPerGame: number;
  avgMargin: number;
  winPct: number;
  
  // Betting Context
  atsRecord?: string;
  atsPercentage?: number;
  overUnderRecord?: string;
  overPercentage?: number;
}

// SEC Teams Configuration
export const SEC_TEAMS = [
  'Alabama', 'Georgia', 'Tennessee', 'LSU', 'Auburn', 'Florida',
  'Kentucky', 'Mississippi State', 'Missouri', 'Ole Miss',
  'South Carolina', 'Texas A&M', 'Arkansas', 'Vanderbilt',
  'Texas', 'Oklahoma'  // Added new 2024 members
] as const;

export type SECTeam = typeof SEC_TEAMS[number];

// API Response Interfaces
export interface SPRatingsResponse {
  data: SPRating[];
  success: boolean;
  message?: string;
}

export interface AdvancedStatsResponse {
  data: AdvancedTeamStats[];
  success: boolean;
  message?: string;
}

export interface PPAResponse {
  data: PPAData[];
  success: boolean;
  message?: string;
}

export interface EnhancedStandingsResponse {
  data: EnhancedTeamData[];
  success: boolean;
  message?: string;
  predictiveAccuracy?: {
    spPlusCorrelation: number;      // Correlation percentage for SP+
    explosiveness: number;          // Win rate when superior
    efficiency: number;             // Overall efficiency correlation
  };
}

// Utility Types
export interface PredictiveMetrics {
  team: string;
  predictedWinProbability: number;  // Based on MIT research model
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  keyFactors: string[];            // Top contributing factors
  lastUpdated: string;
}

// Legacy interface for backward compatibility
export interface StandingsAdvancedTeam extends EnhancedTeamData {
  // Keeping existing properties for compatibility
  coverMarginAvg?: number;
  favoriteAtsPercentage?: number;
  dogAtsPercentage?: number;
  last5Wins?: number;
  last5Losses?: number;
  last5AtsPercentage?: number;
  sosRank?: number;
  spOverallRank?: number;
  offensivePPA?: number;
  defensivePPA?: number;
  talentRank?: number;
}

// New Unified Conferences API Types
export interface ConferenceTeamData {
  // Basic Team Info
  id: number;
  name: string;
  abbreviation: string;
  mascot: string;
  conference: string;
  division: 'FBS' | 'FCS';
  
  // Team Colors & Branding
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  logoUrl: string;
  
  // Basic Record
  wins: number;
  losses: number;
  ties: number;
  winPct: number;
  
  // MIT Tier 1 Fields (Highest Predictive Value - 72-86% accuracy)
  spPlusOverall: number;      // SP+ Overall Rating (-20 to +30)
  explosiveness: number;      // Explosiveness Rating (0.8 to 2.2) - 86% win correlation  
  efficiency: number;         // Success Rate (0.5 to 0.8)
  ppaOverall: number;         // PPA Overall (-0.3 to 0.6) - Neural network predictions
  
  // MIT Tier 2 Fields (Strong Supplementary Predictors)
  spPlusOffense: number;      // SP+ Offensive Rating (-15 to +25)
  spPlusDefense: number;      // SP+ Defensive Rating (-15 to +25)
  fpiRating: number;          // Football Power Index (-15 to +25)
  sosRank: number;            // Strength of Schedule Rank (1-130)
  talentRank: number;         // Recruiting Talent Rank (1-130)
  
  // Betting Context Fields
  atsPercentage: number;      // Against The Spread % (35-70%)
  overPercentage: number;     // Over/Under % (35-70%) 
  coverMarginAvg: number;     // Cover Margin Average (-6 to +12)
  
  // Additional Context
  pointsForPerGame: number;
  pointsAgainstPerGame: number;
  avgMargin: number;
  lastUpdated: string;
}

export interface ConferenceMetadata {
  conference: string;
  conferenceFullName: string;
  division: 'FBS' | 'FCS' | 'ALL';
  teamCount: number;
  processingTime: number;
  cached: boolean;
  features: string[];
}

export interface ConferenceDataResult {
  teams: ConferenceTeamData[];
  metadata: ConferenceMetadata;
}

export interface AllConferencesResult {
  teams: ConferenceTeamData[];
  features: string[];
  conferenceBreakdown: Record<string, number>;
}

export interface UnifiedConferencesResponse {
  success: boolean;
  data: ConferenceTeamData[];
  metadata: ConferenceMetadata & {
    timestamp: string;
    queryParams?: any;
    dataIntegrity?: {
      mitTier1Fields: string[];
      mitTier2Fields: string[];
      bettingFields: string[];
      allFieldsPresent: boolean;
      statisticallyRealistic: boolean;
    };
  };
}