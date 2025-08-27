'use client'

import React, { useState, useEffect } from 'react'
import { EnhancedTeamData } from '@/types/cfb-api'

interface LEDSportsbookBoardProps {
  teams: EnhancedTeamData[]
  title?: string
}

const LEDSportsbookBoard: React.FC<LEDSportsbookBoardProps> = ({ 
  teams, 
  title = "COLLEGE FOOTBALL ODDS" 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [flickerIndex, setFlickerIndex] = useState(-1)

  // Update time every second for authentic sportsbook feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Random LED flicker effect for authenticity
  useEffect(() => {
    const flickerTimer = setInterval(() => {
      setFlickerIndex(Math.random() > 0.95 ? Math.floor(Math.random() * teams.length) : -1)
    }, 150)
    return () => clearInterval(flickerTimer)
  }, [teams.length])

  // Mock betting odds (you'd replace with real data)
  const generateOdds = (team: EnhancedTeamData, index: number) => {
    const spread = (team.spPlusRating / 5) + (Math.random() * 6 - 3)
    const overUnder = 45 + (Math.random() * 20)
    const moneylineHome = team.spPlusRating > 0 ? -110 - (team.spPlusRating * 5) : 110 + Math.abs(team.spPlusRating * 5)
    const moneylineAway = -moneylineHome + (Math.random() * 20 - 10)

    return {
      spread: spread.toFixed(1),
      overUnder: overUnder.toFixed(1),
      moneylineHome: moneylineHome > 0 ? `+${Math.round(moneylineHome)}` : `${Math.round(moneylineHome)}`,
      moneylineAway: moneylineAway > 0 ? `+${Math.round(moneylineAway)}` : `${Math.round(moneylineAway)}`
    }
  }

  return (
    <div className="led-sportsbook-container">
      <style jsx global>{`
        .led-sportsbook-container {
          background: #000000;
          color: #ffffff;
          font-family: 'SF Mono', 'Monaco', 'Roboto Mono', monospace;
          font-variant-numeric: tabular-nums;
          padding: 20px;
          overflow-x: auto;
          min-height: 100vh;
          position: relative;
        }

        /* Professional CRT scanlines effect */
        .led-sportsbook-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            transparent 50%,
            rgba(0, 255, 0, 0.03) 50%,
            rgba(0, 255, 0, 0.05) 51%,
            transparent 52%
          );
          background-size: 100% 4px;
          pointer-events: none;
          animation: scanline-move 0.1s linear infinite;
        }

        @keyframes scanline-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        /* LED Board Header */
        .led-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px 0;
          border-bottom: 2px solid #333;
        }

        .led-title {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #FFB000;
          text-shadow: 
            0 0 5px #FFB000,
            0 0 10px #FFB000,
            0 0 15px #FFB000,
            0 0 20px #FFB000;
          margin-bottom: 10px;
          animation: subtle-glow 3s ease-in-out infinite alternate;
        }

        .led-datetime {
          font-size: 1rem;
          color: #00FF41;
          text-shadow: 
            0 0 5px #00FF41,
            0 0 10px #00FF41;
          letter-spacing: 0.1em;
        }

        @keyframes subtle-glow {
          from { text-shadow: 0 0 5px #FFB000, 0 0 10px #FFB000, 0 0 15px #FFB000, 0 0 20px #FFB000; }
          to { text-shadow: 0 0 8px #FFB000, 0 0 15px #FFB000, 0 0 25px #FFB000, 0 0 30px #FFB000; }
        }

        /* Main Board Layout */
        .led-board {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2px;
          background: #111;
          border: 3px solid #333;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 10px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }

        /* Column Headers */
        .led-headers {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
          gap: 10px;
          padding: 15px 10px;
          background: #222;
          border-bottom: 2px solid #444;
          margin-bottom: 5px;
        }

        .led-header-cell {
          color: #FFB000;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-align: center;
          text-shadow: 0 0 5px currentColor;
        }

        /* Game Rows */
        .led-row {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
          gap: 10px;
          padding: 12px 10px;
          border-bottom: 1px solid #333;
          transition: all 0.3s ease;
          position: relative;
        }

        .led-row:hover {
          background: #1a1a1a;
          transform: scale(1.01);
        }

        .led-row.flickering {
          animation: authentic-flicker 0.15s infinite linear alternate;
        }

        @keyframes authentic-flicker {
          0% { opacity: 1; }
          97% { opacity: 1; }
          98% { opacity: 0.98; }
          100% { opacity: 0.96; }
        }

        /* Team Cell */
        .led-team {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .led-team-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
          border-radius: 3px;
        }

        .led-team-name {
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 600;
          text-shadow: 
            0 0 5px currentColor,
            0 0 10px currentColor;
          letter-spacing: 0.05em;
        }

        .led-record {
          color: #888;
          font-size: 0.8rem;
          margin-left: 10px;
        }

        /* Data Cells */
        .led-cell {
          text-align: center;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* LED Color Coding */
        .led-positive {
          color: #00FF41;
          text-shadow: 
            0 0 5px #00FF41,
            0 0 10px #00FF41,
            0 0 15px #00FF41;
        }

        .led-negative {
          color: #FF2D2D;
          text-shadow: 
            0 0 5px #FF2D2D,
            0 0 10px #FF2D2D,
            0 0 15px #FF2D2D;
        }

        .led-neutral {
          color: #FFB000;
          text-shadow: 
            0 0 5px #FFB000,
            0 0 10px #FFB000;
        }

        .led-spread {
          color: #2D4FFF;
          text-shadow: 
            0 0 5px #2D4FFF,
            0 0 10px #2D4FFF;
        }

        /* Ranking indicators */
        .led-rank {
          background: #333;
          border: 1px solid #555;
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 0.75rem;
          color: #FFB000;
          text-shadow: 0 0 5px currentColor;
        }

        .led-rank.top-25 {
          background: #1a4;
          border-color: #2a6;
          color: #fff;
        }

        /* Responsive design */
        @media (max-width: 1200px) {
          .led-headers,
          .led-row {
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          }
          
          .led-header-cell:nth-child(n+6),
          .led-cell:nth-child(n+6) {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .led-title {
            font-size: 1.8rem;
          }
          
          .led-headers,
          .led-row {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
          
          .led-header-cell:nth-child(n+5),
          .led-cell:nth-child(n+5) {
            display: none;
          }
        }
      `}</style>

      {/* LED Board Header */}
      <div className="led-header">
        <div className="led-title">{title}</div>
        <div className="led-datetime">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - {currentTime.toLocaleTimeString('en-US')}
        </div>
      </div>

      {/* Main LED Board */}
      <div className="led-board">
        {/* Column Headers */}
        <div className="led-headers">
          <div className="led-header-cell">TEAM</div>
          <div className="led-header-cell">REC</div>
          <div className="led-header-cell">SP+</div>
          <div className="led-header-cell">SPREAD</div>
          <div className="led-header-cell">O/U</div>
          <div className="led-header-cell">ML</div>
          <div className="led-header-cell">EXP</div>
          <div className="led-header-cell">PPA</div>
        </div>

        {/* Game Rows */}
        {teams.slice(0, 25).map((team, index) => {
          const odds = generateOdds(team, index)
          const isFlickering = index === flickerIndex
          
          return (
            <div 
              key={team.teamId} 
              className={`led-row ${isFlickering ? 'flickering' : ''}`}
            >
              {/* Team Cell */}
              <div className="led-team">
                <img 
                  src={team.logo} 
                  alt={team.team}
                  className="led-team-logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
                  }}
                />
                <span className="led-team-name">
                  {team.team.toUpperCase()}
                </span>
                <span className="led-record">
                  {team.wins}-{team.losses}
                </span>
              </div>

              {/* Record */}
              <div className="led-cell">
                <span className={team.wins > team.losses ? 'led-positive' : 'led-negative'}>
                  {team.wins}-{team.losses}
                </span>
              </div>

              {/* SP+ Rating */}
              <div className="led-cell">
                {team.spPlusRanking <= 25 && (
                  <span className="led-rank top-25">#{team.spPlusRanking}</span>
                )}
                {team.spPlusRanking > 25 && (
                  <span className="led-rank">#{team.spPlusRanking}</span>
                )}
              </div>

              {/* Spread */}
              <div className="led-cell">
                <span className="led-spread">
                  {Number(odds.spread) > 0 ? '+' : ''}{odds.spread}
                </span>
              </div>

              {/* Over/Under */}
              <div className="led-cell">
                <span className="led-neutral">
                  {odds.overUnder}
                </span>
              </div>

              {/* Moneyline */}
              <div className="led-cell">
                <span className={odds.moneylineHome.startsWith('+') ? 'led-positive' : 'led-negative'}>
                  {odds.moneylineHome}
                </span>
              </div>

              {/* Explosiveness */}
              <div className="led-cell">
                <span className={team.explosiveness > 1.5 ? 'led-positive' : team.explosiveness > 1.2 ? 'led-neutral' : 'led-negative'}>
                  {team.explosiveness.toFixed(2)}
                </span>
              </div>

              {/* PPA */}
              <div className="led-cell">
                <span className={team.offensePPA > 0 ? 'led-positive' : 'led-negative'}>
                  {team.offensePPA.toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LEDSportsbookBoard