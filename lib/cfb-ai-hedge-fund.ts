// CFB AI Hedge Fund System
// Autonomous weekly game analysis using specialized AI agents
// Designed for Claude Code subagent orchestration

import { fetchEnhancedStandings } from './cfbd-api'
import { fetchWeeklyOdds } from './sportsbook-odds'
import { supabase } from './supabase'

// Types for AI-optimized data structures
export interface GameAnalysisContext {
  gameId: string
  matchup: string
  week: number
  year: number
  
  // Core MIT predictors (minimal context)
  homeTeamMetrics: TeamMetrics
  awayTeamMetrics: TeamMetrics
  
  // Market intelligence
  bettingLines: BettingContext
  
  // Distilled insights (LLM-friendly)
  keyAdvantages: KeyAdvantage[]
  riskFactors: RiskFactor[]
  
  // Confidence scoring
  dataQuality: DataQuality
}

export interface TeamMetrics {
  name: string
  record: string
  conference: string
  
  // MIT Research Tier 1 (80%+ accuracy)
  spPlusRating: number        // Primary predictor
  spPlusRanking: number
  explosiveness: number       // 86% correlation when superior
  offensePPA: number         // Neural network predictor
  defensePPA: number
  offensiveEfficiency: number
  defensiveEfficiency: number
  
  // Supporting context
  strengthOfSchedule: number
  recentForm: string         // Last 3 games
  homeFieldAdvantage?: number // If applicable
}

export interface BettingContext {
  currentSpread: number
  impliedHomeWinProb: number
  impliedAwayWinProb: number
  overUnder: number
  
  // Value detection
  modelProjectedSpread: number
  marketValue: 'SIGNIFICANT_HOME' | 'SIGNIFICANT_AWAY' | 'FAIR_LINE'
  valuePoints: number
}

export interface KeyAdvantage {
  category: 'SP_PLUS' | 'EXPLOSIVENESS' | 'PPA' | 'EFFICIENCY' | 'MARKET_VALUE'
  team: 'HOME' | 'AWAY'
  magnitude: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  confidenceScore: number
}

export interface RiskFactor {
  type: 'EARLY_SEASON' | 'RIVALRY_GAME' | 'WEATHER' | 'INJURIES' | 'TRAVEL' | 'REST'
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
}

export interface DataQuality {
  mitFieldsComplete: boolean
  bettingLinesAvailable: boolean
  recentFormComplete: boolean
  overallScore: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
}

export interface AIGamePrediction {
  gameId: string
  matchup: string
  
  // Primary recommendation
  recommendation: 'STRONG_HOME' | 'LEAN_HOME' | 'STRONG_AWAY' | 'LEAN_AWAY' | 'PASS'
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  
  // Reasoning (LLM-friendly)
  primaryReasoning: string
  supportingFactors: string[]
  concerningFactors: string[]
  
  // Quantitative
  projectedSpread: number
  winProbability: number
  valueRating: number        // -100 to +100
  
  // Risk assessment
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  kellyBetSize: number       // 0-1 scale for position sizing
}

/**
 * WEEKLY BATCH PROCESSOR
 * Fetches all games for a week and processes them individually
 */
export async function processWeeklyGames(year: number, week: number): Promise<GameAnalysisContext[]> {
  console.log(`🏈 Processing Week ${week} ${year} - Hedge Fund Style`)
  
  try {
    // Fetch all required data in parallel
    const [standingsData, gamesData, oddsData] = await Promise.all([
      fetchEnhancedStandings(year),
      fetchWeekGames(year, week),
      fetchWeeklyOdds({ year, week, seasonType: 'regular' })
    ])
    
    if (!standingsData.success) {
      throw new Error('Failed to fetch team metrics')
    }
    
    // Create lookup maps for efficiency
    const teamMetricsMap = new Map(
      standingsData.data.map(team => [team.team.toLowerCase(), team])
    )
    
    const oddsMap = new Map(
      oddsData.success ? oddsData.data.map(game => [
        `${game.homeTeam.toLowerCase()}_${game.awayTeam.toLowerCase()}`, game
      ]) : []
    )
    
    // Process each game independently (prevents context contamination)
    const gameContexts: GameAnalysisContext[] = []
    
    for (const game of gamesData) {
      const context = await createGameContext(
        game, 
        teamMetricsMap, 
        oddsMap, 
        year, 
        week
      )
      
      if (context) {
        gameContexts.push(context)
      }
    }
    
    console.log(`✅ Processed ${gameContexts.length} games for Week ${week}`)
    return gameContexts
    
  } catch (error) {
    console.error('❌ Weekly processing failed:', error)
    return []
  }
}

