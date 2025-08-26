'use client'

import React, { useState } from 'react'
import { resolveBackgroundForVenue, resolveIconForWeather, type WeatherCondition } from '@/lib/backgroundResolver'
import LavaTeamEmblem from './LavaTeamEmblem'

// Copy the weather icon component from original
const LavaWeatherIcon: React.FC<{ 
  type: 'sunny-cloudy' | 'sunny' | 'cloudy' | 'rainy'
}> = ({ type }) => {
  // Simplified version - copy full implementation from LavaGameCard
  return <div style={{ width: '80px', height: '60px' }} />
}

type LastFive = Array<'W' | 'L'>

interface TeamSnapshot {
  name: string
  abbr: string
  record: string
  ats: string
  last5: LastFive
  spread: number
  score?: number
}

interface WeatherData {
  temperature?: number
  condition?: string
  humidity?: number
  windSpeed?: number
  feelsLike?: number
}

type QuarterScores = {
  away: [number, number, number, number]
  home: [number, number, number, number]
}

interface LavaGameCardFlippableProps {
  venue?: string
  weather?: WeatherCondition
  weatherData?: WeatherData
  showTeams?: boolean
  watermark?: boolean
  home?: TeamSnapshot
  away?: TeamSnapshot
  totalOU?: number
  backgroundOverride?: string
  disableBackground?: boolean
  disableShineOverlay?: boolean
  iconOverride?: string
  aiNoteOverride?: string
  homeLogoUrl?: string
  awayLogoUrl?: string
  completed?: boolean
  preGameSpread?: number
  preGameOverUnder?: number
  quarterScores?: QuarterScores
}

// Generate mock player stats for completed games
function generatePlayerStats(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) {
  const winningTeam = homeScore > awayScore ? homeTeam : awayTeam
  const winningScore = Math.max(homeScore, awayScore)
  
  return {
    mvp: {
      name: `${winningTeam === homeTeam ? 'J. Smith' : 'M. Johnson'}`,
      team: winningTeam,
      stats: `${Math.floor(winningScore * 0.4)} rush yds, 2 TDs`
    },
    passingLeader: {
      name: `${winningTeam === homeTeam ? 'T. Wilson' : 'K. Davis'}`,
      team: winningTeam,
      stats: `${180 + Math.floor(Math.random() * 120)} pass yds, ${Math.floor(Math.random() * 3) + 1} TDs`
    },
    rushingLeader: {
      name: `${winningTeam === homeTeam ? 'R. Brown' : 'A. Garcia'}`,
      team: winningTeam,
      stats: `${80 + Math.floor(Math.random() * 80)} rush yds, ${Math.floor(Math.random() * 2) + 1} TDs`
    }
  }
}

// Generate game summary based on score and teams
function generateGameSummary(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) {
  const margin = Math.abs(homeScore - awayScore)
  const winnerName = homeScore > awayScore ? homeTeam : awayTeam
  const loserName = homeScore > awayScore ? awayTeam : homeTeam
  const totalScore = homeScore + awayScore
  
  if (margin <= 3) {
    return `Thrilling finish as ${winnerName} edges out ${loserName} in a nail-biter. Game came down to final drive with multiple lead changes in the 4th quarter.`
  } else if (margin <= 7) {
    return `${winnerName} pulls away late to defeat ${loserName}. Strong defensive play in the second half sealed the victory for ${winnerName}.`
  } else if (margin <= 14) {
    return `${winnerName} controls the game against ${loserName}. Balanced offensive attack and timely turnovers led to a convincing win.`
  } else {
    return `Dominant performance by ${winnerName} over ${loserName}. ${winnerName} jumped out to an early lead and never looked back in this one-sided affair.`
  }
}

// Generate line movement data
function generateLineMovement(currentSpread: number) {
  const movements = []
  let spread = currentSpread + (Math.random() * 2 - 1) // Start slightly different
  
  const timeStamps = ['Mon 2PM', 'Tue 8AM', 'Wed 11AM', 'Thu 3PM', 'Fri 9AM', 'Game Time']
  
  timeStamps.forEach((time, i) => {
    if (i < timeStamps.length - 1) {
      const change = (Math.random() * 1 - 0.5) // -0.5 to +0.5 change
      spread += change
      movements.push({
        time,
        spread: Math.round(spread * 2) / 2, // Round to nearest 0.5
        change: i === 0 ? 0 : change
      })
    } else {
      movements.push({
        time,
        spread: currentSpread,
        change: currentSpread - spread
      })
    }
  })
  
  return movements
}

