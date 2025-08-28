'use client'

import React, { useState, useEffect } from 'react'
import { SlickCalendarPicker } from '@/components/SlickCalendarPicker'
import { EnhancedLavaGameCard } from '@/components/EnhancedLavaGameCard'

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

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [games, setGames] = useState<GameData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gamesData, setGamesData] = useState<Record<string, number>>({})

  // Fetch games data
  const fetchGames = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/games/2025?division=fbs')
      const data = await response.json()

      if (data.success) {
        setGames(data.data)
        
        // Generate games count by date for calendar
        const gamesByDate: Record<string, number> = {}
        data.data.forEach((game: GameData) => {
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

  useEffect(() => {
    fetchGames()
  }, [])

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
      
      {/* Header */}
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
            🏈 CFB Calendar
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: '500'
          }}>
            2025-26 College Football Season
          </p>
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
        
        {/* Left: Calendar */}
        <SlickCalendarPicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          gamesData={gamesData}
          minDate={new Date(2025, 7, 23)}
          maxDate={new Date(2026, 0, 31)}
        />
        
        {/* Right: Games */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Games Header */}
          <div style={{
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
              {loading ? 'Loading games...' : `${todaysGames.length} games scheduled`}
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px',
              rowGap: '40px',
              width: '100%',
              maxWidth: '1200px'
            }}>
              {todaysGames.length === 0 ? (
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  gridColumn: '1 / -1'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏈</div>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#64748b'
                  }}>
                    No Games Today
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '16px',
                    color: '#94a3b8'
                  }}>
                    Select a different date to see games
                  </p>
                </div>
              ) : (
                todaysGames.map((game) => (
                  <div key={game.id} style={{
                    width: '100%',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'stretch'
                  }}>
                    <EnhancedLavaGameCard
                      game={game}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}