/**
 * CREATE LLM-OPTIMIZED GAME CONTEXT
 * Distills complex data into clean, focused context for AI analysis
 */
async function createGameContext(
  game: any,
  teamMetricsMap: Map<string, any>,
  oddsMap: Map<string, any>,
  year: number,
  week: number
): Promise<GameAnalysisContext | null> {
  
  const homeTeam = game.homeTeam || game.home_team
  const awayTeam = game.awayTeam || game.away_team
  
  if (!homeTeam || !awayTeam) return null
  
  // Get team metrics
  const homeMetrics = teamMetricsMap.get(homeTeam.toLowerCase())
  const awayMetrics = teamMetricsMap.get(awayTeam.toLowerCase())
  
  if (!homeMetrics || !awayMetrics) return null
  
  // Get betting context
  const odds = oddsMap.get(`${homeTeam.toLowerCase()}_${awayTeam.toLowerCase()}`)
  
  // Create distilled team metrics
  const homeTeamMetrics: TeamMetrics = {
    name: homeTeam,
    record: `${homeMetrics.wins || 0}-${homeMetrics.losses || 0}`,
    conference: homeMetrics.conference || '',
    spPlusRating: homeMetrics.spPlusRating || 0,
    spPlusRanking: homeMetrics.spPlusRanking || 999,
    explosiveness: homeMetrics.explosiveness || 0,
    offensePPA: homeMetrics.offensePPA || 0,
    defensePPA: homeMetrics.defensePPA || 0,
    offensiveEfficiency: homeMetrics.offensiveEfficiency || 0,
    defensiveEfficiency: homeMetrics.defensiveEfficiency || 0,
    strengthOfSchedule: homeMetrics.strengthOfSchedule || 0,
    recentForm: 'TBD', // Would need game log analysis
    homeFieldAdvantage: 3 // Standard assumption
  }
  
  const awayTeamMetrics: TeamMetrics = {
    name: awayTeam,
    record: `${awayMetrics.wins || 0}-${awayMetrics.losses || 0}`,
    conference: awayMetrics.conference || '',
    spPlusRating: awayMetrics.spPlusRating || 0,
    spPlusRanking: awayMetrics.spPlusRanking || 999,
    explosiveness: awayMetrics.explosiveness || 0,
    offensePPA: awayMetrics.offensePPA || 0,
    defensePPA: awayMetrics.defensePPA || 0,
    offensiveEfficiency: awayMetrics.offensiveEfficiency || 0,
    defensiveEfficiency: awayMetrics.defensiveEfficiency || 0,
    strengthOfSchedule: awayMetrics.strengthOfSchedule || 0,
    recentForm: 'TBD'
  }
  
  // Create betting context
  const spDifferential = homeTeamMetrics.spPlusRating - awayTeamMetrics.spPlusRating
  const projectedSpread = spDifferential * 0.3 // SP+ to spread conversion
  
  const bettingLines: BettingContext = {
    currentSpread: odds?.spread || 0,
    impliedHomeWinProb: odds?.impliedHomeWinPct || 0.5,
    impliedAwayWinProb: odds?.impliedAwayWinPct || 0.5,
    overUnder: odds?.overUnder || 0,
    modelProjectedSpread: projectedSpread,
    marketValue: Math.abs(projectedSpread - (odds?.spread || 0)) > 3 
      ? (projectedSpread > (odds?.spread || 0) ? 'SIGNIFICANT_HOME' : 'SIGNIFICANT_AWAY')
      : 'FAIR_LINE',
    valuePoints: Math.abs(projectedSpread - (odds?.spread || 0))
  }
  
  // Generate key advantages (LLM-digestible insights)
  const keyAdvantages: KeyAdvantage[] = []
  
  // SP+ Advantage
  if (Math.abs(spDifferential) > 8) {
    keyAdvantages.push({
      category: 'SP_PLUS',
      team: spDifferential > 0 ? 'HOME' : 'AWAY',
      magnitude: Math.abs(spDifferential) > 15 ? 'HIGH' : 'MEDIUM',
      description: `${Math.abs(spDifferential).toFixed(1)} point SP+ advantage (72-86% correlation)`,
      confidenceScore: Math.min(Math.abs(spDifferential) / 20, 1)
    })
  }
  
  // Explosiveness Advantage
  const explosivenessDiff = homeTeamMetrics.explosiveness - awayTeamMetrics.explosiveness
  if (Math.abs(explosivenessDiff) > 0.2) {
    keyAdvantages.push({
      category: 'EXPLOSIVENESS',
      team: explosivenessDiff > 0 ? 'HOME' : 'AWAY',
      magnitude: Math.abs(explosivenessDiff) > 0.5 ? 'HIGH' : 'MEDIUM',
      description: `${Math.abs(explosivenessDiff).toFixed(2)} explosiveness edge (86% win rate when superior)`,
      confidenceScore: Math.min(Math.abs(explosivenessDiff) / 0.8, 1)
    })
  }
  
  // Market Value
  if (bettingLines.marketValue !== 'FAIR_LINE') {
    keyAdvantages.push({
      category: 'MARKET_VALUE',
      team: bettingLines.marketValue === 'SIGNIFICANT_HOME' ? 'HOME' : 'AWAY',
      magnitude: bettingLines.valuePoints > 6 ? 'HIGH' : 'MEDIUM',
      description: `${bettingLines.valuePoints.toFixed(1)} point market value detected`,
      confidenceScore: Math.min(bettingLines.valuePoints / 10, 1)
    })
  }
  
  // Risk factors
  const riskFactors: RiskFactor[] = []
  
  if (week <= 3) {
    riskFactors.push({
      type: 'EARLY_SEASON',
      impact: 'MEDIUM',
      description: 'Early season - teams still finding identity'
    })
  }
  
  // Data quality assessment
  const dataQuality: DataQuality = {
    mitFieldsComplete: !!(homeMetrics.spPlusRating && awayMetrics.spPlusRating),
    bettingLinesAvailable: !!odds,
    recentFormComplete: false, // Would need implementation
    overallScore: !!odds && homeMetrics.spPlusRating ? 'EXCELLENT' : 'GOOD'
  }
  
  return {
    gameId: `${year}_${week}_${homeTeam}_${awayTeam}`,
    matchup: `${awayTeam} @ ${homeTeam}`,
    week,
    year,
    homeTeamMetrics,
    awayTeamMetrics,
    bettingLines,
    keyAdvantages,
    riskFactors,
    dataQuality
  }
}

