'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * 📰 News Stream Widget
 * 
 * Real-time college football news feed:
 * - Breaking news alerts with LED styling
 * - Trending stories with engagement metrics
 * - Source attribution and timestamps
 * - Smooth auto-refresh and animations
 */

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  timestamp: string
  category: 'breaking' | 'trending' | 'analysis' | 'scores'
  priority: number
  url?: string
}

// Mock news data - In production, this would come from your news API
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Alabama QB Injured in Practice',
    summary: 'Starting quarterback suffers minor ankle injury during Tuesday practice session',
    source: 'ESPN',
    timestamp: '5 min ago',
    category: 'breaking',
    priority: 1
  },
  {
    id: '2',
    title: 'CFP Rankings Released',
    summary: 'Committee releases updated College Football Playoff rankings with surprises',
    source: 'CBS Sports',
    timestamp: '12 min ago',
    category: 'trending',
    priority: 2
  },
  {
    id: '3',
    title: 'Transfer Portal Update',
    summary: 'Five-star linebacker enters transfer portal, top programs interested',
    source: 'The Athletic',
    timestamp: '1 hr ago',
    category: 'trending',
    priority: 3
  },
  {
    id: '4',
    title: 'Weather Alert: Michigan Game',
    summary: 'Heavy snow expected for Saturday\'s rivalry matchup in Ann Arbor',
    source: 'Weather Channel',
    timestamp: '2 hrs ago',
    category: 'analysis',
    priority: 2
  },
  {
    id: '5',
    title: 'Recruiting Class Rankings',
    summary: 'Updated 2025 recruiting class rankings show shifts in top programs',
    source: '247Sports',
    timestamp: '3 hrs ago',
    category: 'analysis',
    priority: 3
  }
]

