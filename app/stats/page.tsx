'use client'

import React, { useState, useEffect } from 'react'

interface TeamStats {
  team: string
  teamId: number
  conference: string
  division: string
  logo: string
  wins: number
  losses: number
  conferenceWins: number
  conferenceLosses: number
  yardsPerGame: number
  rushingYardsPerGame: number
  rushingYardsPerAttempt: number
  passingYardsPerGame: number
  pointsPerGame: number
  qbr: number
  yardsAllowedPerGame: number
  rushingYardsAllowedPerGame: number
  passingYardsAllowedPerGame: number
  pointsAllowedPerGame: number
  sacks: number
  thirdDownPct: number
  thirdDownDefensePct: number
  redZonePct: number
  timeOfPossession: number
  offensePPA: number
  defensePPA: number
  spPlusRating: number
  spPlusRanking: number
  explosiveness: number
  offensiveEfficiency: number
  defensiveEfficiency: number
  atsRecord: string
  atsPercentage: string
  overUnderRecord: string
  overPercentage: string
  favoriteATSPct: string
  dogATSPct: string
}

const StatsPage: React.FC = () => {
  const [teams, setTeams] = useState<TeamStats[]>([])
  const [selectedConference, setSelectedConference] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [statsView, setStatsView] = useState<'offense' | 'defense' | 'betting'>('offense')
  const [sortField, setSortField] = useState<string>('yardsPerGame')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        console.log('🏈 Starting comprehensive team stats fetch...')
        
        // Fetch team stats data
        console.log('📊 Fetching team statistics with offensive, defensive, and betting metrics...')
        const statsResponse = await fetch('/api/team-stats?year=2024')
        
        console.log('✅ Team stats API response status:', statsResponse.status)
        
        const statsData = await statsResponse.json()
        
        console.log('🏈 Team stats loaded:', statsData.data?.length, 'teams')
        
        if (!mounted) {
          console.log('Component unmounted, aborting...')
          return
        }
        
        const allTeams = statsData.success ? statsData.data : []
        
        if (statsData.success && statsData.data) {
          console.log('📊 Comprehensive team stats loaded:', statsData.data.length, 'teams')
          
          // Log conference breakdown
          const conferences = [...new Set(statsData.data.map((t: any) => t.conference))];
          console.log('📋 Conferences loaded:', conferences.length, 'total conferences');
        }
        
        if (allTeams.length === 0) {
          console.log('No teams data received')
          return
        }
        
        // Sort teams by default field (yardsPerGame)
        allTeams.sort((a: TeamStats, b: TeamStats) => b.yardsPerGame - a.yardsPerGame)
        
        console.log('Total teams loaded:', allTeams.length)
        
        if (mounted && allTeams.length > 0) {
          setTeams(allTeams)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading team stats:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      mounted = false
    }
  }, [])

  // Conference name mapping for proper filtering
  const conferenceMapping: {[key: string]: string[]} = {
    'All': [],
    'SEC': ['SEC', 'Southeastern Conference'],
    'Big Ten': ['Big Ten', 'Big Ten Conference'],
    'Big 12': ['Big 12', 'Big 12 Conference'],
    'ACC': ['ACC', 'Atlantic Coast Conference'],
    'Pac-12': ['Pac-12', 'Pac-12 Conference'],
    'American': ['American Athletic', 'AAC', 'American Athletic Conference'],
    'Mountain West': ['Mountain West', 'Mountain West Conference', 'MWC'],
    'MAC': ['MAC', 'Mid-American', 'Mid-American Conference'],
    'Sun Belt': ['Sun Belt', 'Sun Belt Conference', 'SBC'],
    'C-USA': ['C-USA', 'Conference USA', 'CUSA'],
    'Independent': ['Independent', 'FBS Independents'],
    'Big Sky': ['Big Sky', 'Big Sky Conference', 'BSC'],
    'CAA': ['CAA', 'Coastal Athletic', 'Coastal Athletic Association'],
    'MVFC': ['MVFC', 'Missouri Valley Football', 'Missouri Valley Football Conference'],
    'Southern': ['Southern', 'Southern Conference', 'SoCon'],
    'Patriot': ['Patriot', 'Patriot League'],
    'Ivy': ['Ivy', 'Ivy League'],
    'SWAC': ['SWAC', 'Southwestern Athletic', 'Southwestern Athletic Conference']
  }

  // Filter teams based on selected conference and search term
  const filteredTeams = React.useMemo(() => {
    let filtered = [...teams]
    
    // Filter by conference selection
    if (selectedConference !== 'All') {
      const allowedNames = conferenceMapping[selectedConference] || [selectedConference]
      filtered = filtered.filter(team => 
        allowedNames.some(name => 
          team.conference?.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(team.conference?.toLowerCase() || '')
        )
      )
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(team => 
        team.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.conference?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }, [teams, selectedConference, searchTerm])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Sort filtered teams
  const sortedTeams = React.useMemo(() => {
    const sorted = [...filteredTeams].sort((a, b) => {
      let aVal = (a as any)[sortField]
      let bVal = (b as any)[sortField]
      
      // Handle undefined values
      if (aVal === undefined) aVal = 0
      if (bVal === undefined) bVal = 0
      
      // Handle string values (like ATS records)
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        // Try to extract percentage if it's a percentage string
        const aNum = parseFloat(aVal)
        const bNum = parseFloat(bVal)
        if (!isNaN(aNum) && !isNaN(bNum)) {
          aVal = aNum
          bVal = bNum
        } else {
          // Otherwise compare as strings
          return sortDirection === 'desc' 
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal)
        }
      }
      
      if (sortDirection === 'desc') {
        return bVal - aVal
      } else {
        return aVal - bVal
      }
    })
    
    return sorted
  }, [filteredTeams, sortField, sortDirection])

  if (loading) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading team statistics...</div>
  }

  return (
    <div 
      data-stats-root="true"
      style={{
        backgroundColor: '#0B0F15',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        minHeight: '100vh',
        display: 'flex'
      }}
    >
      {/* Sleek Icon Sidebar */}
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
          { code: 'Independent', logo: 'https://logos-world.net/wp-content/uploads/2023/08/NCAA-Logo.png', name: 'Independent Teams', division: 'FBS' },
          
          // FCS Conferences (Division 1 AA)
          { code: 'Big Sky', logo: 'https://upload.wikimedia.org/wikipedia/en/6/68/Big_Sky_Conference_logo.svg', name: 'Big Sky Conference', division: 'FCS' },
          { code: 'CAA', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Colonial_Athletic_Association_logo.svg', name: 'Colonial Athletic', division: 'FCS' },
          { code: 'MVFC', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Missouri_Valley_Football_Conference_logo.svg', name: 'Missouri Valley Football', division: 'FCS' },
          { code: 'Southland', logo: 'https://upload.wikimedia.org/wikipedia/en/7/72/Southland_Conference_logo.svg', name: 'Southland Conference', division: 'FCS' },
          { code: 'WAC', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Western_Athletic_Conference_logo.svg', name: 'Western Athletic', division: 'FCS' },
          { code: 'SOCON', logo: 'https://upload.wikimedia.org/wikipedia/en/4/44/Southern_Conference_logo.svg', name: 'Southern Conference', division: 'FCS' },
          { code: 'Patriot', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Patriot_League_logo.svg', name: 'Patriot League', division: 'FCS' },
          { code: 'Ivy', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Ivy_League_logo.svg', name: 'Ivy League', division: 'FCS' },
          { code: 'MEAC', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a4/MEAC_logo.svg', name: 'Mid-Eastern Athletic', division: 'FCS' },
          { code: 'SWAC', logo: 'https://upload.wikimedia.org/wikipedia/en/4/41/Southwestern_Athletic_Conference_logo.svg', name: 'Southwestern Athletic', division: 'FCS' }
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
                  const customAbbr = {
                    'Mountain West': 'MWC',
                    'American': 'AAC',
                    'Conference USA': 'CUSA',
                    'Sun Belt': 'SBC',
                    'Big Sky': 'BSC',
                    'Missouri Valley Football': 'MVFC',
                    'Coastal Athletic': 'CAA',
                    'Southern Conference': 'SOCON',
                    'Southwestern Athletic': 'SWAC',
                    'Mid-Eastern Athletic': 'MEAC'
                  };
                  
                  fallback.textContent = customAbbr[conf.code] || conf.code.slice(0, 3).toUpperCase();
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
            COLLEGE FOOTBALL TEAM STATISTICS — 2024 SEASON
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '14px',
            alignItems: 'center' 
          }}>
            <input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '300px',
                height: '36px',
                backgroundColor: '#0B0F15',
                border: '1px solid #1C232C',
                borderRadius: '8px',
                padding: '0 12px',
                color: '#E6E8EB',
                fontSize: '14px'
              }}
            />
            
            {/* Stats View Toggle */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => setStatsView('offense')}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: statsView === 'offense' ? '#2D81FF' : 'transparent',
                  border: `1px solid ${statsView === 'offense' ? '#4A9EFF' : '#1C232C'}`,
                  borderRadius: '8px 0 0 8px',
                  color: statsView === 'offense' ? '#FFFFFF' : '#A1ACB8',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Offense
              </button>
              <button 
                onClick={() => setStatsView('defense')}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: statsView === 'defense' ? '#2D81FF' : 'transparent',
                  border: `1px solid ${statsView === 'defense' ? '#4A9EFF' : '#1C232C'}`,
                  borderRadius: '0',
                  borderLeft: 'none',
                  borderRight: 'none',
                  color: statsView === 'defense' ? '#FFFFFF' : '#A1ACB8',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Defense
              </button>
              <button 
                onClick={() => setStatsView('betting')}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: statsView === 'betting' ? '#2D81FF' : 'transparent',
                  border: `1px solid ${statsView === 'betting' ? '#4A9EFF' : '#1C232C'}`,
                  borderRadius: '0 8px 8px 0',
                  color: statsView === 'betting' ? '#FFFFFF' : '#A1ACB8',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Betting
              </button>
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

        {/* Scroll Hint */}
        <div style={{
          marginTop: '8px',
          marginBottom: '4px',
          color: '#A1ACB8',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          ← Scroll horizontally to view all statistics →
        </div>

        {/* Team Stats Table */}
        <div 
          data-stats-table="true"
          style={{
            marginTop: '12px',
            backgroundColor: '#0F131A',
            borderRadius: '12px',
            border: '1px solid #1C232C',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#2D81FF #1C232C',
            WebkitOverflowScrolling: 'touch'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              minWidth: '1200px',
              fontSize: '12px'
            }}>
              <thead>
                <tr style={{ 
                  height: '44px', 
                  borderBottom: '1px solid #1C232C',
                  backgroundColor: '#0F131A'
                }}>
                  {/* Rank Column */}
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '0 12px',
                    color: '#A1ACB8',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '18px',
                    width: '50px'
                  }}>
                    #
                  </th>
                  
                  {/* Team Column */}
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0 20px',
                    color: '#A1ACB8',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '18px',
                    width: '280px',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: '#0F131A',
                    zIndex: 2
                  }}>
                    Team
                  </th>
                  
                  {/* Record */}
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '0 8px',
                    color: '#A1ACB8',
                    fontSize: '11px',
                    fontWeight: '600',
                    lineHeight: '16px',
                    minWidth: '50px'
                  }}>
                    Record
                  </th>

                  {/* Offensive Stats */}
                  {statsView === 'offense' && (
                    <>
                      <th onClick={() => handleSort('yardsPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'yardsPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Yards/G
                      </th>
                      
                      <th onClick={() => handleSort('rushingYardsPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'rushingYardsPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Rush/G
                      </th>
                      
                      <th onClick={() => handleSort('rushingYardsPerAttempt')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'rushingYardsPerAttempt' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Rush/P
                      </th>
                      
                      <th onClick={() => handleSort('passingYardsPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'passingYardsPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Pass/G
                      </th>
                      
                      <th onClick={() => handleSort('pointsPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'pointsPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Pts/G
                      </th>
                      
                      <th onClick={() => handleSort('thirdDownPct')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'thirdDownPct' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        3rd%
                      </th>
                      
                      <th onClick={() => handleSort('redZonePct')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'redZonePct' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        RZ%
                      </th>
                      
                      <th onClick={() => handleSort('timeOfPossession')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'timeOfPossession' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Poss/G
                      </th>
                      
                      <th onClick={() => handleSort('offensePPA')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'offensePPA' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Off PPA
                      </th>
                      
                      <th onClick={() => handleSort('explosiveness')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'explosiveness' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Explosiveness
                      </th>
                      
                      <th onClick={() => handleSort('offensiveEfficiency')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'offensiveEfficiency' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Off Efficiency
                      </th>
                      
                      <th onClick={() => handleSort('spPlusRanking')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'spPlusRanking' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SP+ Rank
                      </th>
                    </>
                  )}

                  {/* Defensive Stats */}
                  {statsView === 'defense' && (
                    <>
                      <th onClick={() => handleSort('yardsAllowedPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'yardsAllowedPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Yards Allowed/G
                      </th>
                      
                      <th onClick={() => handleSort('rushingYardsAllowedPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'rushingYardsAllowedPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Rush Allowed/G
                      </th>
                      
                      <th onClick={() => handleSort('passingYardsAllowedPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'passingYardsAllowedPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Pass Allowed/G
                      </th>
                      
                      <th onClick={() => handleSort('pointsAllowedPerGame')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'pointsAllowedPerGame' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Pts Allowed/G
                      </th>
                      
                      <th onClick={() => handleSort('sacks')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'sacks' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Sacks
                      </th>
                      
                      <th onClick={() => handleSort('thirdDownDefensePct')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'thirdDownDefensePct' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        3rd Down Def%
                      </th>
                      
                      <th onClick={() => handleSort('defensePPA')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'defensePPA' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Def PPA
                      </th>
                      
                      <th onClick={() => handleSort('defensiveEfficiency')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'defensiveEfficiency' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Def Efficiency
                      </th>
                      
                      <th onClick={() => handleSort('spPlusRanking')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'spPlusRanking' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SP+ Rank
                      </th>
                    </>
                  )}

                  {/* Betting Stats */}
                  {statsView === 'betting' && (
                    <>
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        ATS Record
                      </th>
                      
                      <th onClick={() => handleSort('atsPercentage')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'atsPercentage' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        ATS%
                      </th>
                      
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        O/U Record
                      </th>
                      
                      <th onClick={() => handleSort('overPercentage')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'overPercentage' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Over%
                      </th>
                      
                      <th onClick={() => handleSort('favoriteATSPct')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'favoriteATSPct' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Fav ATS%
                      </th>
                      
                      <th onClick={() => handleSort('dogATSPct')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'dogATSPct' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Dog ATS%
                      </th>
                      
                      <th onClick={() => handleSort('spPlusRating')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'spPlusRating' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SP+ Rating
                      </th>
                      
                      <th onClick={() => handleSort('spPlusRanking')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'spPlusRanking' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SP+ Rank
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              
              {/* Team Rows */}
              <tbody>
                {sortedTeams.map((team, teamIndex) => (
                      <tr
                        key={`${team.teamId}-${team.team}`}
                        data-stats-row="true"
                        style={{
                          height: '56px',
                          borderBottom: '1px solid #141A21',
                          backgroundColor: teamIndex % 2 === 0 ? '#0F131A' : '#0B0F15'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0E131A'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = teamIndex % 2 === 0 ? '#0F131A' : '#0B0F15'
                        }}
                      >
                        {/* Rank Cell */}
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 12px',
                          color: '#A1ACB8',
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '22px'
                        }}>
                          {teamIndex + 1}
                        </td>
                        
                        {/* Team Cell */}
                        <td style={{ 
                          padding: '0 20px',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: teamIndex % 2 === 0 ? '#0F131A' : '#0B0F15',
                          zIndex: 1
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={team.logo}
                              alt={team.team}
                              style={{
                                width: '30px',
                                height: 'auto',
                                maxWidth: '36px',
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
                              }}
                            />
                            <a 
                              href={`/team/${encodeURIComponent(team.team)}`}
                              style={{
                                color: '#E6E8EB',
                                fontSize: '15px',
                                fontWeight: '600',
                                lineHeight: '22px',
                                textDecoration: 'none',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#2D81FF'
                                e.currentTarget.style.textDecoration = 'underline'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#E6E8EB'
                                e.currentTarget.style.textDecoration = 'none'
                              }}
                            >
                              {team.team}
                            </a>
                          </div>
                        </td>
                        
                        {/* Record */}
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: '#A1ACB8',
                          fontSize: '13px',
                          fontWeight: '500',
                          lineHeight: '22px'
                        }}>
                          {team.wins}-{team.losses}
                        </td>

                        {/* Offensive Stats */}
                        {statsView === 'offense' && (
                          <>
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#D5DAE1',
                              fontSize: '14px',
                              fontWeight: '600',
                              lineHeight: '22px'
                            }}>
                              {team.yardsPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#D5DAE1',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.rushingYardsPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#D5DAE1',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.rushingYardsPerAttempt.toFixed(2)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#D5DAE1',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.passingYardsPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#22C55E',
                              fontSize: '14px',
                              fontWeight: '600',
                              lineHeight: '22px'
                            }}>
                              {team.pointsPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.thirdDownPct > 40 ? '#22C55E' : team.thirdDownPct > 35 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.thirdDownPct.toFixed(1)}%
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.redZonePct > 85 ? '#22C55E' : team.redZonePct > 75 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.redZonePct.toFixed(1)}%
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#A1ACB8',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.timeOfPossession.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.offensePPA > 0 ? '#22C55E' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.offensePPA.toFixed(2)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.explosiveness > 1.5 ? '#22C55E' : team.explosiveness > 1.2 ? '#3B82F6' : '#A1ACB8',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.explosiveness.toFixed(2)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.offensiveEfficiency > 0.7 ? '#22C55E' : team.offensiveEfficiency > 0.5 ? '#3B82F6' : '#A1ACB8',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.offensiveEfficiency.toFixed(2)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              <span style={{
                                color: '#A1ACB8',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: team.spPlusRanking <= 25 ? '#22C55E' : team.spPlusRanking <= 50 ? '#3B82F6' : '#1C232C',
                                borderRadius: '4px',
                                padding: '2px 6px'
                              }}>
                                #{team.spPlusRanking}
                              </span>
                            </td>
                          </>
                        )}

                        {/* Defensive Stats */}
                        {statsView === 'defense' && (
                          <>
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.yardsAllowedPerGame < 300 ? '#22C55E' : team.yardsAllowedPerGame < 400 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.yardsAllowedPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.rushingYardsAllowedPerGame < 100 ? '#22C55E' : team.rushingYardsAllowedPerGame < 150 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.rushingYardsAllowedPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.passingYardsAllowedPerGame < 200 ? '#22C55E' : team.passingYardsAllowedPerGame < 250 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.passingYardsAllowedPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.pointsAllowedPerGame < 20 ? '#22C55E' : team.pointsAllowedPerGame < 30 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '600',
                              lineHeight: '22px'
                            }}>
                              {team.pointsAllowedPerGame.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.sacks > 30 ? '#22C55E' : team.sacks > 20 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '600',
                              lineHeight: '22px'
                            }}>
                              {team.sacks}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.thirdDownDefensePct < 35 ? '#22C55E' : team.thirdDownDefensePct < 40 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.thirdDownDefensePct.toFixed(1)}%
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.defensePPA < 0 ? '#22C55E' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.defensePPA.toFixed(2)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.defensiveEfficiency < 0.5 ? '#22C55E' : team.defensiveEfficiency < 0.7 ? '#3B82F6' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.defensiveEfficiency.toFixed(2)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              <span style={{
                                color: '#A1ACB8',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: team.spPlusRanking <= 25 ? '#22C55E' : team.spPlusRanking <= 50 ? '#3B82F6' : '#1C232C',
                                borderRadius: '4px',
                                padding: '2px 6px'
                              }}>
                                #{team.spPlusRanking}
                              </span>
                            </td>
                          </>
                        )}

                        {/* Betting Stats */}
                        {statsView === 'betting' && (
                          <>
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#D5DAE1',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.atsRecord}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                                <div style={{
                                  width: '40px',
                                  height: '4px',
                                  backgroundColor: '#1C232C',
                                  borderRadius: '2px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    width: `${team.atsPercentage}%`,
                                    height: '100%',
                                    backgroundColor: parseFloat(team.atsPercentage) >= 60 ? '#22C55E' : parseFloat(team.atsPercentage) >= 50 ? '#3B82F6' : '#EF4444',
                                    borderRadius: '2px'
                                  }} />
                                </div>
                                <span style={{
                                  color: '#D5DAE1',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  minWidth: '30px'
                                }}>
                                  {team.atsPercentage}%
                                </span>
                              </div>
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#D5DAE1',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.overUnderRecord}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                                <div style={{
                                  width: '40px',
                                  height: '4px',
                                  backgroundColor: '#1C232C',
                                  borderRadius: '2px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    width: `${team.overPercentage}%`,
                                    height: '100%',
                                    backgroundColor: parseFloat(team.overPercentage) >= 60 ? '#F59E0B' : parseFloat(team.overPercentage) >= 40 ? '#3B82F6' : '#8B5CF6',
                                    borderRadius: '2px'
                                  }} />
                                </div>
                                <span style={{
                                  color: '#D5DAE1',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  minWidth: '30px'
                                }}>
                                  {team.overPercentage}%
                                </span>
                              </div>
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: parseFloat(team.favoriteATSPct) >= 55 ? '#22C55E' : parseFloat(team.favoriteATSPct) >= 45 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.favoriteATSPct}%
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: parseFloat(team.dogATSPct) >= 55 ? '#22C55E' : parseFloat(team.dogATSPct) >= 45 ? '#D5DAE1' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.dogATSPct}%
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.spPlusRating > 0 ? '#22C55E' : '#EF4444',
                              fontSize: '14px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.spPlusRating.toFixed(1)}
                            </td>
                            
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              <span style={{
                                color: '#A1ACB8',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: team.spPlusRanking <= 25 ? '#22C55E' : team.spPlusRanking <= 50 ? '#3B82F6' : '#1C232C',
                                borderRadius: '4px',
                                padding: '2px 6px'
                              }}>
                                #{team.spPlusRanking}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            borderTop: '1px solid #1C232C',
            color: '#A1ACB8',
            fontSize: '12px'
          }}>
            <span>
              Showing {sortedTeams.length} teams
              {selectedConference !== 'All' && ` (${selectedConference})`}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
            <span>
              📊 Powered by CFBD API • 2024 Season Stats
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage