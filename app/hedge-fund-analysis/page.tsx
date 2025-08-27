'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, TrendingDown, Brain, Target, AlertTriangle } from 'lucide-react'

interface GameContext {
  gameId: string
  matchup: string
  llmContext: string
  dataQuality: string
}

interface WeeklyPredictionsResponse {
  success: boolean
  week: number
  year: number
  totalGames: number
  format: string
  games: GameContext[]
  meta: {
    processingTimeMs: number
    timestamp: string
    note: string
  }
}

interface AIAnalysisResult {
  gameId: string
  recommendation: string
  confidence: string
  reasoning: string
  winProbability: number
  valueRating: number
}

export default function HedgeFundAnalysisPage() {
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentYear, setCurrentYear] = useState(2025)
  const [weeklyGames, setWeeklyGames] = useState<GameContext[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [processingStats, setProcessingStats] = useState<any>(null)

  const fetchWeeklyGames = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weekly-predictions?year=${currentYear}&week=${currentWeek}&format=llm`)
      const data: WeeklyPredictionsResponse = await response.json()
      
      if (data.success) {
        setWeeklyGames(data.games)
        setProcessingStats(data.meta)
      }
    } catch (error) {
      console.error('Error fetching weekly games:', error)
    } finally {
      setLoading(false)
    }
  }

  const runAutonomousAnalysis = async () => {
    if (weeklyGames.length === 0) return
    
    setAnalyzing(true)
    setAiAnalysis([])
    
    try {
      // Call the autonomous analysis API with Claude Code subagent orchestration
      const response = await fetch(`/api/autonomous-analysis?year=${currentYear}&week=${currentWeek}&subagents=true`)
      const data = await response.json()
      
      if (data.success) {
        // Convert API response to display format
        const analysisResults: AIAnalysisResult[] = data.predictions.map((pred: any) => ({
          gameId: pred.gameId,
          recommendation: pred.recommendation,
          confidence: pred.confidence,
          reasoning: pred.primaryReasoning,
          winProbability: pred.winProbability,
          valueRating: pred.valueRating
        }))
        
        setAiAnalysis(analysisResults)
        setProcessingStats({
          ...processingStats,
          autonomousAnalysis: data.autonomousAnalysis,
          summary: data.summary
        })
      } else {
        console.error('Autonomous analysis failed:', data.error)
      }
    } catch (error) {
      console.error('Error running autonomous analysis:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    fetchWeeklyGames()
  }, [currentWeek, currentYear])

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getValueColor = (value: number) => {
    if (value > 25) return 'text-green-600'
    if (value > 0) return 'text-green-500'
    if (value > -25) return 'text-red-500'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CFB AI Hedge Fund Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Autonomous weekly game analysis using specialized AI agents. Designed for Claude Code subagent orchestration.
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Week Selection & Data Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">Year:</label>
              <select 
                value={currentYear} 
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">Week:</label>
              <select 
                value={currentWeek} 
                onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                {Array.from({length: 15}, (_, i) => (
                  <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                ))}
              </select>
            </div>
            <Button onClick={fetchWeeklyGames} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Refresh Data
            </Button>
          </div>
          
          {processingStats && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Processing Time: {processingStats.processingTimeMs}ms</span>
              <span>Games Found: {weeklyGames.length}</span>
              <span>Last Updated: {new Date(processingStats.timestamp).toLocaleTimeString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Games Overview */}
      {weeklyGames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Week {currentWeek} {currentYear} Games ({weeklyGames.length} total)
            </CardTitle>
            <CardDescription>
              Each game context is isolated to prevent cross-contamination during LLM analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runAutonomousAnalysis} 
                disabled={analyzing || weeklyGames.length === 0}
                className="w-full"
                size="lg"
              >
                {analyzing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {analyzing ? 'Running Autonomous AI Analysis...' : 'Launch Hedge Fund AI Agents'}
              </Button>
              
              {analyzing && (
                <div className="text-center text-sm text-muted-foreground">
                  Processing {aiAnalysis.length} / {weeklyGames.length} games...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary Dashboard */}
      {processingStats?.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Hedge Fund Portfolio Analysis
            </CardTitle>
            <CardDescription>
              Autonomous AI system performance metrics and risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Game Analysis</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Games:</span>
                    <span className="font-mono">{processingStats.summary.gameAnalysis.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actionable:</span>
                    <span className="font-mono">{processingStats.summary.gameAnalysis.actionableGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Rate:</span>
                    <span className="font-mono">{processingStats.summary.gameAnalysis.passRate}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Value Opportunities</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>High Value:</span>
                    <span className="font-mono text-green-600">{processingStats.summary.valueOpportunities.highValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Value:</span>
                    <span className="font-mono text-yellow-600">{processingStats.summary.valueOpportunities.mediumValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value Rate:</span>
                    <span className="font-mono">{processingStats.summary.valueOpportunities.valueRate}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Portfolio Risk</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Kelly Allocation:</span>
                    <span className="font-mono">{processingStats.summary.portfolioMetrics.totalKellyAllocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Kelly Size:</span>
                    <span className="font-mono">{processingStats.summary.portfolioMetrics.averageKellySize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validation Score:</span>
                    <span className="font-mono">{processingStats.summary.portfolioMetrics.averageValidationScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {aiAnalysis.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">AI Hedge Fund Predictions</h2>
          
          <div className="grid gap-6">
            {weeklyGames.map((game, index) => {
              const analysis = aiAnalysis.find(a => a.gameId === game.gameId)
              
              return (
                <Card key={game.gameId} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{game.matchup}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {game.dataQuality}
                        </Badge>
                        {analysis && (
                          <Badge className={getConfidenceColor(analysis.confidence)}>
                            {analysis.confidence} CONFIDENCE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {analysis ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* AI Recommendation */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            AI Recommendation
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Pick:</span>
                              <Badge variant="secondary" className="font-medium">
                                {analysis.recommendation.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Win Probability:</span>
                              <span className="font-mono">
                                {(analysis.winProbability * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Value Rating:</span>
                              <span className={`font-mono font-semibold ${getValueColor(analysis.valueRating)}`}>
                                {analysis.valueRating > 0 ? '+' : ''}{analysis.valueRating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Reasoning */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Analysis
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis.reasoning}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        {analyzing ? 'Processing...' : 'Click "Launch Hedge Fund AI Agents" to analyze'}
                      </div>
                    )}

                    {/* LLM Context Preview */}
                    <details className="mt-4">
                      <summary className="cursor-pointer font-medium text-sm text-muted-foreground hover:text-foreground">
                        View Raw MIT Research Context (for LLM analysis)
                      </summary>
                      <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-96">
                        {game.llmContext}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && weeklyGames.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Games Found</h3>
            <p className="text-muted-foreground">
              No games available for Week {currentWeek} of {currentYear}. 
              Try selecting a different week.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}