export const NewsStreamWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(mockNews)
  const [isLive, setIsLive] = useState(true)

  // Simulate live news updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new breaking news item
      if (Math.random() > 0.8) {
        const breakingNews: NewsItem = {
          id: `breaking-${Date.now()}`,
          title: 'BREAKING: Game Time Change',
          summary: 'Major conference game moved due to weather conditions',
          source: 'CFB News',
          timestamp: 'Just now',
          category: 'breaking',
          priority: 1
        }
        
        setNews(prev => [breakingNews, ...prev.slice(0, 4)])
      }
    }, 15000) // Check for new breaking news every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getCategoryColor = (category: NewsItem['category']) => {
    switch (category) {
      case 'breaking': return 'var(--led-red)'
      case 'trending': return 'var(--vegas-gold)'
      case 'analysis': return 'var(--led-blue)'
      case 'scores': return 'var(--led-green)'
      default: return 'var(--led-white)'
    }
  }

  const getCategoryIcon = (category: NewsItem['category']) => {
    switch (category) {
      case 'breaking': return '🚨'
      case 'trending': return '📈'
      case 'analysis': return '📊'
      case 'scores': return '🏈'
      default: return '📰'
    }
  }

  const NewsItemComponent: React.FC<{ item: NewsItem; index: number }> = ({ item, index }) => {
    const categoryColor = getCategoryColor(item.category)
    const isBreaking = item.category === 'breaking'

    return (
      <div className={`news-item ${isBreaking ? 'breaking' : ''}`} style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}>
        
        {/* Priority Indicator */}
        <div className="news-header">
          <div className="category-badge" style={{ backgroundColor: categoryColor }}>
            <span className="category-icon">{getCategoryIcon(item.category)}</span>
            <span className="category-text">{item.category.toUpperCase()}</span>
          </div>
          <div className="news-timestamp">{item.timestamp}</div>
        </div>

        {/* News Content */}
        <div className="news-content">
          <h4 className="news-title">{item.title}</h4>
          <p className="news-summary">{item.summary}</p>
        </div>

        {/* News Footer */}
        <div className="news-footer">
          <div className="news-source">{item.source}</div>
          {isBreaking && (
            <div className="breaking-indicator">
              LIVE
            </div>
          )}
        </div>

        <style jsx>{`
          .news-item {
            padding: 1rem;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 0.75rem;
            transition: all 0.3s ease;
            animation: slideIn 0.5s ease-out var(--delay);
            position: relative;
          }

          .news-item.breaking {
            border-color: var(--led-red);
            box-shadow: 0 0 20px rgba(255, 45, 45, 0.3);
            animation: slideIn 0.5s ease-out var(--delay), breakingPulse 2s ease-in-out infinite;
          }

          .news-item:hover {
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(0, 0, 0, 0.6);
            transform: translateY(-2px);
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes breakingPulse {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(255, 45, 45, 0.3); 
            }
            50% { 
              box-shadow: 0 0 30px rgba(255, 45, 45, 0.5); 
            }
          }

          .news-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
          }

          .category-badge {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.25rem 0.625rem;
            border-radius: 4px;
            color: black;
            font-size: 0.625rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            font-family: 'SF Mono', Monaco, monospace;
          }

          .category-icon {
            font-size: 0.75rem;
          }

          .news-timestamp {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.6);
            font-family: 'SF Mono', Monaco, monospace;
          }

          .news-content {
            margin-bottom: 0.75rem;
          }

          .news-title {
            font-size: 0.9375rem;
            font-weight: 600;
            color: white;
            margin: 0 0 0.5rem 0;
            line-height: 1.4;
          }

          .news-summary {
            font-size: 0.8125rem;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            line-height: 1.4;
          }

          .news-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .news-source {
            font-size: 0.75rem;
            color: var(--vegas-gold);
            font-weight: 500;
          }

          .breaking-indicator {
            background: var(--led-red);
            color: black;
            padding: 0.1875rem 0.375rem;
            border-radius: 3px;
            font-size: 0.625rem;
            font-weight: 700;
            font-family: 'SF Mono', Monaco, monospace;
            animation: led-flicker 2s infinite linear;
          }

          @keyframes led-flicker {
            0%, 95% { opacity: 1; }
            96% { opacity: 0.8; }
            100% { opacity: 0.9; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="news-stream-widget">
      {/* Widget Header */}
      <div className="widget-header">
        <div className="widget-title-row">
          <h3 className="widget-title">Latest News</h3>
          <div className={`live-indicator ${isLive ? 'active' : ''}`}>
            <span className="live-dot" />
            LIVE
          </div>
        </div>
        <Link href="/news" className="view-more-link">
          View All News →
        </Link>
      </div>

      {/* News Stream */}
      <div className="news-stream">
        {news.slice(0, 5).map((item, index) => (
          <NewsItemComponent key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Stream Footer */}
      <div className="stream-footer">
        <div className="auto-refresh">
          <span className="refresh-icon">🔄</span>
          Auto-refreshing every 30s
        </div>
      </div>

      <style jsx>{`
        .news-stream-widget {
          width: 100%;
          height: 100%;
        }

        .widget-header {
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .widget-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .widget-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0;
          font-family: 'SF Pro Display', system-ui, sans-serif;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          font-family: 'SF Mono', Monaco, monospace;
        }

        .live-indicator.active {
          color: var(--led-green);
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: var(--led-green);
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .view-more-link {
          color: var(--vegas-gold);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.8125rem;
          transition: color 0.3s ease;
        }

        .view-more-link:hover {
          color: white;
        }

        .news-stream {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
          margin-right: -0.5rem;
        }

        .news-stream::-webkit-scrollbar {
          width: 4px;
        }

        .news-stream::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .news-stream::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .news-stream::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .stream-footer {
          margin-top: 1rem;
          text-align: center;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .auto-refresh {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .refresh-icon {
          font-size: 0.875rem;
          animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .news-item {
            animation: none;
          }

          .news-item.breaking {
            animation: none;
          }

          .live-dot,
          .breaking-indicator,
          .refresh-icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}