// Generate realistic quarter scores if not provided
function generateQuarterScores(homeScore: number, awayScore: number): QuarterScores {
  const distributeScore = (total: number): [number, number, number, number] => {
    const quarters: [number, number, number, number] = [0, 0, 0, 0]
    let remaining = total
    
    const patterns = [
      [0.25, 0.35, 0.25, 0.15],
      [0.30, 0.20, 0.20, 0.30],
      [0.20, 0.30, 0.30, 0.20],
    ]
    const pattern = patterns[Math.floor(Math.random() * patterns.length)]
    
    for (let i = 0; i < 4; i++) {
      if (i === 3) {
        quarters[i] = remaining
      } else {
        const score = Math.round(total * pattern[i])
        quarters[i] = Math.min(score, remaining)
        remaining -= quarters[i]
      }
    }
    
    return quarters
  }
  
  return {
    home: distributeScore(homeScore),
    away: distributeScore(awayScore)
  }
}

export const LavaGameCardFlippable: React.FC<LavaGameCardFlippableProps> = ({
  venue = 'Texas Stadium',
  weather = 'partial-rain',
  weatherData,
  showTeams = true,
  watermark = true,
  home = { name: 'Texas', abbr: 'TEX', record: '0-0', ats: '0-0', last5: [], spread: 0 },
  away = { name: 'Oklahoma', abbr: 'OU', record: '0-0', ats: '0-0', last5: [], spread: 0 },
  totalOU = 52.5,
  backgroundOverride,
  disableBackground = false,
  disableShineOverlay = false,
  iconOverride,
  aiNoteOverride,
  homeLogoUrl,
  awayLogoUrl,
  completed = false,
  preGameSpread,
  preGameOverUnder,
  quarterScores
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const backgroundImageUrl = backgroundOverride || resolveBackgroundForVenue(venue, weather)
  const backgroundCssUrl = backgroundImageUrl ? `url("${encodeURI(backgroundImageUrl)}")` : ''
  
  // Calculate betting outcomes for completed games
  const actualSpread = preGameSpread || home.spread || 0
  const actualOU = preGameOverUnder || totalOU || 0
  const totalScore = (home.score || 0) + (away.score || 0)
  const margin = (home.score || 0) - (away.score || 0)
  const homeCovered = margin > -actualSpread
  const awayTeamWon = (away.score || 0) > (home.score || 0)
  const coveringTeam = actualSpread < 0 
    ? (homeCovered ? home.name : away.name)
    : (margin > actualSpread ? away.name : home.name)
  const coverBy = Math.abs(margin + actualSpread)
  
  // Generate or use provided quarter scores
  const scores = quarterScores || generateQuarterScores(
    home.score || 0,
    away.score || 0
  )
  
  // Generate player stats and game summary for completed games
  const playerStats = completed ? generatePlayerStats(home.name, away.name, home.score || 0, away.score || 0) : null
  const gameSummary = completed ? generateGameSummary(home.name, away.name, home.score || 0, away.score || 0) : null
  const lineMovement = completed ? generateLineMovement(actualSpread) : null

  return (
    <>
      <style jsx global>{`
        @keyframes flipHint {
          0% { transform: rotateY(0deg); }
          10% { transform: rotateY(20deg); }
          20% { transform: rotateY(0deg); }
          100% { transform: rotateY(0deg); }
        }
        
        .flip-container {
          width: 700px;
          height: auto;
          perspective: 2000px;
          margin: 20px;
        }
        
        .flip-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
          cursor: ${completed ? 'pointer' : 'default'};
        }
        
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card.hint {
          animation: flipHint 2s ease-in-out;
        }
        
        .card-face {
          width: 100%;
          position: absolute;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        
        .card-front {
          z-index: 2;
          transform: rotateY(0deg);
        }
        
        .card-back {
          transform: rotateY(180deg);
          z-index: 1;
        }
        
        @keyframes lavaFloat {
          0%, 100% { transform: translateY(0px) translateZ(20px) rotate(0deg); }
          33% { transform: translateY(-4px) translateZ(25px) rotate(1deg); }
          66% { transform: translateY(-2px) translateZ(22px) rotate(-0.5deg); }
        }
        
        @keyframes shineEffect {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
      
      <div className="flip-container">
        <div 
          className={`flip-card ${isFlipped ? 'flipped' : ''} ${completed && !isFlipped && isHovering ? 'hint' : ''}`}
          onClick={() => completed && setIsFlipped(!isFlipped)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* FRONT OF CARD - Regular Game Display */}
          <div className="card-face card-front">
            <div style={{
              width: '700px',
              background: `
                linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%),
                linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 40%),
                linear-gradient(315deg, rgba(0,0,0,0.05) 0%, transparent 60%),
                linear-gradient(45deg, #fefefe 0%, #f0f9ff 100%)
              `,
              borderRadius: '12px',
              boxShadow: `
                0 12px 28px rgba(17,24,39,0.15),
                0 4px 10px rgba(17,24,39,0.08),
                0 1px 0 rgba(255,255,255,0.85) inset,
                0 -1px 0 rgba(0,0,0,0.06) inset
              `,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Background image layer */}
              {!disableBackground && backgroundCssUrl && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: backgroundCssUrl,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.15,
                  pointerEvents: 'none'
                }} />
              )}
              
              {/* Watermark layer */}
              {watermark && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 18,
                  backgroundImage: `url(${resolveIconForWeather(weather)})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center 88%',
                  backgroundSize: '110% auto',
                  opacity: 0.2,
                  pointerEvents: 'none'
                }} />
              )}
              
              {/* Main content */}
              <div style={{
                padding: '16px 32px 12px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                zIndex: 5,
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset'
              }}>
                {/* Venue and weather */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  {weatherData && (
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {Math.round(weatherData.temperature || 0)}°F • {weatherData.condition}
                    </div>
                  )}
                  <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                    {venue}
                  </div>
                </div>
                
                {/* Teams and scores/spreads */}
                {showTeams && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    {/* Away team */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <LavaTeamEmblem
                        src={awayLogoUrl || ''}
                        alt={`${away.name} logo`}
                        size={72}
                        variant="glass"
                      />
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                          {away.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {away.record} • ATS {away.ats}
                        </div>
                      </div>
                    </div>
                    
                    {/* Center - Score or Spread */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#dc2626'
                      }}>
                        {completed && away.score !== undefined ? away.score : (away.spread > 0 ? `+${away.spread}` : `${away.spread}`)}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#64748b',
                        fontWeight: '600'
                      }}>
                        {completed ? 'SCORE' : 'SPREAD'}
                      </div>
                    </div>
                    
                    {/* Total O/U */}
                    <div style={{
                      textAlign: 'center',
                      background: '#f1f5f9',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        fontSize: '10px',
                        color: '#64748b',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {completed ? 'TOTAL' : 'O/U'}
                      </div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1e293b'
                      }}>
                        {completed ? totalScore : totalOU}
                      </div>
                    </div>
                    
                    {/* Home Score/Spread */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#059669'
                      }}>
                        {completed && home.score !== undefined ? home.score : (home.spread > 0 ? `+${home.spread}` : `${home.spread}`)}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#64748b',
                        fontWeight: '600'
                      }}>
                        {completed ? 'SCORE' : 'SPREAD'}
                      </div>
                    </div>
                    
                    {/* Home team */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                          {home.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {home.record} • ATS {home.ats}
                        </div>
                      </div>
                      <LavaTeamEmblem
                        src={homeLogoUrl || ''}
                        alt={`${home.name} logo`}
                        size={72}
                        variant="glass"
                      />
                    </div>
                  </div>
                )}
                
                {/* Flip indicator for completed games */}
                {completed && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '8px',
                      cursor: 'pointer',
                      pointerEvents: 'none'
                    }}
                  >
                    ⟲ CLICK TO VIEW FINAL BOXSCORE & BETTING ANALYSIS
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* BACK OF CARD - Final Game Details */}
          <div className="card-face card-back">
            <div style={{
              width: '700px',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '12px',
              boxShadow: `
                0 12px 28px rgba(17,24,39,0.25),
                0 4px 10px rgba(17,24,39,0.15),
                0 1px 0 rgba(255,255,255,0.1) inset
              `,
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Header with FINAL status */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '6px 16px',
                      background: '#dc2626',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '700',
                      letterSpacing: '1px'
                    }}>
                      FINAL
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFlipped(false)
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    ← FLIP BACK
                  </button>
                </div>
                
                {/* Final Scores */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  padding: '20px 0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src={awayLogoUrl} alt={away.name} style={{ width: '60px', height: '60px', marginBottom: '8px' }} />
                    <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>{away.name}</div>
                    <div style={{ 
                      fontSize: '48px', 
                      fontWeight: '800',
                      color: awayTeamWon ? '#10b981' : '#e2e8f0'
                    }}>
                      {away.score}
                    </div>
                  </div>
                  
                  <div style={{ color: '#475569', fontSize: '24px', fontWeight: '300' }}>vs</div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <img src={homeLogoUrl} alt={home.name} style={{ width: '60px', height: '60px', marginBottom: '8px' }} />
                    <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>{home.name}</div>
                    <div style={{ 
                      fontSize: '48px', 
                      fontWeight: '800',
                      color: !awayTeamWon ? '#10b981' : '#e2e8f0'
                    }}>
                      {home.score}
                    </div>
                  </div>
                </div>
                
                {/* Quarter by Quarter */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8', fontSize: '12px' }}>TEAM</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>Q1</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>Q2</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>Q3</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>Q4</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#f1f5f9', fontSize: '12px', fontWeight: '700' }}>FINAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', color: '#e2e8f0', fontWeight: '600' }}>{away.abbr}</td>
                        {scores.away.map((score, i) => (
                          <td key={i} style={{ padding: '8px', textAlign: 'center', color: '#cbd5e1' }}>{score}</td>
                        ))}
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          color: awayTeamWon ? '#10b981' : '#f1f5f9',
                          fontWeight: '700',
                          fontSize: '14px'
                        }}>
                          {away.score}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', color: '#e2e8f0', fontWeight: '600' }}>{home.abbr}</td>
                        {scores.home.map((score, i) => (
                          <td key={i} style={{ padding: '8px', textAlign: 'center', color: '#cbd5e1' }}>{score}</td>
                        ))}
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          color: !awayTeamWon ? '#10b981' : '#f1f5f9',
                          fontWeight: '700',
                          fontSize: '14px'
                        }}>
                          {home.score}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Betting Analysis */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#fbbf24',
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    <strong>{coveringTeam}</strong> covered the spread of{' '}
                    <strong>{actualSpread > 0 ? `+${actualSpread}` : actualSpread}</strong> by {coverBy.toFixed(1)} points.
                    The total score of <strong>{totalScore}</strong> was{' '}
                    <strong>{totalScore > actualOU ? 'OVER' : 'UNDER'}</strong> {actualOU}.
                  </div>
                </div>
                
                {/* Betting Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>O/U MARGIN</div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '700',
                      color: totalScore > actualOU ? '#ef4444' : '#10b981'
                    }}>
                      {totalScore > actualOU ? 'o' : 'u'}{Math.abs(totalScore - actualOU).toFixed(1)}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>COVER BY</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>
                      +{coverBy.toFixed(1)}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>PRE-GAME</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>
                      {home.name} {actualSpread > 0 ? `+${actualSpread}` : actualSpread}
                    </div>
                  </div>
                </div>
                
                {/* Game Summary */}
                {gameSummary && (
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '14px 16px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#93c5fd',
                      fontWeight: '600',
                      marginBottom: '6px',
                      letterSpacing: '0.5px'
                    }}>
                      🏈 GAME SUMMARY
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#dbeafe',
                      lineHeight: '1.5',
                      fontStyle: 'italic'
                    }}>
                      {gameSummary}
                    </div>
                  </div>
                )}
                
                {/* Player Stats */}
                {playerStats && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#6ee7b7',
                      fontWeight: '600',
                      marginBottom: '10px',
                      letterSpacing: '0.5px'
                    }}>
                      ⭐ KEY PERFORMANCES
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 0',
                        borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#d1fae5',
                          fontWeight: '600'
                        }}>
                          MVP: {playerStats.mvp.name}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#a7f3d0'
                        }}>
                          {playerStats.mvp.stats}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 0'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#d1fae5'
                        }}>
                          Pass: {playerStats.passingLeader.name}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: '#a7f3d0'
                        }}>
                          {playerStats.passingLeader.stats}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 0'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#d1fae5'
                        }}>
                          Rush: {playerStats.rushingLeader.name}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: '#a7f3d0'
                        }}>
                          {playerStats.rushingLeader.stats}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Line Movement Tracking */}
                {lineMovement && (
                  <div style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#c4b5fd',
                      fontWeight: '600',
                      marginBottom: '8px',
                      letterSpacing: '0.5px'
                    }}>
                      📊 LINE MOVEMENT TRACKER
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '4px',
                      fontSize: '10px'
                    }}>
                      {lineMovement.map((move, i) => (
                        <div key={i} style={{
                          textAlign: 'center',
                          padding: '4px 2px'
                        }}>
                          <div style={{ color: '#a78bfa', marginBottom: '2px' }}>
                            {move.time}
                          </div>
                          <div style={{ 
                            color: '#e9d5ff',
                            fontWeight: '600',
                            fontSize: '11px'
                          }}>
                            {move.spread > 0 ? `+${move.spread}` : move.spread}
                          </div>
                          {i > 0 && (
                            <div style={{
                              color: move.change > 0 ? '#34d399' : move.change < 0 ? '#f87171' : '#9ca3af',
                              fontSize: '9px',
                              marginTop: '1px'
                            }}>
                              {move.change > 0 ? '↗' : move.change < 0 ? '↘' : '→'} 
                              {Math.abs(move.change).toFixed(1)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LavaGameCardFlippable