'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { SlickCalendarPicker } from './SlickCalendarPicker'

interface GameData {
  id: number
  homeTeam: string
  homeTeamId: number
  awayTeam: string
  awayTeamId: number
  week: number
  season: number
  startDate: string
  completed: boolean
  conference: string
  venue: string
  city: string
  state: string
  spread?: number
  overUnder?: number
  homeMoneyline?: number
  awayMoneyline?: number
  homeScore?: number
  awayScore?: number
  homeRecord: {
    wins: number
    losses: number
    ties: number
  }
  awayRecord: {
    wins: number
    losses: number
    ties: number
  }
  homeLast5: string
  awayLast5: string
  homeLogoUrl: string
  awayLogoUrl: string
  weatherCondition?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy'
  temperature?: number
  humidity?: number
  windSpeed?: number
  feelsLike?: number
}

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  city: string
}

interface SportsbookDashboardProps {
  games: GameData[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  gamesData: Record<string, number>
}

export const SportsbookDashboard: React.FC<SportsbookDashboardProps> = ({
  games,
  selectedDate,
  onDateSelect,
  gamesData
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [updatingGameIds, setUpdatingGameIds] = useState<Set<number>>(new Set())
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  // Update clock every second for authentic sportsbook feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate real-time odds updates like professional sportsbooks
  useEffect(() => {
    const interval = setInterval(() => {
      if (games.length > 0) {
        const randomGame = games[Math.floor(Math.random() * games.length)]
        setUpdatingGameIds(prev => new Set(prev.add(randomGame.id)))
        
        setTimeout(() => {
          setUpdatingGameIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(randomGame.id)
            return newSet
          })
        }, 800)
      }
    }, 7000) // 7-second intervals like real sportsbooks
    
    return () => clearInterval(interval)
  }, [games])

  // Mock weather data - integrate with Mateo MCP in production
  useEffect(() => {
    const fetchWeather = async () => {
      // This would use the Mateo MCP server in production
      setWeatherData({
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        city: 'Atlanta'
      })
    }
    fetchWeather()
  }, [])

  const formatSpread = (spread: number) => {
    return spread > 0 ? `+${spread}` : spread.toString()
  }

  const formatMoneyline = (moneyline: number) => {
    return moneyline > 0 ? `+${moneyline}` : moneyline.toString()
  }

  return (
    <>
      {/* Strategic CSS: LED effects, premium bezels, authentic timing */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');
        
        .sportsbook-container {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: auto;
        }
        
        /* Premium Monitor Housing - Strategic Implementation */
        .premium-monitor {
          background: linear-gradient(145deg, 
            rgba(255, 255, 255, 0.1) 0%,
            rgba(0, 0, 0, 0.1) 100%
          ),
          #1a1a1a;
          border-radius: 12px;
          padding: 12px;
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.6),
            0 10px 25px rgba(0, 0, 0, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
          border: 2px solid #333;
          position: relative;
          overflow: hidden;
        }
        
        /* Authentic LED Glow Effects - Core Technique */
        .led-display {
          font-family: 'Orbitron', 'Space Mono', monospace;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
          -webkit-font-smoothing: none;
          -moz-osx-font-smoothing: grayscale;
          text-transform: uppercase;
        }
        
        .led-red {
          color: #FF4444;
          text-shadow: 
            0 0 5px #FF4444,
            0 0 10px #FF4444,
            0 0 15px #FF4444,
            0 0 20px #FF2222;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 68, 68, 0.3);
        }
        
        .led-green {
          color: #44FF44;
          text-shadow: 
            0 0 5px #44FF44,
            0 0 10px #44FF44,
            0 0 15px #44FF44,
            0 0 20px #22FF22;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(68, 255, 68, 0.3);
        }
        
        .led-amber {
          color: #FFB000;
          text-shadow: 
            0 0 5px #FFB000,
            0 0 10px #FFB000,
            0 0 15px #FFB000,
            0 0 20px #FF9000;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 176, 0, 0.3);
        }
        
        .led-white {
          color: #F8F8FF;
          text-shadow: 
            0 0 5px #F8F8FF,
            0 0 10px #F8F8FF,
            0 0 15px #F8F8FF,
            0 0 20px #E8E8FF;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(248, 248, 255, 0.3);
        }
        
        /* Professional Odds Update Animation - Strategic Timing */
        @keyframes odds-update {
          0% { 
            opacity: 1; 
            transform: scale(1); 
          }
          25% { 
            opacity: 0.8; 
            transform: scale(1.05); 
            background: rgba(255, 193, 49, 0.3);
            box-shadow: 0 0 25px rgba(255, 193, 49, 0.6);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.08);
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .odds-updating {
          animation: odds-update 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        
        /* Subtle Scanlines for Authenticity */
        .screen-content::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            transparent 50%,
            rgba(0, 255, 0, 0.01) 50%,
            rgba(0, 255, 0, 0.02) 51%,
            transparent 52%
          );
          background-size: 100% 3px;
          pointer-events: none;
        }
        
        /* Weather Radar Professional Colors */
        .precip-light { color: #00E5FF; }
        .precip-moderate { color: #4CAF50; }
        .precip-heavy { color: #FFEB3B; }
        .precip-severe { color: #FF9800; }
        .precip-extreme { color: #F44336; }
        
        /* Premium Glassmorphism */
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }
        
        /* Ambient Lighting Effect */
        .ambient-glow::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: 
            radial-gradient(circle at center,
              rgba(59, 130, 246, 0.15) 0%,
              rgba(59, 130, 246, 0.05) 40%,
              transparent 70%
            );
          filter: blur(15px);
          z-index: -1;
          animation: ambientPulse 4s ease-in-out infinite;
        }
        
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>

      <div className="sportsbook-container">
        {/* Header with Live Clock - Casino Standard */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          padding: '20px 24px',
          borderBottom: '3px solid rgba(255, 193, 49, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              margin: 0,
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🏈 CFB SPORTSBOOK
            </h1>
            
            {/* Live Clock */}
            <div className="led-display led-amber" style={{
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '1.5rem'
            }}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                timeZoneName: 'short'
              })}
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout - Vegas Standard */}
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '300px 1fr 300px',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* Left Panel: Weather Radar */}
          <div className="premium-monitor ambient-glow">
            <div className="screen-content glass-panel" style={{
              padding: '20px',
              height: '600px',
              position: 'relative'
            }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }}>
                WEATHER RADAR
              </h3>
              
