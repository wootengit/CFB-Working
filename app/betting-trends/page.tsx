'use client'

import React, { useState, useEffect } from 'react'

interface TrendCategory {
  wins?: number
  losses?: number
  ties?: number
  pushes?: number
  percentage: number
  overs?: number
  unders?: number
  overPercentage?: number
  underPercentage?: number
  games?: number
  favWins?: number
  dogWins?: number
  favPercentage?: number
  dogPercentage?: number
}

interface BettingTrends {
  straightUp: {
    awayTeams: TrendCategory
    homeTeams: TrendCategory  
    favorites: TrendCategory
    dogs: TrendCategory
    awayFavorites: TrendCategory
    awayDogs: TrendCategory
    homeFavorites: TrendCategory
    homeDogs: TrendCategory
  }
  againstTheSpread: {
    awayTeams: TrendCategory
    homeTeams: TrendCategory
    favorites: TrendCategory
    dogs: TrendCategory
    awayFavorites: TrendCategory
    awayDogs: TrendCategory
    homeFavorites: TrendCategory
    homeDogs: TrendCategory
  }
  overUnder: {
    overtimeGames: TrendCategory
    nonOvertimeGames: TrendCategory
    allGames: TrendCategory
  }
  spreadRanges: {
    small: TrendCategory
    medium: TrendCategory
    large: TrendCategory
    huge: TrendCategory
  }
  situational: {
    ranked: TrendCategory
    primetime: TrendCategory
    rivalry: TrendCategory
    blowouts: TrendCategory
  }
}

interface TrendsResponse {
  success: boolean
  year: number
  conference: string
  totalGames: number
  trends: BettingTrends
  meta: {
    processingTimeMs: number
    timestamp: string
    dataSource: string
  }
}

