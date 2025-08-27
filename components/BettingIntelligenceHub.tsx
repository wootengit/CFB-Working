'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * 🧠 Betting Intelligence Hub
 * 
 * Premium analytics dashboard featuring:
 * - Key betting trends and insights
 * - Real-time line movement alerts
 * - Conference performance metrics
 * - Sharp vs. Public money indicators
 * - Professional trader-style interface
 */

interface TrendData {
  category: string
  metric: string
  value: string
  change: number
  confidence: 'high' | 'medium' | 'low'
  color: string
}

interface LineMovement {
  game: string
  originalSpread: number
  currentSpread: number
  movement: number
  volume: string
  timestamp: string
}

const mockTrends: TrendData[] = [
  {
    category: 'ATS Performance',
    metric: 'Home Underdogs',
    value: '67%',
    change: +12,
    confidence: 'high',
    color: '--led-green'
  },
  {
    category: 'Over/Under',
    SEC: 'SEC Games',
    metric: 'SEC Games',
    value: '58% O',
    change: +8,
    confidence: 'medium',
    color: '--vegas-gold'
  },
  {
    category: 'Line Movement',
    metric: 'Sharp Action',
    value: '73% Fav',
    change: -5,
    confidence: 'high',
    color: '--led-blue'
  },
  {
    category: 'Public Betting',
    metric: 'Ticket Count',
    value: '84% Home',
    change: +15,
    confidence: 'low',
    color: '--led-red'
  }
]

const mockLineMovements: LineMovement[] = [
  {
    game: 'Alabama @ Georgia',
    originalSpread: -3.5,
    currentSpread: -2.5,
    movement: +1,
    volume: 'Heavy',
    timestamp: '2 min ago'
  },
  {
    game: 'Ohio State @ Michigan',
    originalSpread: -7,
    currentSpread: -8.5,
    movement: -1.5,
    volume: 'Sharp',
    timestamp: '5 min ago'
  },
  {
    game: 'Texas @ Oklahoma',
    originalSpread: -10.5,
    currentSpread: -9,
    movement: +1.5,
    volume: 'Public',
    timestamp: '8 min ago'
  }
]