/**
 * FETCH WEEK'S GAMES
 * Gets all games for a specific week
 */
async function fetchWeekGames(year: number, week: number): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.collegefootballdata.com/games?year=${year}&week=${week}&seasonType=regular`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CFBD_API_KEY || ''}`,
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Games API error: ${response.status}`)
    }
    
    return await response.json()
    
  } catch (error) {
    console.error('Error fetching week games:', error)
    return []
  }
}

/**
 * LLM-OPTIMIZED CONTEXT GENERATOR
 * Creates clean, focused context for AI agent analysis
 */
export function generateLLMContext(game: GameAnalysisContext): string {
  return `
CFB GAME ANALYSIS CONTEXT - ${game.matchup}

## CORE MATCHUP DATA
- Game: ${game.awayTeamMetrics.name} (${game.awayTeamMetrics.record}) @ ${game.homeTeamMetrics.name} (${game.homeTeamMetrics.record})
- Week: ${game.week}, Year: ${game.year}
- Data Quality: ${game.dataQuality.overallScore}

## MIT RESEARCH PREDICTORS (Tier 1 - 80%+ Accuracy)

### SP+ RATINGS (Primary Predictor - 72-86% Correlation)
- ${game.homeTeamMetrics.name}: ${game.homeTeamMetrics.spPlusRating.toFixed(1)} (Rank #${game.homeTeamMetrics.spPlusRanking})
- ${game.awayTeamMetrics.name}: ${game.awayTeamMetrics.spPlusRating.toFixed(1)} (Rank #${game.awayTeamMetrics.spPlusRanking})
- Differential: ${(game.homeTeamMetrics.spPlusRating - game.awayTeamMetrics.spPlusRating).toFixed(1)} favoring ${game.homeTeamMetrics.spPlusRating > game.awayTeamMetrics.spPlusRating ? game.homeTeamMetrics.name : game.awayTeamMetrics.name}

### EXPLOSIVENESS (86% Win Rate When Superior)
- ${game.homeTeamMetrics.name}: ${game.homeTeamMetrics.explosiveness.toFixed(2)}
- ${game.awayTeamMetrics.name}: ${game.awayTeamMetrics.explosiveness.toFixed(2)}
- Advantage: ${game.homeTeamMetrics.explosiveness > game.awayTeamMetrics.explosiveness ? game.homeTeamMetrics.name : game.awayTeamMetrics.name}

### PPA NEURAL NETWORK
- ${game.homeTeamMetrics.name}: Off ${game.homeTeamMetrics.offensePPA.toFixed(2)}, Def ${game.homeTeamMetrics.defensePPA.toFixed(2)}
- ${game.awayTeamMetrics.name}: Off ${game.awayTeamMetrics.offensePPA.toFixed(2)}, Def ${game.awayTeamMetrics.defensePPA.toFixed(2)}

## BETTING MARKET INTELLIGENCE
- Current Spread: ${game.homeTeamMetrics.name} ${game.bettingLines.currentSpread > 0 ? '+' : ''}${game.bettingLines.currentSpread}
- Model Projects: ${game.homeTeamMetrics.name} ${game.bettingLines.modelProjectedSpread > 0 ? '+' : ''}${game.bettingLines.modelProjectedSpread.toFixed(1)}
- Market Value: ${game.bettingLines.marketValue} (${game.bettingLines.valuePoints.toFixed(1)} points)
- Over/Under: ${game.bettingLines.overUnder}

## KEY ADVANTAGES IDENTIFIED
${game.keyAdvantages.map(adv => 
  `- ${adv.category}: ${adv.team === 'HOME' ? game.homeTeamMetrics.name : game.awayTeamMetrics.name} (${adv.magnitude}) - ${adv.description}`
).join('\n')}

## RISK FACTORS
${game.riskFactors.map(risk => 
  `- ${risk.type}: ${risk.impact} - ${risk.description}`
).join('\n')}

## ANALYSIS TASK
Based on MIT research correlations and market intelligence, provide:
1. Win prediction with confidence level
2. Primary reasoning (2-3 key factors)
3. Risk assessment
4. Recommended bet size (Kelly criterion scale 0-1)
`.trim()
}

/**
 * SAVE PREDICTIONS TO DATABASE
 * Stores AI predictions for tracking and backtesting
 */
export async function savePrediction(prediction: AIGamePrediction): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ai_predictions')
      .upsert({
        game_id: prediction.gameId,
        matchup: prediction.matchup,
        recommendation: prediction.recommendation,
        confidence: prediction.confidence,
        reasoning: prediction.primaryReasoning,
        projected_spread: prediction.projectedSpread,
        win_probability: prediction.winProbability,
        value_rating: prediction.valueRating,
        kelly_bet_size: prediction.kellyBetSize,
        created_at: new Date().toISOString()
      }, { onConflict: 'game_id' })
    
    if (error) throw error
    return true
    
  } catch (error) {
    console.error('Error saving prediction:', error)
    return false
  }
}