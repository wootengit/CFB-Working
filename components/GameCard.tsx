/**
 * Game Card Component - Perfect Week 1 Design Replication
 * Reusable game card with all betting data, AI analysis, weather, and team logos
 */
'use client'

import React from 'react'
import { getTeamLogo } from '../utils/teamLogos'

// Get network badge color
const getNetworkColor = (network: string): string => {
  const networkColors: Record<string, string> = {
    'ESPN': '#ef4444',
    'ABC': '#3b82f6', 
    'FOX': '#f97316',
    'CBS': '#059669',
    'NBC': '#8b5cf6',
    'FS1': '#f59e0b',
    'FS2': '#f59e0b',
    'ESPN2': '#dc2626',
    'ESPNU': '#dc2626',
    'CBSSN': '#059669',
    'ACCN': '#1e40af',
    'SEC Network': '#dc2626',
    'Big Ten Network': '#1e40af',
    'Pac-12 Network': '#059669',
  }
  return networkColors[network] || '#6b7280'
}

// AI Analysis badge styling
const getAIRecommendationStyle = (recommendation: string) => {
  switch(recommendation?.toLowerCase()) {
    case 'strong_buy':
      return { backgroundColor: '#059669', color: 'white', text: 'STRONG BUY' }
    case 'buy':
      return { backgroundColor: '#0ea5e9', color: 'white', text: 'BUY' }
    case 'hold':
      return { backgroundColor: '#f59e0b', color: 'white', text: 'HOLD' }
    case 'avoid':
      return { backgroundColor: '#ef4444', color: 'white', text: 'AVOID' }
    default:
      return { backgroundColor: '#6b7280', color: 'white', text: 'ANALYZING' }
  }
}

// Weather condition styling
const getWeatherStyle = (weather: any) => {
  if (!weather) return null
  
  const temp = weather.temperature || 0
  const condition = weather.condition || ''
  
  if (condition.includes('rain') || condition.includes('storm')) {
    return { backgroundColor: '#3b82f6', color: 'white', icon: '🌧️', text: 'RAIN' }
  } else if (condition.includes('snow')) {
    return { backgroundColor: '#64748b', color: 'white', icon: '❄️', text: 'SNOW' }  
  } else if (temp > 85) {
    return { backgroundColor: '#ef4444', color: 'white', icon: '🔥', text: 'HOT' }
  } else if (temp < 32) {
    return { backgroundColor: '#1e40af', color: 'white', icon: '🥶', text: 'COLD' }
  }
  return null
}

// Format game time from ISO string
const formatGameTime = (dateString: string): string => {
  const date = new Date(dateString)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const dayName = dayNames[date.getDay()]
  const monthName = monthNames[date.getMonth()]
  const day = date.getDate()
  const time = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    timeZoneName: 'short'
  })
  
  return `${dayName}, ${monthName} ${day} ${time}`
}

// Get team record from API data or generate placeholder
const getTeamRecord = (team: string): string => {
  // In real implementation, this would come from API
  // For now, return placeholder
  return '0-0'
}

interface GameWithLines {
  id: number
  homeTeam: string
  awayTeam: string
  week: number
  season: number
  startDate: string
  completed: boolean
  conference?: string
  venue?: string
  lines: Array<{
    id: string
    gameId: number
    spread: number
    total: number
    homeMoneyline: number
    awayMoneyline: number
    provider: string
    timestamp: string
  }>
  aiAnalysis?: {
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid'
    confidence: number
    reasoning: string[]
    sharpIndicators: any[]
    weatherImpact: any
    valueAnalysis: any[]
    bestBet: 'spread' | 'total' | 'moneyline' | 'none'
    expectedValue: number
    kellyPercentage: number
    riskLevel: 'low' | 'medium' | 'high'
  }
}

interface GameCardProps {
  game: GameWithLines
  isHighlight?: boolean
}