export const BettingIntelligenceHub: React.FC = () => {
  const [trends, setTrends] = useState<TrendData[]>(mockTrends)
  const [movements, setMovements] = useState<LineMovement[]>(mockLineMovements)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrends(prev => prev.map(trend => ({
        ...trend,
        change: trend.change + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
      })))
      setLastUpdated(new Date())
    }, 12000) // Update every 12 seconds

    return () => clearInterval(interval)
  }, [])

  const TrendCard: React.FC<{ trend: TrendData }> = ({ trend }) => {
    const getColorValue = (colorVar: string) => {
      const colorMap = {
        '--led-green': '#00FF41',
        '--led-red': '#FF2D2D', 
        '--led-blue': '#2D4FFF',
        '--vegas-gold': '#FCB131'
      }
      return colorMap[colorVar as keyof typeof colorMap] || '#F8F8FF'
    }

    const color = getColorValue(trend.color)
    const isPositive = trend.change >= 0

    return (
      <div className="trend-card">
        <div className="trend-header">
          <div className="trend-category">{trend.category}</div>
          <div 
            className={`confidence-indicator ${trend.confidence}`}
            style={{ backgroundColor: color }}
          >
            {trend.confidence.toUpperCase()}
          </div>
        </div>
        
        <div className="trend-metric">{trend.metric}</div>
        
        <div className="trend-value-row">
          <div className="trend-value" style={{ color }}>
            {trend.value}
          </div>
          <div className={`trend-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{trend.change}%
          </div>
        </div>

        <style jsx>{`
          .trend-card {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 1rem;
            transition: all 0.3s ease;
          }

          .trend-card:hover {
            border-color: ${color}40;
            box-shadow: 0 0 20px ${color}20;
          }

          .trend-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
          }

          .trend-category {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .confidence-indicator {
            font-size: 0.625rem;
            color: black;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-weight: 700;
            letter-spacing: 0.05em;
            font-family: 'SF Mono', Monaco, monospace;
          }

          .confidence-indicator.high {
            opacity: 1;
          }

          .confidence-indicator.medium {
            opacity: 0.8;
          }

          .confidence-indicator.low {
            opacity: 0.6;
          }

          .trend-metric {
            font-size: 0.875rem;
            color: white;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          .trend-value-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }

          .trend-value {
            font-size: 1.5rem;
            font-weight: 700;
            font-family: 'SF Mono', Monaco, monospace;
            text-shadow: 0 0 10px currentColor;
          }

          .trend-change {
            font-size: 0.875rem;
            font-weight: 600;
            font-family: 'SF Mono', Monaco, monospace;
          }

          .trend-change.positive {
            color: var(--led-green);
          }

          .trend-change.negative {
            color: var(--led-red);
          }
        `}</style>
      </div>
    )
  }

  const MovementItem: React.FC<{ movement: LineMovement }> = ({ movement }) => {
    const isMovingUp = movement.movement > 0
    const movementColor = isMovingUp ? 'var(--led-green)' : 'var(--led-red)'
    
    const getVolumeColor = (volume: string) => {
      switch (volume) {
        case 'Sharp': return 'var(--led-blue)'
        case 'Heavy': return 'var(--vegas-gold)'
        default: return 'var(--led-white)'
      }
    }

    return (
      <div className="movement-item">
        <div className="movement-game">{movement.game}</div>
        <div className="movement-details">
          <div className="spread-change">
            <span className="original-spread">{movement.originalSpread}</span>
            <span className="arrow" style={{ color: movementColor }}>
              {isMovingUp ? '↗' : '↘'}
            </span>
            <span className="current-spread" style={{ color: movementColor }}>
              {movement.currentSpread}
            </span>
          </div>
          <div className="movement-meta">
            <span className="volume" style={{ color: getVolumeColor(movement.volume) }}>
              {movement.volume}
            </span>
            <span className="timestamp">{movement.timestamp}</span>
          </div>
        </div>

        <style jsx>{`
          .movement-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .movement-item:last-child {
            border-bottom: none;
          }

          .movement-game {
            font-size: 0.875rem;
            color: white;
            font-weight: 500;
          }

          .movement-details {
            text-align: right;
          }

          .spread-change {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.25rem;
            font-family: 'SF Mono', Monaco, monospace;
            font-weight: 600;
          }

          .original-spread {
            color: rgba(255, 255, 255, 0.6);
            text-decoration: line-through;
          }

          .arrow {
            font-size: 1.125rem;
          }

          .current-spread {
            font-weight: 700;
          }

          .movement-meta {
            display: flex;
            gap: 0.75rem;
            font-size: 0.75rem;
            font-family: 'SF Mono', Monaco, monospace;
          }

          .volume {
            font-weight: 600;
          }

          .timestamp {
            color: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="betting-intelligence-hub">
      {/* Hub Header */}
      <div className="hub-header">
        <h2 className="hub-title">Betting Intelligence</h2>
        <Link href="/betting-trends" className="view-all-link">
          View Full Analysis →
        </Link>
      </div>

      {/* Key Trends Grid */}
      <div className="trends-section">
        <h3 className="section-title">Key Market Trends</h3>
        <div className="trends-grid">
          {trends.map((trend, index) => (
            <TrendCard key={index} trend={trend} />
          ))}
        </div>
      </div>

      {/* Line Movements */}
      <div className="movements-section">
        <div className="movements-header">
          <h3 className="section-title">Live Line Movement</h3>
          <div className="update-time">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="movements-panel">
          {movements.map((movement, index) => (
            <MovementItem key={index} movement={movement} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link href="/sportsbook/live" className="action-button primary">
          <span className="button-icon">💰</span>
          Live Sportsbook
        </Link>
        <Link href="/betting-trends" className="action-button secondary">
          <span className="button-icon">📊</span>
          Full Analytics
        </Link>
      </div>

      <style jsx>{`
        .betting-intelligence-hub {
          width: 100%;
        }

        .hub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hub-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--led-white);
          margin: 0;
          font-family: 'SF Pro Display', system-ui, sans-serif;
        }

        .view-all-link {
          color: var(--vegas-gold);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .view-all-link:hover {
          color: white;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
          font-family: 'SF Pro Display', system-ui, sans-serif;
        }

        .trends-section {
          margin-bottom: 2rem;
        }

        .trends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .movements-section {
          margin-bottom: 2rem;
        }

        .movements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .update-time {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .movements-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .action-button.primary {
          background: linear-gradient(135deg, var(--vegas-gold), #e6a429);
          color: black;
        }

        .action-button.secondary {
          background: rgba(45, 79, 255, 0.2);
          color: var(--led-blue);
          border-color: var(--led-blue);
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .action-button.primary:hover {
          box-shadow: 0 4px 12px rgba(252, 177, 49, 0.4);
        }

        .action-button.secondary:hover {
          background: rgba(45, 79, 255, 0.3);
        }

        .button-icon {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .hub-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .trends-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            flex-direction: column;
          }

          .movements-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}