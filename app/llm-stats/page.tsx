'use client'

import React, { useState, useEffect } from 'react'

interface LLMAnalysis {
  success: boolean
  matchup: string
  year: number
  week: number
  analysis: {
    tier1_MITResearchPredictors: any
    tier2_BettingIntelligence: any
    tier3_SituationalContext: any
    llmDecisionMatrix: any
    dataQuality: any
  }
  metadata: any
}

export default function LLMStatsPage() {
  const [homeTeam, setHomeTeam] = useState('Georgia')
  const [awayTeam, setAwayTeam] = useState('Alabama')
  const [year, setYear] = useState(2024)
  const [week, setWeek] = useState(1)
  const [analysis, setAnalysis] = useState<LLMAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/llm-analysis?homeTeam=${homeTeam}&awayTeam=${awayTeam}&year=${year}&week=${week}`
      )
      const data = await response.json()

      if (data.success) {
        setAnalysis(data)
      } else {
        setError(data.error || 'Failed to fetch analysis')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  const formatValue = (value: number | undefined, decimals: number = 2): string => {
    if (value === undefined || value === null) return 'N/A'
    return value.toFixed(decimals)
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return '#22c55e'
      case 'MEDIUM': return '#f59e0b'
      case 'LOW': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getAdvantageColor = (advantage: string, teamType: 'HOME' | 'AWAY') => {
    if (advantage === teamType) return '#22c55e'
    if (advantage === (teamType === 'HOME' ? 'AWAY' : 'HOME')) return '#ef4444'
    return '#6b7280'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #475569',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#f1f5f9',
            margin: '0 0 8px 0',
            letterSpacing: '-0.025em'
          }}>
            🧠 ULTIMATE LLM BETTING INTELLIGENCE
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            margin: '0 0 20px 0',
            fontWeight: '500'
          }}>
            MIT Research-Validated Predictors • Real-Time Betting Intelligence • Systematic LLM Analysis
          </p>

          {/* Team Selection */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 120px 120px auto',
            gap: '12px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                AWAY TEAM
              </label>
              <input
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter away team"
              />
            </div>

            <div>
              <label style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                HOME TEAM
              </label>
              <input
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter home team"
              />
            </div>

            <div>
              <label style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                YEAR
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                WEEK
              </label>
              <input
                type="number"
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              onClick={fetchAnalysis}
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: loading ? '#374151' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'ANALYZING...' : 'ANALYZE'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            border: '1px solid #475569'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>🧠</div>
            <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600' }}>
              Processing MIT Research Data...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #dc2626',
            marginBottom: '24px'
          }}>
            <div style={{ color: '#fef2f2', fontSize: '16px', fontWeight: '600' }}>
              ❌ Analysis Error: {error}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && analysis.success && (
          <div style={{ display: 'grid', gap: '24px' }}>
            
            {/* LLM Decision Matrix - TOP PRIORITY */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #3b82f6',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}>
              <h2 style={{ 
                color: '#3b82f6', 
                fontSize: '24px', 
                fontWeight: '800', 
                margin: '0 0 20px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🎯 LLM DECISION MATRIX
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #475569'
                }}>
                  <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                    PRIMARY PREDICTORS CONVERGENCE
                  </div>
                  <div style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700' }}>
                    {analysis.analysis.llmDecisionMatrix.primaryPredictors.convergenceScore}/3
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                    MIT Predictors Favoring HOME
                  </div>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #475569'
                }}>
                  <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                    CONFIDENCE LEVEL
                  </div>
                  <div style={{ 
                    color: getConfidenceColor(analysis.analysis.llmDecisionMatrix.confidenceFactors.spPlusConfidence), 
                    fontSize: '20px', 
                    fontWeight: '700' 
                  }}>
                    {analysis.analysis.llmDecisionMatrix.confidenceFactors.spPlusConfidence}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                    SP+ Differential Confidence
                  </div>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #475569'
                }}>
                  <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                    RECOMMENDED ACTION
                  </div>
                  <div style={{ 
                    color: analysis.analysis.llmDecisionMatrix.recommendedAction.confidence === 'HIGH' ? '#22c55e' : 
                          analysis.analysis.llmDecisionMatrix.recommendedAction.confidence === 'MEDIUM' ? '#f59e0b' : '#ef4444',
                    fontSize: '16px', 
                    fontWeight: '700' 
                  }}>
                    {analysis.analysis.llmDecisionMatrix.recommendedAction.recommendation}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '4px' }}>
                    {analysis.analysis.llmDecisionMatrix.recommendedAction.reasoning}
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 1: MIT Research Predictors */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #22c55e',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)'
            }}>
              <h2 style={{ 
                color: '#22c55e', 
                fontSize: '20px', 
                fontWeight: '700', 
                margin: '0 0 20px 0',
                textTransform: 'uppercase'
              }}>
                ⭐ TIER 1: MIT RESEARCH PREDICTORS (80%+ Accuracy)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* SP+ Differential */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #475569'
                }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                    SP+ RATING DIFFERENTIAL
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>{awayTeam} SP+</div>
                      <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
                        {formatValue(analysis.analysis.tier1_MITResearchPredictors.spPlusDifferential.awayTeamRating, 1)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>{homeTeam} SP+</div>
                      <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
                        {formatValue(analysis.analysis.tier1_MITResearchPredictors.spPlusDifferential.homeTeamRating, 1)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    padding: '8px',
                    border: '1px solid #3b82f6'
                  }}>
                    <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>
                      DIFFERENTIAL: {formatValue(analysis.analysis.tier1_MITResearchPredictors.spPlusDifferential.differential, 1)}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '11px' }}>
                      Advantage: {analysis.analysis.tier1_MITResearchPredictors.spPlusDifferential.advantage} • 72-86% Correlation
                    </div>
                  </div>
                </div>

                {/* Explosiveness Gap */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #475569'
                }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                    EXPLOSIVENESS GAP ⚡
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>{awayTeam} Explosiveness</div>
                      <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
                        {formatValue(analysis.analysis.tier1_MITResearchPredictors.explosivenessGap.awayTeamExplosiveness)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>{homeTeam} Explosiveness</div>
                      <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
                        {formatValue(analysis.analysis.tier1_MITResearchPredictors.explosivenessGap.homeTeamExplosiveness)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '8px',
                    padding: '8px',
                    border: '1px solid #f59e0b'
                  }}>
                    <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600' }}>
                      WIN PROBABILITY: {analysis.analysis.tier1_MITResearchPredictors.explosivenessGap.winProbability}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '11px' }}>
                      Advantage: {analysis.analysis.tier1_MITResearchPredictors.explosivenessGap.advantage} • 86% When Superior
                    </div>
                  </div>
                </div>
              </div>

              {/* PPA Neural Network */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #475569',
                marginTop: '20px'
              }}>
                <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                  🧠 PPA NEURAL NETWORK BATTLE
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{homeTeam} Off PPA</div>
                    <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: '700' }}>
                      {formatValue(analysis.analysis.tier1_MITResearchPredictors.ppaNeuralNetwork.homeOffensePPA)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{homeTeam} Def PPA</div>
                    <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '700' }}>
                      {formatValue(analysis.analysis.tier1_MITResearchPredictors.ppaNeuralNetwork.homeDefensePPA)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{awayTeam} Off PPA</div>
                    <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: '700' }}>
                      {formatValue(analysis.analysis.tier1_MITResearchPredictors.ppaNeuralNetwork.awayOffensePPA)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{awayTeam} Def PPA</div>
                    <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '700' }}>
                      {formatValue(analysis.analysis.tier1_MITResearchPredictors.ppaNeuralNetwork.awayDefensePPA)}
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  border: '1px solid #a855f7',
                  marginTop: '12px'
                }}>
                  <div style={{ color: '#a855f7', fontSize: '12px', fontWeight: '600' }}>
                    NET PPA ADVANTAGE: {analysis.analysis.tier1_MITResearchPredictors.ppaNeuralNetwork.advantage}
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 2: Betting Intelligence */}
            {analysis.analysis.tier2_BettingIntelligence.marketSignals && (
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #f59e0b',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)'
              }}>
                <h2 style={{ 
                  color: '#f59e0b', 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  margin: '0 0 20px 0',
                  textTransform: 'uppercase'
                }}>
                  💰 TIER 2: BETTING MARKET INTELLIGENCE
                </h2>

                {analysis.analysis.tier2_BettingIntelligence.marketSignals.status ? (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #ef4444',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '600' }}>
                      📊 NO BETTING DATA AVAILABLE
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                      Analysis based on MIT research predictors only
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #475569'
                    }}>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                        CURRENT SPREAD
                      </div>
                      <div style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700' }}>
                        {homeTeam} {analysis.analysis.tier2_BettingIntelligence.marketSignals.currentSpread}
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #475569'
                    }}>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                        OVER/UNDER
                      </div>
                      <div style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700' }}>
                        {analysis.analysis.tier2_BettingIntelligence.marketSignals.overUnder}
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #475569'
                    }}>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                        IMPLIED WIN PROB
                      </div>
                      <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>
                        {homeTeam}: {formatValue((analysis.analysis.tier2_BettingIntelligence.marketSignals.impliedHomeWinProb || 0) * 100, 0)}%
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                        {awayTeam}: {formatValue((analysis.analysis.tier2_BettingIntelligence.marketSignals.impliedAwayWinProb || 0) * 100, 0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Data Quality Indicator */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #64748b'
            }}>
              <h3 style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                📊 DATA QUALITY & COMPLETENESS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: analysis.analysis.dataQuality.mitFieldsComplete ? '#22c55e' : '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {analysis.analysis.dataQuality.mitFieldsComplete ? '✅' : '❌'} MIT FIELDS
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: analysis.analysis.dataQuality.bettingDataAvailable ? '#22c55e' : '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {analysis.analysis.dataQuality.bettingDataAvailable ? '✅' : '⚠️'} BETTING LINES
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ⚠️ WEATHER DATA
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ⚠️ RECENT FORM
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}