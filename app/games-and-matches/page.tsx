'use client'

import React, { useState, useEffect } from 'react'
import { SlickCalendarPicker } from '@/components/SlickCalendarPicker'
import { EnhancedLavaGameCard } from '@/components/EnhancedLavaGameCard'
import FinalGameCard from '@/components/FinalGameCard'

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

interface GamesResponse {
  success: boolean
  data: GameData[]
  metadata: {
    totalGames: number
    week?: number
    date?: string
    season: number
    division: string
    lastUpdated: string
  }
  message?: string
  error?: string
}

export default function GamesAndMatchesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [games, setGames] = useState<GameData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gamesData, setGamesData] = useState<Record<string, number>>({})
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [division, setDivision] = useState<'fbs' | 'fcs' | 'all'>('fbs')

  // 2025-26 Season weeks (Week 0 starts August 23, 2025)
  const SEASON_WEEKS = [
    { week: 0, label: 'Week 0', startDate: '2025-08-23', endDate: '2025-08-30' },
    { week: 1, label: 'Week 1', startDate: '2025-08-30', endDate: '2025-09-06' },
    { week: 2, label: 'Week 2', startDate: '2025-09-06', endDate: '2025-09-13' },
    { week: 3, label: 'Week 3', startDate: '2025-09-13', endDate: '2025-09-20' },
    { week: 4, label: 'Week 4', startDate: '2025-09-20', endDate: '2025-09-27' },
    { week: 5, label: 'Week 5', startDate: '2025-09-27', endDate: '2025-10-04' },
    { week: 6, label: 'Week 6', startDate: '2025-10-04', endDate: '2025-10-11' },
    { week: 7, label: 'Week 7', startDate: '2025-10-11', endDate: '2025-10-18' },
    { week: 8, label: 'Week 8', startDate: '2025-10-18', endDate: '2025-10-25' },
    { week: 9, label: 'Week 9', startDate: '2025-10-25', endDate: '2025-11-01' },
    { week: 10, label: 'Week 10', startDate: '2025-11-01', endDate: '2025-11-08' },
    { week: 11, label: 'Week 11', startDate: '2025-11-08', endDate: '2025-11-15' },
    { week: 12, label: 'Week 12', startDate: '2025-11-15', endDate: '2025-11-22' },
    { week: 13, label: 'Week 13', startDate: '2025-11-22', endDate: '2025-11-29' },
    { week: 14, label: 'Week 14', startDate: '2025-11-29', endDate: '2025-12-06' },
    { week: 15, label: 'Championship Week', startDate: '2025-12-06', endDate: '2025-12-13' },
  ]

  // Fetch games data
  const fetchGames = async (week?: number, date?: string) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        division: division
      })
      
      if (week !== undefined) {
        params.append('week', week.toString())
      }
      
      if (date) {
        params.append('date', date)
      }

      const response = await fetch(`/api/games/2025?${params}`)
      const data: GamesResponse = await response.json()

      if (data.success) {
        setGames(data.data)
        
        // Generate games count by date for calendar
        const gamesByDate: Record<string, number> = {}
        data.data.forEach(game => {
          const gameDate = new Date(game.startDate).toISOString().split('T')[0]
          gamesByDate[gameDate] = (gamesByDate[gameDate] || 0) + 1
        })
        setGamesData(gamesByDate)
        
        console.log(`✅ Loaded ${data.data.length} games for 2025-26 season`)
      } else {
        setError(data.error || 'Failed to fetch games')
        console.error('❌ Games API error:', data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('❌ Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load games on component mount and when filters change
  useEffect(() => {
    fetchGames(selectedWeek || undefined)
  }, [selectedWeek, division])

  // Keyboard navigation for channel changing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const currentIndex = SEASON_WEEKS.findIndex(w => w.week === selectedWeek)
        
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          handleWeekSelect(SEASON_WEEKS[currentIndex - 1].week)
        } else if (e.key === 'ArrowDown' && currentIndex < SEASON_WEEKS.length - 1 && currentIndex >= 0) {
          handleWeekSelect(SEASON_WEEKS[currentIndex + 1].week)
        } else if (e.key === 'ArrowUp' && selectedWeek === null) {
          handleWeekSelect(SEASON_WEEKS[0].week)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedWeek])

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    
    // Find which week this date falls into
    const dateStr = date.toISOString().split('T')[0]
    const week = SEASON_WEEKS.find(w => 
      dateStr >= w.startDate && dateStr <= w.endDate
    )
    
    if (week && week.week !== selectedWeek) {
      setSelectedWeek(week.week)
    }
    
    // Filter games for the selected date
    const selectedDateStr = date.toISOString().split('T')[0]
    const dateGames = games.filter(game => {
      const gameDate = new Date(game.startDate).toISOString().split('T')[0]
      return gameDate === selectedDateStr
    })
    
    console.log(`📅 Selected ${dateStr}, found ${dateGames.length} games`)
  }

  // Handle week selection
  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week)
    const weekInfo = SEASON_WEEKS.find(w => w.week === week)
    if (weekInfo) {
      setSelectedDate(new Date(weekInfo.startDate))
    }
  }

  // Filter games for selected date
  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const todaysGames = games.filter(game => {
    const gameDate = new Date(game.startDate).toISOString().split('T')[0]
    return gameDate === selectedDateStr
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '32px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 12px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏈 Games & Matches Calendar
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#94a3b8',
            margin: '0 0 24px 0',
            fontWeight: '500'
          }}>
            2025-26 College Football Season • Division 1A & 1AA
          </p>
          
          {/* Division Filter */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'fbs' as const, label: 'Division 1A (FBS)', count: 'FBS' },
              { key: 'fcs' as const, label: 'Division 1AA (FCS)', count: 'FCS' },
              { key: 'all' as const, label: 'All Divisions', count: 'ALL' }
            ].map((div) => (
              <button
                key={div.key}
                onClick={() => setDivision(div.key)}
                style={{
                  background: division === div.key
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'rgba(255,255,255,0.1)',
                  border: division === div.key ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (division !== div.key) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (division !== div.key) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {div.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '480px 1fr',
        gap: '80px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Calendar + Week Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Calendar Picker */}
          <SlickCalendarPicker
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            gamesData={gamesData}
            minDate={new Date(2025, 7, 23)} // August 23, 2025
            maxDate={new Date(2026, 0, 31)}  // January 31, 2026
          />
          
          {/* TV-Style Channel Changer */}
          <div style={{
            background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: `
              0 0 40px rgba(59, 130, 246, 0.15),
              0 0 20px rgba(139, 69, 19, 0.1),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.2),
              0 20px 40px rgba(0,0,0,0.3)
            `,
            border: '2px solid rgba(59, 130, 246, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '700px',
            width: '100%'
          }}>
            {/* LED Backlight Effect */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(245, 101, 101, 0.06) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
              borderRadius: '22px'
            }} />
            
            {/* TV Screen Bezel */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {/* TV Header with Channel Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontFamily: 'Monaco, "Lucida Console", monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    CFB-TV
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  fontWeight: '600'
                }}>
                  CH: {selectedWeek !== null ? `${selectedWeek.toString().padStart(2, '0')}` : '--'}
                </div>
              </div>
              
              {/* Current Week Display */}
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '24px',
                  color: '#ffffff',
                  fontWeight: '700',
                  marginBottom: '4px',
                  textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {selectedWeek !== null 
                    ? SEASON_WEEKS.find(w => w.week === selectedWeek)?.label || 'Unknown'
                    : 'Select Week'
                  }
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontFamily: 'Monaco, "Lucida Console", monospace'
                }}>
                  {selectedWeek !== null 
                    ? `${new Date(SEASON_WEEKS.find(w => w.week === selectedWeek)?.startDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(SEASON_WEEKS.find(w => w.week === selectedWeek)?.endDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : '2025-26 Season'
                  }
                </div>
              </div>
              
              {/* Channel Changer Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {SEASON_WEEKS.map((week) => (
                  <button
                    key={week.week}
                    onClick={() => handleWeekSelect(week.week)}
                    style={{
                      background: selectedWeek === week.week
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
                      border: '1px solid',
                      borderColor: selectedWeek === week.week ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: selectedWeek === week.week ? 'white' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      position: 'relative',
                      overflow: 'hidden',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: selectedWeek === week.week 
                        ? '0 0 15px rgba(59, 130, 246, 0.4)' 
                        : '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedWeek !== week.week) {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.borderColor = '#3b82f6'
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.3)'
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(30, 41, 59, 0.9) 100%)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedWeek !== week.week) {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
                      }
                    }}
                  >
                    <div style={{ fontWeight: '700' }}>{week.week}</div>
                    <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>
                      {new Date(week.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {selectedWeek === week.week && (
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
                      }} />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Channel Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <button
                  onClick={() => {
                    const currentIndex = SEASON_WEEKS.findIndex(w => w.week === selectedWeek)
                    if (currentIndex > 0) {
                      handleWeekSelect(SEASON_WEEKS[currentIndex - 1].week)
                    }
                  }}
                  disabled={selectedWeek === null || selectedWeek === 0}
                  style={{
                    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: selectedWeek === null || selectedWeek === 0 ? 0.5 : 1,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  ◄ PREV
                </button>
                
                <div style={{
                  fontSize: '10px',
                  color: '#64748b',
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  textAlign: 'center',
                  opacity: 0.7
                }}>
                  Use ↑↓ or click to change
                </div>
                
                <button
                  onClick={() => {
                    const currentIndex = SEASON_WEEKS.findIndex(w => w.week === selectedWeek)
                    if (currentIndex < SEASON_WEEKS.length - 1 && currentIndex >= 0) {
                      handleWeekSelect(SEASON_WEEKS[currentIndex + 1].week)
                    }
                  }}
                  disabled={selectedWeek === null || selectedWeek === SEASON_WEEKS[SEASON_WEEKS.length - 1].week}
                  style={{
                    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: selectedWeek === null || selectedWeek === SEASON_WEEKS[SEASON_WEEKS.length - 1].week ? 0.5 : 1,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  NEXT ►
                </button>
              </div>
            </div>
            
            {/* CSS Animations */}
            <style jsx>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}</style>
          </div>
        </div>

        {/* Right Column: Games Display */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          {/* Games Header */}
          <div className="games-header-width" style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {loading 
                ? 'Loading games...' 
                : `${todaysGames.length} games scheduled`
              }
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e2e8f0',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              border: '1px solid #fecaca',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#dc2626'
              }}>
                ⚠️ Error Loading Games
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#7f1d1d'
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Games List */}
          {!loading && !error && (
            <>
              <style>{`
                .games-grid {
                  display: grid;
                  grid-template-columns: 1fr;
                  gap: 20px;
                }
                @media (min-width: 768px) {
                  .games-grid {
                    grid-template-columns: repeat(2, 1fr);
                  }
                }
                .games-header-width {
                  width: 100%;
                }
                @media (min-width: 768px) {
                  .games-header-width {
                    width: calc(100% - 0px);
                    max-width: 100%;
                  }
                }
              `}</style>
              <div className="games-grid">
                {todaysGames.length === 0 ? (
                  <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '2px solid #dc2626',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', color: '#dc2626' }}>❌</div>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#dc2626'
                    }}>
                      ERROR: NO DATA AVAILABLE
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: '16px',
                      color: '#7f1d1d',
                      fontWeight: '600'
                    }}>
                      API returned 0 games - check CFBD API connection or wait for 2025 season data
                    </p>
                  </div>
                ) : (
                  todaysGames.map((game) => (
                    <EnhancedLavaGameCard
                      key={game.id}
                      game={game}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}