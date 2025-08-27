'use client'

import React, { useState, useEffect } from 'react'

/**
 * 🏈 Live Games Board View
 * 
 * Professional sportsbook-style live games display:
 * - LED scoreboard aesthetics with authentic glow effects
 * - Real-time score updates with smooth animations
 * - Professional Las Vegas sportsbook layout
 * - Mobile-responsive with touch-friendly targets
 */

interface GameData {
  id: string
  awayTeam: {
    name: string
    abbreviation: string
    score?: number
    record?: string
    logo?: string
  }
  homeTeam: {
    name: string
    abbreviation: string
    score?: number
    record?: string
    logo?: string
  }
  status: 'pre' | 'live' | 'final'
  clock?: string
  quarter?: string
  spread?: number
  overUnder?: number
  venue?: string
  network?: string
  startTime?: string
}

// Mock data - In production, this would come from your API
const mockLiveGames: GameData[] = [
  {
    id: '1',
    awayTeam: {
      name: 'Alabama',
      abbreviation: 'ALA',
      score: 21,
      record: '8-1'
    },
    homeTeam: {
      name: 'Georgia',
      abbreviation: 'UGA',
      score: 17,
      record: '8-1'
    },
    status: 'live',
    clock: '2:35',
    quarter: '3rd',
    spread: -3.5,
    overUnder: 51.5,
    venue: 'Mercedes-Benz Stadium',
    network: 'CBS'
  },
  {
    id: '2',
    awayTeam: {
      name: 'Michigan',
      abbreviation: 'MICH',
      score: 14,
      record: '7-2'
    },
    homeTeam: {
      name: 'Ohio State',
      abbreviation: 'OSU',
      score: 28,
      record: '9-0'
    },
    status: 'live',
    clock: '11:42',
    quarter: '2nd',
    spread: -7,
    overUnder: 49,
    venue: 'Ohio Stadium',
    network: 'FOX'
  },
  {
    id: '3',
    awayTeam: {
      name: 'Texas',
      abbreviation: 'TEX',
      record: '8-1'
    },
    homeTeam: {
      name: 'Oklahoma',
      abbreviation: 'OU',
      record: '6-3'
    },
    status: 'pre',
    startTime: '7:00 PM ET',
    spread: -10.5,
    overUnder: 58,
    venue: 'Cotton Bowl',
    network: 'ABC'
  }
]