const BettingTrendsPage: React.FC = () => {
  const [trends, setTrends] = useState<BettingTrends | null>(null)
  const [selectedConference, setSelectedConference] = useState<string>('All')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [loading, setLoading] = useState(true)
  const [totalGames, setTotalGames] = useState(0)
  const [processingTime, setProcessingTime] = useState(0)

  useEffect(() => {
    let mounted = true
    
    const fetchTrends = async () => {
      setLoading(true)
      try {
        console.log(`📊 Fetching betting trends: ${selectedYear} ${selectedConference}`)
        
        const response = await fetch(`/api/betting-trends?year=${selectedYear}&conference=${selectedConference}`)
        const data: TrendsResponse = await response.json()
        
        if (!mounted) return
        
        if (data.success) {
          setTrends(data.trends)
          setTotalGames(data.totalGames)
          setProcessingTime(data.meta.processingTimeMs)
          console.log(`✅ Loaded betting trends: ${data.totalGames} games processed`)
        } else {
          console.error('Failed to fetch betting trends:', data)
        }
      } catch (error) {
        console.error('Error fetching betting trends:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    fetchTrends()
    
    return () => {
      mounted = false
    }
  }, [selectedConference, selectedYear])

  const formatRecord = (category: TrendCategory) => {
    if (category.wins !== undefined && category.losses !== undefined) {
      return `${category.wins}-${category.losses}-${category.ties || category.pushes || 0}`
    }
    return '0-0-0'
  }

  const formatOverUnderRecord = (category: TrendCategory) => {
    const overs = category.overs || 0
    const unders = category.unders || 0
    const pushes = category.pushes || 0
    return { overs, unders, pushes }
  }

  if (loading) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading betting trends...</div>
  }

  return (
    <div 
      data-trends-root="true"
      style={{
        backgroundColor: '#0B0F15',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        minHeight: '100vh',
        display: 'flex'
      }}
    >
      {/* Sleek Icon Sidebar - Identical to standings */}
      <div 
        data-id="icon-sidebar"
        style={{
          position: 'fixed',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          backgroundColor: '#0F131A',
          borderRadius: '12px',
          border: '1px solid #1C232C',
          padding: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 1000
        }}
      >
        {[
          // FBS Conferences
          { code: 'All', logo: 'https://logos-world.net/wp-content/uploads/2023/08/NCAA-Logo.png', name: 'All Teams', division: 'ALL' },
          { code: 'SEC', logo: 'https://logos-world.net/wp-content/uploads/2022/02/SEC-Logo.png', name: 'SEC Conference', division: 'FBS' },
          { code: 'ACC', logo: 'https://1000logos.net/wp-content/uploads/2023/04/ACC-logo.png', name: 'ACC Conference', division: 'FBS' },
          { code: 'Big Ten', logo: 'https://1000logos.net/wp-content/uploads/2023/05/Big-Ten-logo.png', name: 'Big Ten Conference', division: 'FBS' },
          { code: 'Big 12', logo: 'https://1000logos.net/wp-content/uploads/2023/05/Big-12-logo.png', name: 'Big 12 Conference', division: 'FBS' },
          { code: 'American', logo: 'https://upload.wikimedia.org/wikipedia/en/0/02/American_Athletic_Conference_logo.svg', name: 'American Athletic', division: 'FBS' },
          { code: 'Mountain West', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Mountain_West_Conference_logo.svg', name: 'Mountain West', division: 'FBS' },
          { code: 'MAC', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/MAC_logo.png', name: 'MAC Conference', division: 'FBS' },
          { code: 'Sun Belt', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Sun_Belt_Conference_logo.svg', name: 'Sun Belt Conference', division: 'FBS' },
          { code: 'C-USA', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Conference_USA_logo.svg', name: 'Conference USA', division: 'FBS' },
          { code: 'PAC-12', logo: 'https://1000logos.net/wp-content/uploads/2023/05/Pac-12-logo.png', name: 'Pac-12 Conference', division: 'FBS' },
          { code: 'Independent', logo: 'https://logos-world.net/wp-content/uploads/2023/08/NCAA-Logo.png', name: 'Independent Teams', division: 'FBS' }
        ].map((conf) => (
          <div
            key={conf.code}
            onClick={() => setSelectedConference(conf.code)}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: conf.code === selectedConference ? '#2D81FF' : 'transparent',
              border: conf.code === selectedConference ? '1px solid #4A9EFF' : '1px solid transparent',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: conf.code === selectedConference ? '0 4px 12px rgba(45,129,255,0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (conf.code !== selectedConference) {
                e.currentTarget.style.backgroundColor = '#1A2332'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
              if (tooltip) {
                tooltip.style.visibility = 'visible'
                tooltip.style.opacity = '1'
              }
            }}
            onMouseLeave={(e) => {
              if (conf.code !== selectedConference) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
              }
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
              if (tooltip) {
                tooltip.style.visibility = 'hidden'
                tooltip.style.opacity = '0'
              }
            }}
          >
            <img 
              src={conf.logo} 
              alt={conf.name}
              style={{ 
                width: '28px', 
                height: '28px', 
                objectFit: 'contain',
                filter: conf.code === selectedConference ? 'none' : 'brightness(0.8) saturate(0.9)',
                display: 'block'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-text')) {
                  const fallback = document.createElement('span');
                  fallback.className = 'fallback-text';
                  fallback.textContent = conf.code.slice(0, 3).toUpperCase();
                  fallback.style.cssText = `
                    font-size: 10px;
                    font-weight: 700;
                    color: ${conf.code === selectedConference ? '#fff' : '#A1ACB8'};
                    text-align: center;
                    line-height: 1;
                  `;
                  parent.appendChild(fallback);
                }
              }}
            />
            
            <div
              className="tooltip"
              style={{
                position: 'absolute',
                left: '52px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#1A2332',
                border: '1px solid #2A3441',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#E6E8EB',
                fontSize: '12px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                visibility: 'hidden',
                opacity: '0',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                zIndex: 1001,
                pointerEvents: 'none'
              }}
            >
              {conf.name}
              <div
                style={{
                  position: 'absolute',
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRight: '4px solid #1A2332'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, margin: '24px 24px 32px 72px' }}>
        {/* Header */}
        <div style={{ marginBottom: '14px' }}>
          <h1 style={{
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: '600',
            color: '#E6E8EB',
            letterSpacing: '-0.2px',
            margin: 0
          }}>
            COLLEGE FOOTBALL BETTING TRENDS — SEASON TO DATE
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '14px',
            alignItems: 'center' 
          }}>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                height: '36px',
                backgroundColor: '#0B0F15',
                border: '1px solid #1C232C',
                borderRadius: '8px',
                padding: '0 12px',
                color: '#E6E8EB',
                fontSize: '14px'
              }}
            >
              <option value="2024">2024 Season</option>
              <option value="2023">2023 Season</option>
              <option value="2022">2022 Season</option>
            </select>
            
            <div style={{
              height: '36px',
              padding: '0 16px',
              backgroundColor: '#0F131A',
              border: '1px solid #1C232C',
              borderRadius: '8px',
              color: '#A1ACB8',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 {totalGames} games • Processed in {processingTime}ms
            </div>

            <button style={{
              height: '36px',
              padding: '0 16px',
              backgroundColor: '#2D81FF',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Export CSV
            </button>
          </div>
        </div>

        {trends && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Straight Up Trends */}
            <div style={{
              backgroundColor: '#0F131A',
              borderRadius: '12px',
              border: '1px solid #1C232C',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1C232C',
                backgroundColor: '#0F131A'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#E6E8EB',
                  margin: 0
                }}>
                  Straight Up Trends (Win/Loss)
                </h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ height: '44px', backgroundColor: '#0F131A', borderBottom: '1px solid #1C232C' }}>
                      <th style={{ textAlign: 'left', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Category
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Record
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Percent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(trends.straightUp).map(([key, data], index) => (
                      <tr key={key} style={{
                        height: '44px',
                        borderBottom: '1px solid #141A21',
                        backgroundColor: index % 2 === 0 ? '#0F131A' : '#0B0F15'
                      }}>
                        <td style={{ padding: '0 20px', color: '#E6E8EB', fontSize: '14px', fontWeight: '500' }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0 20px', color: '#D5DAE1', fontSize: '14px', fontWeight: '500' }}>
                          {formatRecord(data)}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', fontWeight: '600' }}>
                          <span style={{
                            color: data.percentage >= 60 ? '#22C55E' : data.percentage >= 50 ? '#3B82F6' : '#EF4444',
                            backgroundColor: data.percentage >= 60 ? 'rgba(34, 197, 94, 0.1)' : 
                                           data.percentage >= 50 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {data.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Against The Spread Trends */}
            <div style={{
              backgroundColor: '#0F131A',
              borderRadius: '12px',
              border: '1px solid #1C232C',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1C232C',
                backgroundColor: '#0F131A'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#E6E8EB',
                  margin: 0
                }}>
                  Against The Spread Trends (ATS)
                </h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ height: '44px', backgroundColor: '#0F131A', borderBottom: '1px solid #1C232C' }}>
                      <th style={{ textAlign: 'left', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Category
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Record
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Percent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(trends.againstTheSpread).map(([key, data], index) => (
                      <tr key={key} style={{
                        height: '44px',
                        borderBottom: '1px solid #141A21',
                        backgroundColor: index % 2 === 0 ? '#0F131A' : '#0B0F15'
                      }}>
                        <td style={{ padding: '0 20px', color: '#E6E8EB', fontSize: '14px', fontWeight: '500' }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0 20px', color: '#D5DAE1', fontSize: '14px', fontWeight: '500' }}>
                          {formatRecord(data)}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', fontWeight: '600' }}>
                          <span style={{
                            color: data.percentage >= 55 ? '#22C55E' : data.percentage >= 48 ? '#3B82F6' : '#EF4444',
                            backgroundColor: data.percentage >= 55 ? 'rgba(34, 197, 94, 0.1)' : 
                                           data.percentage >= 48 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {data.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Over VS. Under Trends */}
            <div style={{
              backgroundColor: '#0F131A',
              borderRadius: '12px',
              border: '1px solid #1C232C',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1C232C',
                backgroundColor: '#0F131A'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#E6E8EB',
                  margin: 0
                }}>
                  Over VS. Under Trends
                </h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ height: '44px', backgroundColor: '#0F131A', borderBottom: '1px solid #1C232C' }}>
                      <th style={{ textAlign: 'left', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Category
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Overs
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Percent
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Unders
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Percent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(trends.overUnder).map(([key, data], index) => {
                      const record = formatOverUnderRecord(data)
                      return (
                        <tr key={key} style={{
                          height: '44px',
                          borderBottom: '1px solid #141A21',
                          backgroundColor: index % 2 === 0 ? '#0F131A' : '#0B0F15'
                        }}>
                          <td style={{ padding: '0 20px', color: '#E6E8EB', fontSize: '14px', fontWeight: '500' }}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', color: '#D5DAE1', fontSize: '14px', fontWeight: '500' }}>
                            {record.overs}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{
                              color: (data.overPercentage || 0) >= 55 ? '#F59E0B' : '#3B82F6',
                              backgroundColor: (data.overPercentage || 0) >= 55 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              {data.overPercentage || 0}%
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', color: '#D5DAE1', fontSize: '14px', fontWeight: '500' }}>
                            {record.unders}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{
                              color: (data.underPercentage || 0) >= 55 ? '#8B5CF6' : '#3B82F6',
                              backgroundColor: (data.underPercentage || 0) >= 55 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              {data.underPercentage || 0}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Spread Range Analysis - Enhanced Feature */}
            <div style={{
              backgroundColor: '#0F131A',
              borderRadius: '12px',
              border: '1px solid #1C232C',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1C232C',
                backgroundColor: '#0F131A'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#E6E8EB',
                  margin: 0
                }}>
                  Spread Range Analysis
                </h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ height: '44px', backgroundColor: '#0F131A', borderBottom: '1px solid #1C232C' }}>
                      <th style={{ textAlign: 'left', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Spread Range
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Games
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Fav %
                      </th>
                      <th style={{ textAlign: 'center', padding: '0 20px', color: '#A1ACB8', fontSize: '12px', fontWeight: '600' }}>
                        Dog %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(trends.spreadRanges).map(([key, data], index) => {
                      const rangeLabels = {
                        small: '0-3 Points',
                        medium: '3.5-7 Points', 
                        large: '7.5-14 Points',
                        huge: '14.5+ Points'
                      }
                      return (
                        <tr key={key} style={{
                          height: '44px',
                          borderBottom: '1px solid #141A21',
                          backgroundColor: index % 2 === 0 ? '#0F131A' : '#0B0F15'
                        }}>
                          <td style={{ padding: '0 20px', color: '#E6E8EB', fontSize: '14px', fontWeight: '500' }}>
                            {rangeLabels[key as keyof typeof rangeLabels]}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', color: '#D5DAE1', fontSize: '14px', fontWeight: '500' }}>
                            {data.games || 0}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{
                              color: (data.favPercentage || 0) >= 55 ? '#22C55E' : '#EF4444',
                              backgroundColor: (data.favPercentage || 0) >= 55 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              {data.favPercentage || 0}%
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{
                              color: (data.dogPercentage || 0) >= 45 ? '#22C55E' : '#EF4444',
                              backgroundColor: (data.dogPercentage || 0) >= 45 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              {data.dogPercentage || 0}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BettingTrendsPage