export const GameCard: React.FC<GameCardProps> = ({ game, isHighlight = false }) => {
  // Weather detection from AI analysis - RESTORE MISSING WEATHER FEATURES
  const hasWeatherImpact = game.aiAnalysis?.weatherImpact?.factors?.length > 0
  const weatherIntensity = hasWeatherImpact ? 'strong' : 'none'
  
  // Get weather type from reasoning text for animations
  const weatherReason = game.aiAnalysis?.reasoning?.[0] || ''
  const isRainy = weatherReason.includes('rain') || weatherReason.includes('precipitation')
  const isWindy = weatherReason.includes('wind')
  const isStormy = weatherReason.includes('storm') || weatherReason.includes('thunder')
  // Get latest betting lines
  const latestLine = game.lines?.[0] || {
    spread: 0,
    total: 0,
    homeMoneyline: 0,
    awayMoneyline: 0,
    provider: 'DraftKings'
  }
  
  const homeSpread = latestLine.spread
  const awaySpread = -latestLine.spread
  const total = latestLine.total
  
  // AI Analysis
  const aiAnalysis = game.aiAnalysis
  const aiStyle = getAIRecommendationStyle(aiAnalysis?.recommendation || '')
  
  // Weather
  const weatherStyle = getWeatherStyle(aiAnalysis?.weatherImpact)
  
  // Network - extract from venue or use default
  const network = 'ESPN' // In real implementation, would come from API
  
  // DRAMATIC weather backgrounds - clearly visible like TV weather maps
  const getWeatherBackground = () => {
    if (!hasWeatherImpact) return 'white'
    
    if (isRainy) {
      return 'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.06) 50%, transparent 70%), ' +
             'radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.08) 0%, transparent 50%), ' +
             'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(147, 197, 253, 0.02) 100%), white'
    } else if (isWindy) {
      return 'radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.06) 40%, transparent 70%), ' +
             'radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.08) 0%, transparent 50%), ' +
             'linear-gradient(45deg, rgba(245, 158, 11, 0.04) 0%, rgba(251, 191, 36, 0.02) 100%), white'
    } else if (isStormy) {
      return 'radial-gradient(circle at 40% 30%, rgba(139, 69, 19, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%), ' +
             'radial-gradient(circle at 60% 70%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), ' +
             'linear-gradient(225deg, rgba(139, 69, 19, 0.05) 0%, rgba(168, 85, 247, 0.03) 100%), white'
    }
    return 'white'
  }

  return (
    <div style={{
      background: getWeatherBackground(),
      border: hasWeatherImpact 
        ? isRainy ? '1px solid rgba(59, 130, 246, 0.3)' 
          : isWindy ? '1px solid rgba(245, 158, 11, 0.3)'
          : isStormy ? '1px solid rgba(139, 69, 19, 0.3)'
          : '1px solid #e5e7eb'
        : isHighlight ? '2px solid #f59e0b' : '1px solid #e5e7eb',
      borderRadius: '12px',
      marginBottom: '20px',
      boxShadow: hasWeatherImpact 
        ? '0 4px 20px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0,0,0,0.08)' 
        : isHighlight ? '0 8px 25px rgba(245, 158, 11, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      position: 'relative'
    }}>
      {/* Weather Impact Indicator - Animated Elements */}
      {hasWeatherImpact && (
        <>
          {/* Translucent content overlay - like TV weather forecast cards */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(0.5px)',
            borderRadius: '12px',
            zIndex: 1
          }} />
          
          {/* Animated Weather Icon */}
          {isRainy && (
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontSize: '24px',
              animation: 'weatherPulse 2s infinite',
              zIndex: 3
            }}>
              🌧️
            </div>
          )}
          {isWindy && (
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontSize: '24px',
              animation: 'windSway 3s infinite',
              zIndex: 3
            }}>
              💨
            </div>
          )}
          {isStormy && (
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontSize: '24px',
              animation: 'stormFlash 1.5s infinite',
              zIndex: 3
            }}>
              ⛈️
            </div>
          )}
          
          {/* Weather Impact Badge - Moved to not block team names */}
          {game.aiAnalysis?.weatherImpact?.totalAdjustment !== 0 && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '15px',
              backgroundColor: isRainy ? '#3b82f6' : isWindy ? '#f59e0b' : '#8b5cf6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              zIndex: 3,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {Math.abs(game.aiAnalysis?.weatherImpact?.totalAdjustment || 0)}pt impact
            </div>
          )}
        </>
      )}
      
      {/* Content wrapper with higher z-index */}
      <div style={{ position: 'relative', zIndex: 2 }}>
      {/* Header */}
      <div style={{
        backgroundColor: isHighlight ? '#1e293b' : '#334155',
        color: 'white',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{(game.awayTeam || 'TBD').slice(0, 4).toUpperCase()} @ {(game.homeTeam || 'TBD').slice(0, 4).toUpperCase()}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            backgroundColor: getNetworkColor(network),
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            {network}
          </span>
          {isHighlight && (
            <span style={{
              backgroundColor: '#f59e0b',
              color: '#000',
              padding: '2px 8px',
              borderRadius: '12px', 
              fontSize: '11px',
              fontWeight: '700'
            }}>
              FEATURED
            </span>
          )}
          {aiAnalysis && (
            <span style={{
              backgroundColor: aiStyle.backgroundColor,
              color: aiStyle.color,
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              {aiStyle.text} {aiAnalysis.confidence}%
            </span>
          )}
          {weatherStyle && (
            <span style={{
              backgroundColor: weatherStyle.backgroundColor,
              color: weatherStyle.color,
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              {weatherStyle.icon} {weatherStyle.text}
            </span>
          )}
        </div>
      </div>
      
      {/* Game Info Bar */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '12px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <span><strong>{formatGameTime(game.startDate)}</strong></span>
        <span>{game.venue || 'TBD'}</span>
      </div>
      
      {/* Main Content */}
      <div style={{ padding: '28px 20px 20px' }}>
        {/* Teams and Spreads */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          
          {/* Away Team */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flex: '1.2'
          }}>
            <img 
              src={getTeamLogo(game.awayTeam || 'Unknown')}
              alt={`${game.awayTeam || 'Unknown'} logo`}
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png'
              }}
            />
            <div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '2px'
              }}>
                {game.awayTeam || 'TBD'}
              </div>
              <div style={{ 
                fontSize: '12px',
                color: '#64748b'
              }}>
                {getTeamRecord(game.awayTeam || 'Unknown')}
              </div>
            </div>
          </div>
          
          {/* Away Spread */}
          <div style={{ 
            textAlign: 'center',
            flex: '0.8'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '800',
              color: awaySpread > 0 ? '#059669' : '#dc2626',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {awaySpread > 0 ? `+${awaySpread}` : awaySpread}
            </div>
            <div style={{ 
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginTop: '4px'
            }}>
              SPREAD
            </div>
          </div>
          
          {/* Game Center Info */}
          <div style={{ 
            textAlign: 'center',
            flex: '1',
            padding: '0 20px'
          }}>
            <div style={{ 
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                TOTAL O/U
              </div>
              <div style={{ 
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                {total || 'TBD'}
              </div>
            </div>
          </div>
          
          {/* Home Spread */}
          <div style={{ 
            textAlign: 'center',
            flex: '0.8'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '800',
              color: homeSpread > 0 ? '#059669' : '#dc2626',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {homeSpread > 0 ? `+${homeSpread}` : homeSpread}
            </div>
            <div style={{ 
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginTop: '4px'
            }}>
              SPREAD
            </div>
          </div>
          
          {/* Home Team */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            gap: '16px',
            flex: '1.2'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '2px'
              }}>
                {game.homeTeam || 'TBD'}
              </div>
              <div style={{ 
                fontSize: '12px',
                color: '#64748b'
              }}>
                {getTeamRecord(game.homeTeam || 'Unknown')}
              </div>
            </div>
            <img 
              src={getTeamLogo(game.homeTeam || 'Unknown')}
              alt={`${game.homeTeam || 'Unknown'} logo`}
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png'
              }}
            />
          </div>
        </div>
        
        {/* AI Insight Bar - Between logos and buttons */}
        {game.aiAnalysis && (
          <div style={{
            backgroundColor: game.aiAnalysis.recommendation === 'strong_buy' ? '#f0f9ff' : 
                           game.aiAnalysis.recommendation === 'buy' ? '#f0fdf4' :
                           game.aiAnalysis.recommendation === 'hold' ? '#fffbeb' : '#fef2f2',
            border: `1px solid ${game.aiAnalysis.recommendation === 'strong_buy' ? '#0ea5e9' : 
                                game.aiAnalysis.recommendation === 'buy' ? '#22c55e' :
                                game.aiAnalysis.recommendation === 'hold' ? '#f59e0b' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '12px',
            marginTop: '16px',
            marginBottom: '16px',
            marginLeft: '8px',
            marginRight: '8px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: game.aiAnalysis.recommendation === 'strong_buy' ? '#0ea5e9' : 
                       game.aiAnalysis.recommendation === 'buy' ? '#22c55e' :
                       game.aiAnalysis.recommendation === 'hold' ? '#f59e0b' : '#ef4444'
              }}>
                AI RECOMMENDATION: {game.aiAnalysis.recommendation.toUpperCase().replace('_', ' ')}
              </span>
              <span style={{
                fontSize: '11px',
                color: '#64748b'
              }}>
                {Math.round(game.aiAnalysis.confidence)}% confidence
              </span>
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {game.aiAnalysis.reasoning?.[0]?.includes('weather') && (
                <span style={{
                  animation: 'weatherPulse 2s infinite',
                  fontSize: '16px'
                }}>
                  🌧️
                </span>
              )}
              <span>
                Rain expected ({Math.abs(game.aiAnalysis.weatherImpact?.totalAdjustment || 0)}% chance) - favors under
              </span>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <button 
            onClick={() => {
              const encodedAway = encodeURIComponent(game.awayTeam.replace(/\s+/g, '+'))
              const encodedHome = encodeURIComponent(game.homeTeam.replace(/\s+/g, '+'))
              window.location.href = `/matchup/${encodedAway}/${encodedHome}`
            }}
            style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(249, 115, 22, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            View Matchup
          </button>
          
          <div style={{ display: 'flex', gap: '28px' }}>
            <button style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Consensus
            </button>
            <button style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Expert Picks
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {Math.floor(Math.random() * 8) + 1}
              </span>
            </button>
            <button style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Line Moves ↗
            </button>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}

// Enhanced weather animation keyframes - Meteo style
const weatherStyles = `
  @keyframes weatherPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  
  @keyframes windSway {
    0%, 100% { transform: translateX(0px) rotate(0deg); }
    25% { transform: translateX(3px) rotate(2deg); }
    75% { transform: translateX(-3px) rotate(-2deg); }
  }
  
  @keyframes stormFlash {
    0%, 90%, 100% { opacity: 0.8; }
    5%, 15% { opacity: 1; filter: brightness(1.3); }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = weatherStyles
  document.head.appendChild(styleSheet)
}