export const LiveGamesBoardView: React.FC = () => {
  const [games, setGames] = useState<GameData[]>(mockLiveGames)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGames(prev => prev.map(game => {
        if (game.status === 'live' && Math.random() > 0.7) {
          // Randomly update scores for live games
          const homeScoreChange = Math.random() > 0.5 ? Math.floor(Math.random() * 7) : 0
          const awayScoreChange = Math.random() > 0.5 ? Math.floor(Math.random() * 7) : 0
          
          return {
            ...game,
            homeTeam: {
              ...game.homeTeam,
              score: (game.homeTeam.score || 0) + homeScoreChange
            },
            awayTeam: {
              ...game.awayTeam,
              score: (game.awayTeam.score || 0) + awayScoreChange
            }
          }
        }
        return game
      }))
      setLastUpdated(new Date())
    }, 7000) // Update every 7 seconds like real sportsbooks

    return () => clearInterval(interval)
  }, [])

  const GameRow: React.FC<{ game: GameData }> = ({ game }) => {
    const isLive = game.status === 'live'
    const isFinal = game.status === 'final'
    const homeWinning = (game.homeTeam.score || 0) > (game.awayTeam.score || 0)
    const awayWinning = (game.awayTeam.score || 0) > (game.homeTeam.score || 0)

    return (
      <div className={`game-row ${isLive ? 'live' : ''}`}>
        
        {/* Away Team */}
        <div className="team-section away">
          <div className="team-info">
            <div className="team-logo">
              {game.awayTeam.abbreviation.substring(0, 3)}
            </div>
            <div className="team-details">
              <div className={`team-name ${awayWinning && isLive ? 'winning' : ''}`}>
                {game.awayTeam.name}
              </div>
              {game.awayTeam.record && (
                <div className="team-record">{game.awayTeam.record}</div>
              )}
            </div>
          </div>
          <div className={`team-score ${awayWinning && isLive ? 'leading' : ''}`}>
            {game.awayTeam.score !== undefined ? game.awayTeam.score : '–'}
          </div>
        </div>

        {/* Game Center */}
        <div className="game-center">
          {isLive ? (
            <div className="live-status">
              <div className="live-indicator">LIVE</div>
              <div className="game-time">{game.quarter} {game.clock}</div>
            </div>
          ) : isFinal ? (
            <div className="final-status">FINAL</div>
          ) : (
            <div className="pregame-info">
              <div className="start-time">{game.startTime}</div>
              {game.network && (
                <div className="network">{game.network}</div>
              )}
            </div>
          )}
          
          {/* Betting Lines */}
          <div className="betting-info">
            {game.spread && (
              <div className="spread">
                SPREAD: {game.spread > 0 ? '+' : ''}{game.spread}
              </div>
            )}
            {game.overUnder && (
              <div className="over-under">
                O/U: {game.overUnder}
              </div>
            )}
          </div>
        </div>

        {/* Home Team */}
        <div className="team-section home">
          <div className={`team-score ${homeWinning && isLive ? 'leading' : ''}`}>
            {game.homeTeam.score !== undefined ? game.homeTeam.score : '–'}
          </div>
          <div className="team-info">
            <div className="team-details">
              <div className={`team-name ${homeWinning && isLive ? 'winning' : ''}`}>
                {game.homeTeam.name}
              </div>
              {game.homeTeam.record && (
                <div className="team-record">{game.homeTeam.record}</div>
              )}
            </div>
            <div className="team-logo">
              {game.homeTeam.abbreviation.substring(0, 3)}
            </div>
          </div>
        </div>

        <style jsx>{`
          .game-row {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.25rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 0.75rem;
            transition: all 0.3s ease;
          }

          .game-row.live {
            border-color: var(--led-green);
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
            animation: live-pulse 2s ease-in-out infinite;
          }

          .game-row:hover {
            background: rgba(0, 0, 0, 0.5);
            border-color: rgba(255, 255, 255, 0.3);
          }

          @keyframes live-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.2); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 65, 0.4); }
          }

          /* Team Sections */
          .team-section {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .team-section.away {
            justify-content: flex-start;
          }

          .team-section.home {
            justify-content: flex-end;
            flex-direction: row-reverse;
          }

          .team-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .team-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #374151, #1F2937);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.75rem;
            color: white;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
          }

          .team-details {
            text-align: left;
          }

          .home .team-details {
            text-align: right;
          }

          .team-name {
            font-size: 1.125rem;
            font-weight: 600;
            color: white;
            margin: 0;
            transition: all 0.3s ease;
          }

          .team-name.winning {
            color: var(--led-green);
            text-shadow: 0 0 10px currentColor;
          }

          .team-record {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 0.25rem;
            font-family: 'SF Mono', Monaco, monospace;
          }

          /* Scores */
          .team-score {
            font-size: 2rem;
            font-weight: 700;
            color: var(--led-white);
            font-family: 'SF Mono', Monaco, monospace;
            text-shadow: 0 0 10px currentColor;
            transition: all 0.3s ease;
            min-width: 3rem;
            text-align: center;
          }

          .team-score.leading {
            color: var(--led-green);
            transform: scale(1.1);
            text-shadow: 
              0 0 10px currentColor,
              0 0 20px currentColor;
          }

          /* Game Center */
          .game-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            min-width: 140px;
            text-align: center;
          }

          .live-status {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
          }

          .live-indicator {
            background: var(--led-red);
            color: black;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            font-family: 'SF Mono', Monaco, monospace;
            animation: led-flicker 3s infinite linear;
          }

          @keyframes led-flicker {
            0%, 97% { opacity: 1; }
            98% { opacity: 0.95; }
            100% { opacity: 0.92; }
          }

          .game-time {
            font-size: 0.875rem;
            color: var(--led-white);
            font-family: 'SF Mono', Monaco, monospace;
            font-weight: 600;
          }

          .final-status {
            color: var(--led-amber);
            font-weight: 700;
            font-size: 1rem;
            font-family: 'SF Mono', Monaco, monospace;
          }

          .pregame-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .start-time {
            font-size: 0.875rem;
            color: white;
            font-weight: 500;
          }

          .network {
            font-size: 0.75rem;
            color: var(--vegas-gold);
            font-weight: 600;
          }

          .betting-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-top: 0.5rem;
          }

          .spread,
          .over-under {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            font-family: 'SF Mono', Monaco, monospace;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .game-row {
              grid-template-columns: 1fr auto 1fr;
              gap: 0.5rem;
              padding: 0.75rem 1rem;
            }

            .team-name {
              font-size: 1rem;
            }

            .team-score {
              font-size: 1.5rem;
              min-width: 2.5rem;
            }

            .game-center {
              min-width: 100px;
            }

            .team-logo {
              width: 32px;
              height: 32px;
              font-size: 0.625rem;
            }
          }

          @media (max-width: 480px) {
            .team-details {
              display: none;
            }

            .team-info {
              gap: 0.5rem;
            }

            .betting-info {
              display: none;
            }
          }

          /* Accessibility */
          @media (prefers-reduced-motion: reduce) {
            .game-row.live {
              animation: none;
            }

            .live-indicator {
              animation: none;
            }

            .team-score.leading {
              transform: none;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="live-games-board">
      {/* Board Header */}
      <div className="board-header">
        <h2 className="board-title">Live College Football</h2>
        <div className="update-indicator">
          <span className="update-dot" />
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Games List */}
      <div className="games-list">
        {games.length > 0 ? (
          games.map(game => (
            <GameRow key={game.id} game={game} />
          ))
        ) : (
          <div className="no-games">
            <div className="no-games-text">No live games at the moment</div>
            <div className="check-back">Check back for live scores and updates</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .live-games-board {
          width: 100%;
        }

        .board-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .board-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--led-white);
          margin: 0;
          font-family: 'SF Pro Display', system-ui, sans-serif;
        }

        .update-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .update-dot {
          width: 8px;
          height: 8px;
          background: var(--led-green);
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .games-list {
          min-height: 200px;
        }

        .no-games {
          text-align: center;
          padding: 3rem 1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .no-games-text {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .check-back {
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .board-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .board-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}