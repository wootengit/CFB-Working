// Autonomous CFB Analysis API
// Integrates Claude Code subagent orchestration for hedge fund-style predictions
// Route: /api/autonomous-analysis?year=2025&week=1

import { NextRequest, NextResponse } from 'next/server'
import { processWeeklyGames } from '@/lib/cfb-ai-hedge-fund'
import { cfbOrchestrator } from '@/lib/claude-subagent-orchestrator'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = parseInt(searchParams.get('year') || '2025')
  const week = parseInt(searchParams.get('week') || '1')
  const enableSubagents = searchParams.get('subagents') !== 'false'

  try {
    console.log(`🤖 Autonomous Analysis API - Year: ${year}, Week: ${week}, Subagents: ${enableSubagents}`)
    
    const overallStartTime = Date.now()
    
    // Step 1: Process all games for the week (data gathering)
    console.log('📊 Step 1: Processing weekly games...')
    const dataProcessingStart = Date.now()
    const gameContexts = await processWeeklyGames(year, week)
    const dataProcessingTime = Date.now() - dataProcessingStart
    
    if (gameContexts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No games found for the specified week',
        year,
        week,
        totalGames: 0,
        predictions: []
      })
    }

    console.log(`✅ Data processing complete: ${gameContexts.length} games in ${dataProcessingTime}ms`)

    // Step 2: Run autonomous AI analysis using Claude subagents
    console.log('🧠 Step 2: Launching autonomous AI agents...')
    const analysisStart = Date.now()
    
    let orchestrationResults
    if (enableSubagents) {
      orchestrationResults = await cfbOrchestrator.processWeeklyGames(gameContexts)
    } else {
      // Fallback to basic analysis without subagents
      orchestrationResults = gameContexts.map(game => ({
        gameId: game.gameId,
        prediction: {
          gameId: game.gameId,
          matchup: game.matchup,
          recommendation: 'ANALYSIS_PENDING',
          confidence: 'LOW',
          primaryReasoning: 'Basic analysis - subagents disabled',
          supportingFactors: game.keyAdvantages.map(adv => adv.description),
          concerningFactors: game.riskFactors.map(risk => risk.description),
          projectedSpread: 0,
          winProbability: 0.5,
          valueRating: 0,
          riskLevel: 'MEDIUM',
          kellyBetSize: 0.05
        },
        confidence: 0.3,
        processingTimeMs: 0,
        agentsUsed: ['basic'],
        validationScore: 0.3
      }))
    }
    
    const analysisTime = Date.now() - analysisStart
    const totalTime = Date.now() - overallStartTime

    console.log(`✅ Autonomous analysis complete: ${orchestrationResults.length} predictions in ${analysisTime}ms`)

    // Step 3: Generate summary statistics
    const summary = generateAnalysisSummary(orchestrationResults)

    return NextResponse.json({
      success: true,
      year,
      week,
      totalGames: gameContexts.length,
      predictionsGenerated: orchestrationResults.length,
      autonomousAnalysis: {
        enabled: enableSubagents,
        processingPipeline: [
          { step: 'dataProcessing', timeMs: dataProcessingTime, status: 'completed' },
          { step: 'autonomousAnalysis', timeMs: analysisTime, status: 'completed' },
          { step: 'total', timeMs: totalTime, status: 'completed' }
        ]
      },
      predictions: orchestrationResults.map(result => ({
        gameId: result.gameId,
        matchup: result.prediction.matchup,
        recommendation: result.prediction.recommendation,
        confidence: result.prediction.confidence,
        primaryReasoning: result.prediction.primaryReasoning,
        winProbability: result.prediction.winProbability,
        valueRating: result.prediction.valueRating,
        kellyBetSize: result.prediction.kellyBetSize,
        riskLevel: result.prediction.riskLevel,
        agentsUsed: result.agentsUsed,
        validationScore: result.validationScore,
        processingTimeMs: result.processingTimeMs
      })),
      summary,
      meta: {
        timestamp: new Date().toISOString(),
        processingTimeMs: totalTime,
        averageGameProcessingMs: Math.round(totalTime / gameContexts.length),
        systemLoad: 'OPTIMAL',
        hedgeFundMode: enableSubagents ? 'ACTIVE' : 'DISABLED'
      }
    })

  } catch (error) {
    console.error('❌ Autonomous Analysis API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Autonomous analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      year,
      week,
      systemStatus: 'ERROR'
    }, { status: 500 })
  }
}

/**
 * ANALYSIS SUMMARY GENERATOR
 * Creates hedge fund-style performance metrics
 */
function generateAnalysisSummary(results: any[]) {
  if (results.length === 0) return null

  const recommendations = results.map(r => r.prediction.recommendation)
  const confidenceLevels = results.map(r => r.prediction.confidence)
  const validationScores = results.map(r => r.validationScore)
  
  // Recommendation distribution
  const recCounts = {
    STRONG_HOME: recommendations.filter(r => r === 'STRONG_HOME').length,
    LEAN_HOME: recommendations.filter(r => r === 'LEAN_HOME').length,
    STRONG_AWAY: recommendations.filter(r => r === 'STRONG_AWAY').length,
    LEAN_AWAY: recommendations.filter(r => r === 'LEAN_AWAY').length,
    PASS: recommendations.filter(r => r === 'PASS').length
  }

  // Confidence distribution
  const confCounts = {
    HIGH: confidenceLevels.filter(c => c === 'HIGH').length,
    MEDIUM: confidenceLevels.filter(c => c === 'MEDIUM').length,
    LOW: confidenceLevels.filter(c => c === 'LOW').length
  }

  // Value opportunities
  const highValueGames = results.filter(r => r.prediction.valueRating > 50).length
  const mediumValueGames = results.filter(r => r.prediction.valueRating > 20).length
  const avgValidationScore = validationScores.reduce((a, b) => a + b, 0) / validationScores.length

  // Portfolio metrics (Kelly sizing)
  const totalKellyAllocation = results
    .filter(r => r.prediction.recommendation !== 'PASS')
    .reduce((sum, r) => sum + r.prediction.kellyBetSize, 0)

  return {
    gameAnalysis: {
      totalGames: results.length,
      actionableGames: results.length - recCounts.PASS,
      passRate: (recCounts.PASS / results.length * 100).toFixed(1) + '%'
    },
    recommendationDistribution: recCounts,
    confidenceDistribution: confCounts,
    valueOpportunities: {
      highValue: highValueGames,
      mediumValue: mediumValueGames,
      valueRate: ((highValueGames + mediumValueGames) / results.length * 100).toFixed(1) + '%'
    },
    portfolioMetrics: {
      averageValidationScore: avgValidationScore.toFixed(3),
      totalKellyAllocation: totalKellyAllocation.toFixed(3),
      averageKellySize: (totalKellyAllocation / Math.max(results.length - recCounts.PASS, 1)).toFixed(3),
      riskAdjustedGames: results.filter(r => r.prediction.riskLevel === 'LOW').length
    },
    systemPerformance: {
      averageProcessingTimeMs: Math.round(
        results.reduce((sum, r) => sum + r.processingTimeMs, 0) / results.length
      ),
      agentUtilization: {
        gameAnalyst: results.filter(r => r.agentsUsed.includes('game-analyst')).length,
        marketValidator: results.filter(r => r.agentsUsed.includes('market-validator')).length,
        riskAssessor: results.filter(r => r.agentsUsed.includes('risk-assessor')).length
      }
    }
  }
}