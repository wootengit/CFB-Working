// Weekly CFB AI Predictions API
// Processes entire week of games for hedge fund-style analysis
// Route: /api/weekly-predictions?year=2024&week=1

import { NextRequest, NextResponse } from 'next/server'
import { processWeeklyGames, generateLLMContext, GameAnalysisContext } from '@/lib/cfb-ai-hedge-fund'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = parseInt(searchParams.get('year') || '2024')
  const week = parseInt(searchParams.get('week') || '1')
  const format = searchParams.get('format') || 'json' // 'json' or 'llm'

  try {
    console.log(`🏈 Weekly Predictions API - Year: ${year}, Week: ${week}`)
    
    const startTime = Date.now()
    
    // Process all games for the week
    const gameContexts = await processWeeklyGames(year, week)
    
    const endTime = Date.now()
    const processingTime = endTime - startTime

    console.log(`✅ Processed ${gameContexts.length} games in ${processingTime}ms`)

    // Return format optimized for LLM consumption
    if (format === 'llm') {
      const llmContexts = gameContexts.map(game => ({
        gameId: game.gameId,
        matchup: game.matchup,
        llmContext: generateLLMContext(game),
        dataQuality: game.dataQuality.overallScore
      }))

      return NextResponse.json({
        success: true,
        week,
        year,
        totalGames: llmContexts.length,
        format: 'LLM_OPTIMIZED',
        games: llmContexts,
        meta: {
          processingTimeMs: processingTime,
          timestamp: new Date().toISOString(),
          note: 'Each game context is isolated to prevent cross-contamination'
        }
      })
    }

    // Return standard JSON format
    return NextResponse.json({
      success: true,
      week,
      year,
      totalGames: gameContexts.length,
      games: gameContexts,
      summary: generateWeekSummary(gameContexts),
      meta: {
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        averageDataQuality: calculateAverageDataQuality(gameContexts)
      }
    })

  } catch (error) {
    console.error('❌ Weekly Predictions API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      week,
      year
    }, { status: 500 })
  }
}

function generateWeekSummary(games: GameAnalysisContext[]) {
  const totalGames = games.length
  const gamesWithBettingLines = games.filter(g => g.dataQuality.bettingLinesAvailable).length
  const gamesWithMITData = games.filter(g => g.dataQuality.mitFieldsComplete).length
  
  const significantValueGames = games.filter(g => 
    g.bettingLines.marketValue !== 'FAIR_LINE'
  ).length

  const highConfidenceGames = games.filter(g =>
    g.keyAdvantages.some(adv => adv.magnitude === 'HIGH')
  ).length

  return {
    totalGames,
    dataAvailability: {
      bettingLines: `${gamesWithBettingLines}/${totalGames}`,
      mitResearchData: `${gamesWithMITData}/${totalGames}`,
      completeness: ((gamesWithBettingLines + gamesWithMITData) / (totalGames * 2) * 100).toFixed(0) + '%'
    },
    opportunityMetrics: {
      significantValueGames,
      highConfidenceGames,
      analysisReady: games.filter(g => g.dataQuality.overallScore === 'EXCELLENT').length
    }
  }
}

function calculateAverageDataQuality(games: GameAnalysisContext[]): string {
  const qualityScores = { 'EXCELLENT': 4, 'GOOD': 3, 'FAIR': 2, 'POOR': 1 }
  const totalScore = games.reduce((sum, game) => sum + qualityScores[game.dataQuality.overallScore], 0)
  const averageScore = totalScore / games.length
  
  if (averageScore >= 3.5) return 'EXCELLENT'
  if (averageScore >= 2.5) return 'GOOD' 
  if (averageScore >= 1.5) return 'FAIR'
  return 'POOR'
}