              {weatherData && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  {/* Temperature Display */}
                  <div className="led-display led-white" style={{
                    fontSize: '3rem',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    {weatherData.temperature}°F
                  </div>
                  
                  {/* Weather Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    width: '100%'
                  }}>
                    <div className="led-display led-green" style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      textAlign: 'center'
                    }}>
                      HUMID: {weatherData.humidity}%
                    </div>
                    <div className="led-display led-green" style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      textAlign: 'center'
                    }}>
                      WIND: {weatherData.windSpeed}MPH
                    </div>
                  </div>
                  
                  {/* Mock Radar Map */}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: 'radial-gradient(circle at 40% 60%, rgba(76, 175, 80, 0.3) 20%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 235, 59, 0.2) 15%, transparent 40%)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {weatherData.city} REGION
                    </div>
                  </div>
                </div>
              )}
              
              {/* Calendar Integration */}
              <div style={{ marginTop: '20px' }}>
                <SlickCalendarPicker
                  selectedDate={selectedDate}
                  onDateSelect={onDateSelect}
                  gamesData={gamesData}
                  minDate={new Date(2025, 7, 23)}
                  maxDate={new Date(2026, 0, 31)}
                />
              </div>
            </div>
          </div>

          {/* Center Panel: Main Odds Board */}
          <div className="premium-monitor ambient-glow">
            <div className="screen-content glass-panel" style={{
              padding: '20px',
              height: '800px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <h2 style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: '0 0 24px 0',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                LIVE ODDS BOARD
              </h2>
              
              {/* Games List */}
              <div style={{
                height: 'calc(100% - 80px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {games.slice(0, 8).map((game) => (
                  <div
                    key={game.id}
                    className={updatingGameIds.has(game.id) ? 'odds-updating' : ''}
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    {/* Away Team */}
                    <div style={{ textAlign: 'left' }}>
                      <div className="led-display led-white" style={{
                        fontSize: '1rem',
                        marginBottom: '4px'
                      }}>
                        {game.awayTeam}
                      </div>
                      <div style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.75rem'
                      }}>
                        {game.awayRecord.wins}-{game.awayRecord.losses}
                      </div>
                    </div>

                    {/* Center: Odds */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {game.spread && (
                        <div className="led-display led-amber" style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}>
                          {formatSpread(game.spread)}
                        </div>
                      )}
                      {game.overUnder && (
                        <div className="led-display led-green" style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.875rem'
                        }}>
                          O/U {game.overUnder}
                        </div>
                      )}
                    </div>

                    {/* Home Team */}
                    <div style={{ textAlign: 'right' }}>
                      <div className="led-display led-white" style={{
                        fontSize: '1rem',
                        marginBottom: '4px'
                      }}>
                        {game.homeTeam}
                      </div>
                      <div style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.75rem'
                      }}>
                        {game.homeRecord.wins}-{game.homeRecord.losses}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Updates */}
          <div className="premium-monitor ambient-glow">
            <div className="screen-content glass-panel" style={{
              padding: '20px',
              height: '600px',
              position: 'relative'
            }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }}>
                LIVE UPDATES
              </h3>
              
              {/* Market Status */}
              <div className="led-display led-green" style={{
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                MARKETS OPEN
              </div>
              
              {/* Recent Updates */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {games.slice(0, 5).map((game, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #44FF44'
                  }}>
                    <div style={{
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      {game.awayTeam} @ {game.homeTeam}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.75rem'
                    }}>
                      {new Date(game.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}