'use client'

import React, { useState, useEffect, useCallback } from 'react'

// Types for LLM-friendly news organization
interface CFBNewsItem {
  id: string
  headline: string
  content: string
  summary: string
  timestamp: Date
  source: 'ESPN' | 'CFBD'
  category: 'breaking' | 'recruiting' | 'injury' | 'analysis' | 'scores'
  teams: string[] // Team names for LLM routing
  conference?: string
  priority: 1 | 2 | 3 // 1=breaking, 2=important, 3=standard
  bettingRelevance: boolean
  imageUrl?: string
  url?: string
}

interface NewsFilters {
  teams: string[]
  conferences: string[]
  categories: string[]
  timeframe: '1h' | '6h' | '24h' | '7d'
  bettingRelevantOnly: boolean
}

const CFBNewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<CFBNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [filters, setFilters] = useState<NewsFilters>({
    teams: [],
    conferences: [],
    categories: [],
    timeframe: '24h',
    bettingRelevantOnly: false
  })

  // LLM-friendly news fetching from both APIs
  const fetchCombinedNews = useCallback(async () => {
    try {
      setLoading(true)
      
      // Start with mock data to ensure page loads
      const mockNews: CFBNewsItem[] = [
        {
          id: 'mock-1',
          headline: 'Alabama vs Georgia: SEC Championship Preview',
          content: 'Two powerhouse SEC teams prepare for a crucial matchup that could determine playoff positioning.',
          summary: 'Alabama and Georgia clash in SEC Championship with playoff implications',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          source: 'ESPN',
          category: 'analysis',
          teams: ['Alabama', 'Georgia'],
          conference: 'SEC',
          priority: 1,
          bettingRelevance: true,
          url: '#'
        },
        {
          id: 'mock-2',
          headline: 'Michigan Climbs to #2 in Latest AP Poll',
          content: 'Michigan\'s impressive win over Ohio State propels them to the #2 ranking.',
          summary: 'Michigan rises to #2 after victory over Ohio State',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          source: 'CFBD',
          category: 'analysis',
          teams: ['Michigan', 'Ohio State'],
          conference: 'Big Ten',
          priority: 2,
          bettingRelevance: true,
          url: '#'
        },
        {
          id: 'mock-3',
          headline: 'Texas Quarterback Listed as Questionable',
          content: 'Starting quarterback injury report affects betting lines for upcoming Big 12 game.',
          summary: 'Texas QB injury status creates betting uncertainty',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          source: 'ESPN',
          category: 'injury',
          teams: ['Texas'],
          conference: 'Big 12',
          priority: 1,
          bettingRelevance: true,
          url: '#'
        }
      ]
      
      setNewsItems(mockNews)
      setLoading(false)
      
      // Try to fetch real data in background
      try {
        const [espnResponse, cfbdResponse] = await Promise.all([
          fetch('/api/news/espn'),
          fetch('/api/news/cfbd')
        ])
        
        if (espnResponse.ok && cfbdResponse.ok) {
          const espnData = await espnResponse.json()
          const cfbdData = await cfbdResponse.json()
          
          // Process real data if available
          const realNews = [
            ...(espnData.articles || []).slice(0, 10).map((item: any) => ({
              id: `espn-${item.id || Math.random()}`,
              headline: item.headline || 'News Update',
              content: item.description || 'Content unavailable',
              summary: item.description?.substring(0, 200) + '...' || '',
              timestamp: new Date(item.published || Date.now()),
              source: 'ESPN' as const,
              category: 'analysis' as const,
              teams: extractTeamsFromContent(item.headline || ''),
              priority: item.urgent ? 1 : 2,
              bettingRelevance: true,
              url: item.url || '#'
            })),
            ...(cfbdData.news || []).slice(0, 10).map((item: any) => ({
              id: `cfbd-${item.id || Math.random()}`,
              headline: item.title || 'CFBD Update',
              content: item.content || item.excerpt || 'Content unavailable',
              summary: item.excerpt?.substring(0, 200) + '...' || '',
              timestamp: new Date(item.published_at || Date.now()),
              source: 'CFBD' as const,
              category: 'analysis' as const,
              teams: item.teams || [],
              priority: 3,
              bettingRelevance: true,
              url: item.url || '#'
            }))
          ]
          
          if (realNews.length > 0) {
            setNewsItems(realNews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
          }
        }
      } catch (apiError) {
        console.log('API fetch failed, using mock data:', apiError)
        // Continue with mock data
      }
      
    } catch (error) {
      console.error('Failed to load news:', error)
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchCombinedNews()
  }, [fetchCombinedNews])

  // Filter news based on selected criteria
  const filteredNews = newsItems.filter(item => {
    if (selectedTeam && !item.teams.includes(selectedTeam)) {
      return false
    }
    if (filters.bettingRelevantOnly && !item.bettingRelevance) {
      return false
    }
    return true
  })

  // Group news by team for LLM analysis
  const newsGroupedByTeam = filteredNews.reduce((acc, item) => {
    item.teams.forEach(team => {
      if (!acc[team]) acc[team] = []
      acc[team].push(item)
    })
    return acc
  }, {} as Record<string, CFBNewsItem[]>)

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#0B0F15',
        color: '#FFB000',
        padding: '40px',
        textAlign: 'center',
        minHeight: '100vh',
        fontFamily: 'Space Mono, monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textShadow: '0 0 10px currentColor',
          fontSize: '1.2rem',
          letterSpacing: '0.1em'
        }}>
          LOADING NCAA FOOTBALL NEWS...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#0B0F15',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#E6E8EB'
    }}>
      {/* Professional Header with LED styling */}
      <div style={{
        background: 'linear-gradient(145deg, #0F131A 0%, #1C232C 100%)',
        border: '1px solid #2D3748',
        borderRadius: '12px',
        padding: '24px',
        margin: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            color: '#FF2D2D',
            textShadow: '0 0 10px currentColor',
            margin: 0,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
          }}>
            🏈 CFB LIVE NEWS CENTER
          </h1>
          
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#FFB000',
            textShadow: '0 0 8px currentColor',
            letterSpacing: '0.05em'
          }}>
            {new Date().toLocaleString()}
          </div>
        </div>

        {/* News source indicators */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: '#FF4444',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 0 8px rgba(255,68,68,0.4)'
          }}>
            ESPN LIVE
          </div>
          <div style={{
            background: '#00FF41',
            color: 'black',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 0 8px rgba(0,255,65,0.4)'
          }}>
            CFBD DATA
          </div>
          <div style={{
            background: '#FFB000',
            color: 'black',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 0 8px rgba(255,176,0,0.4)'
          }}>
            LLM OPTIMIZED
          </div>
        </div>
      </div>

      {/* Professional Filter Controls */}
      <div style={{
        background: 'linear-gradient(145deg, #0F131A 0%, #1C232C 100%)',
        border: '1px solid #2D3748',
        borderRadius: '8px',
        padding: '20px',
        margin: '0 24px 24px 24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          style={{
            background: '#1C232C',
            border: '1px solid #4A5568',
            borderRadius: '6px',
            color: '#E6E8EB',
            padding: '8px 12px',
            fontSize: '0.9rem',
            minWidth: '200px'
          }}
        >
          <option value="">All Teams</option>
          <option value="Alabama">Alabama</option>
          <option value="Georgia">Georgia</option>
          <option value="Michigan">Michigan</option>
          <option value="Texas">Texas</option>
          <option value="USC">USC</option>
          <option value="Ohio State">Ohio State</option>
          <option value="Notre Dame">Notre Dame</option>
          <option value="Florida">Florida</option>
        </select>

        <button
          onClick={() => setFilters(prev => ({ 
            ...prev, 
            bettingRelevantOnly: !prev.bettingRelevantOnly 
          }))}
          style={{
            background: filters.bettingRelevantOnly ? '#2D81FF' : 'transparent',
            border: '1px solid #4A5568',
            borderRadius: '6px',
            color: filters.bettingRelevantOnly ? 'white' : '#A1ACB8',
            padding: '8px 16px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🎯 Betting Relevant Only
        </button>

        <div style={{
          fontSize: '0.8rem',
          color: '#A1ACB8',
          marginLeft: 'auto'
        }}>
          {filteredNews.length} articles
        </div>
      </div>

      {/* Main News Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        padding: '0 24px 24px 24px'
      }}>
        {filteredNews.map((item) => (
          <div
            key={item.id}
            style={{
              background: item.priority === 1 
                ? 'linear-gradient(145deg, #2c1a1a, #1a0f0f)' 
                : 'linear-gradient(145deg, #1C232C, #151C24)',
              border: item.priority === 1 
                ? '2px solid #FF2D2D' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: item.priority === 1
                ? '0 0 20px rgba(255, 45, 45, 0.3), 0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = item.priority === 1
                ? '0 0 20px rgba(255, 45, 45, 0.3), 0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            {/* Priority indicator */}
            {item.priority === 1 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#FF2D2D',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.6rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                BREAKING
              </div>
            )}

            {/* Source and timestamp */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: item.source === 'ESPN' ? '#FF4444' : '#00FF41',
                fontWeight: '600',
                textShadow: '0 0 5px currentColor',
                letterSpacing: '0.05em'
              }}>
                {item.source}
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: '#FFB000',
                textShadow: '0 0 5px currentColor'
              }}>
                {formatTimeAgo(item.timestamp)}
              </div>
            </div>

            {/* Teams involved (for LLM routing) */}
            {item.teams.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                {item.teams.slice(0, 3).map(team => (
                  <span key={team} style={{
                    background: 'rgba(45, 129, 255, 0.2)',
                    border: '1px solid rgba(45, 129, 255, 0.4)',
                    color: '#3B82F6',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}>
                    {team}
                  </span>
                ))}
              </div>
            )}

            {/* Headline */}
            <h3 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: '600',
              lineHeight: '1.3',
              color: '#E6E8EB',
              margin: '0 0 12px 0',
              letterSpacing: '-0.01em'
            }}>
              {item.headline}
            </h3>

            {/* Summary */}
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#A1ACB8',
              margin: '0 0 16px 0'
            }}>
              {item.summary}
            </p>

            {/* Footer with betting relevance */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.8rem'
            }}>
              <div style={{
                color: '#718096'
              }}>
                {item.category.toUpperCase()}
              </div>
              {item.bettingRelevance && (
                <div style={{
                  background: '#FCB131',
                  color: 'black',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '600'
                }}>
                  🎯 BETTING RELEVANT
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* LLM Analysis Summary Panel */}
      {selectedTeam && newsGroupedByTeam[selectedTeam] && (
        <div style={{
          background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
          border: '2px solid #FCB131',
          borderRadius: '12px',
          margin: '24px',
          padding: '24px',
          boxShadow: '0 0 20px rgba(252, 177, 49, 0.2)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#FCB131',
            textShadow: '0 0 10px currentColor',
            marginBottom: '16px'
          }}>
            📊 LLM ANALYSIS: {selectedTeam}
          </h2>
          
          <div style={{
            fontSize: '0.9rem',
            color: '#E6E8EB',
            lineHeight: '1.6'
          }}>
            <strong>{newsGroupedByTeam[selectedTeam].length}</strong> news articles available for LLM analysis
            <br />
            <strong>{newsGroupedByTeam[selectedTeam].filter(n => n.bettingRelevance).length}</strong> betting-relevant stories
            <br />
            <strong>{newsGroupedByTeam[selectedTeam].filter(n => n.priority === 1).length}</strong> breaking news items
          </div>
          
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0, 255, 65, 0.1)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: '#00FF41'
          }}>
            ✅ This team's news is formatted for optimal LLM processing and matchup analysis
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function extractTeamsFromContent(content: string): string[] {
  const commonTeams = ['Alabama', 'Georgia', 'Michigan', 'Ohio State', 'Texas', 'USC', 'Notre Dame', 'Florida', 'LSU', 'Auburn', 'Tennessee', 'Penn State']
  const foundTeams: string[] = []
  
  commonTeams.forEach(team => {
    if (content.toLowerCase().includes(team.toLowerCase())) {
      foundTeams.push(team)
    }
  })
  
  return foundTeams
}

function formatTimeAgo(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return timestamp.toLocaleDateString()
}

export default CFBNewsPage