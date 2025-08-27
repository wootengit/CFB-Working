'use client'

import React, { useState, useEffect } from 'react'
import { getTeamLogoSvg } from '@/utils/teamLogos'
import { StandingsAdvancedTeam } from '@/types/cfb-api'

const StandingsPage: React.FC = () => {
  const [teams, setTeams] = useState<StandingsAdvancedTeam[]>([])
  const [teamsByConference, setTeamsByConference] = useState<{[key: string]: StandingsAdvancedTeam[]}>({})
  const [selectedConference, setSelectedConference] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(true) // Show MIT research fields by default
  const [sortField, setSortField] = useState<string>('wins')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        console.log('🏆 Starting comprehensive standings fetch - 171+ teams with MIT research fields...')
        
        // Fetch all teams with MIT research data (live CFBD data)
        console.log('🏈 Fetching enhanced standings with MIT research fields...')
        const allTeamsResponse = await fetch('/api/standings/enhanced?year=2024')
        
        console.log('✅ Comprehensive API response status:', allTeamsResponse.status)
        
        const allData = await allTeamsResponse.json()
        
        console.log('🏈 Comprehensive teams loaded:', allData.data?.length, 'teams')
        console.log('🍢 Florida State status:', allData.metadata?.floridaStateStatus || 'checking...')
        
        if (!mounted) {
          console.log('Component unmounted, aborting...')
          return
        }
        
        // Use comprehensive data with MIT research fields (171+ teams with verified logos)
        const allTeams = allData.success ? allData.data : []
        
        // Log comprehensive data for debugging
        if (allData.success && allData.data) {
          console.log('🧠 Comprehensive MIT Research data loaded:', allData.data.length, 'teams')
          console.log('🍢 Florida State included:', allData.data.find((t: any) => t.name === 'Florida State') ? 'YES ✅' : 'NO ❌')
          console.log('🎯 MIT Tier 1 fields available:', allData.metadata?.dataIntegrity?.allFieldsPresent ? 'YES ✅' : 'NO ❌')
          
          // Log conference breakdown
          const conferences = [...new Set(allData.data.map((t: any) => t.conference))];
          console.log('📋 Conferences loaded:', conferences.length, 'total conferences');
          console.log('🏈 Major conferences: SEC, Big Ten, Big 12, ACC, etc.');
        }
        
        if (allTeams.length === 0) {
          console.log('No teams data received')
          return
        }
        
        // Group teams by conference
        const teamsByConference = allTeams.reduce((acc: any, team: StandingsAdvancedTeam) => {
          const conf = team.conference || 'Independent'
          if (!acc[conf]) acc[conf] = []
          acc[conf].push(team)
          return acc
        }, {})
        
        // Sort conferences and teams within each conference
        const sortedTeamsByConf = Object.keys(teamsByConference)
          .sort()
          .reduce((acc: any, conf) => {
            acc[conf] = teamsByConference[conf].sort((a: StandingsAdvancedTeam, b: StandingsAdvancedTeam) => 
              (b.wins || 0) - (a.wins || 0) || (b.winPct || 0) - (a.winPct || 0)
            )
            return acc
          }, {})
        
        console.log('Teams by conference:', Object.keys(sortedTeamsByConf))
        console.log('Processed teams:', allTeams.length)
        console.log('Sample team:', allTeams[0])
        
        if (mounted && allTeams.length > 0) {
          setTeams(allTeams)
          setTeamsByConference(sortedTeamsByConf)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading advanced standings:', error)
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

  // Conference name mapping for proper filtering (updated for unified API)
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
  const filteredTeamsByConference = React.useMemo(() => {
    const filtered: {[key: string]: StandingsAdvancedTeam[]} = {}
    
    Object.entries(teamsByConference).forEach(([conference, confTeams]) => {
      // Filter by conference selection
      if (selectedConference !== 'All') {
        const allowedNames = conferenceMapping[selectedConference] || [selectedConference]
        if (!allowedNames.some(name => 
          conference.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(conference.toLowerCase())
        )) {
          return
        }
      }
      
      // Filter by search term
      const searchFiltered = confTeams.filter(team => 
        team.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.conference.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      if (searchFiltered.length > 0) {
        filtered[conference] = searchFiltered
      }
    })
    
    return filtered
  }, [teamsByConference, selectedConference, searchTerm])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Sort teams within conferences
  const sortedFilteredTeams = React.useMemo(() => {
    const sorted: {[key: string]: StandingsAdvancedTeam[]} = {}
    
    Object.entries(filteredTeamsByConference).forEach(([conference, teams]) => {
      sorted[conference] = [...teams].sort((a, b) => {
        let aVal = (a as any)[sortField]
        let bVal = (b as any)[sortField]
        
        // Handle undefined values
        if (aVal === undefined) aVal = 0
        if (bVal === undefined) bVal = 0
        
        if (sortDirection === 'desc') {
          return bVal - aVal
        } else {
          return aVal - bVal
        }
      })
    })
    
    return sorted
  }, [filteredTeamsByConference, sortField, sortDirection])

  if (loading) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading advanced standings...</div>
  }

  return (
    <div 
      data-standings-root="true"
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
                  // Custom abbreviations for specific conferences
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
            SEC COLLEGE FOOTBALL STANDINGS — MIT RESEARCH FIELDS
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '14px',
            alignItems: 'center' 
          }}>
            <input
              placeholder="Search..."
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
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                height: '36px',
                padding: '0 16px',
                backgroundColor: showAdvanced ? '#2D81FF' : 'transparent',
                border: `1px solid ${showAdvanced ? '#4A9EFF' : '#1C232C'}`,
                borderRadius: '8px',
                color: showAdvanced ? '#FFFFFF' : '#A1ACB8',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🎯 Advanced
            </button>
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
        {showAdvanced && (
          <div style={{
            marginTop: '8px',
            marginBottom: '4px',
            color: '#A1ACB8',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            ← Scroll horizontally to view all MIT research metrics (265+ teams) →
          </div>
        )}

        {/* Advanced Standings Table */}
        <div 
          data-standings-table="true"
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
              minWidth: showAdvanced ? '1200px' : '800px',
              fontSize: '12px'
            }}>
              <thead>
                <tr style={{ 
                  height: '44px', 
                  borderBottom: '1px solid #1C232C',
                  backgroundColor: '#0F131A'
                }}>
                  {/* Basic Columns */}
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
                  
                  <th onClick={() => handleSort('wins')} style={{ 
                    textAlign: 'center', 
                    padding: '0 6px',
                    color: sortField === 'wins' ? '#2D81FF' : '#A1ACB8',
                    fontSize: '11px',
                    fontWeight: '600',
                    lineHeight: '16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    minWidth: '35px'
                  }}>
                    W
                  </th>
                  
                  <th onClick={() => handleSort('losses')} style={{ 
                    textAlign: 'center', 
                    padding: '0 6px',
                    color: sortField === 'losses' ? '#2D81FF' : '#A1ACB8',
                    fontSize: '11px',
                    fontWeight: '600',
                    lineHeight: '16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    minWidth: '35px'
                  }}>
                    L
                  </th>
                  
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '0 8px',
                    color: '#A1ACB8',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '18px'
                  }}>
                    Conf
                  </th>
                  
                  <th onClick={() => handleSort('pointsForPerGame')} style={{ 
                    textAlign: 'center', 
                    padding: '0 8px',
                    color: sortField === 'pointsForPerGame' ? '#2D81FF' : '#A1ACB8',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '18px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}>
                    PF/G
                  </th>
                  
                  <th onClick={() => handleSort('pointsAgainstPerGame')} style={{ 
                    textAlign: 'center', 
                    padding: '0 8px',
                    color: sortField === 'pointsAgainstPerGame' ? '#2D81FF' : '#A1ACB8',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '18px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}>
                    PA/G
                  </th>
                  
                  <th onClick={() => handleSort('avgMargin')} style={{ 
                    textAlign: 'center', 
                    padding: '0 8px',
                    color: sortField === 'avgMargin' ? '#2D81FF' : '#A1ACB8',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '18px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}>
                    Margin
                  </th>

                  {/* Advanced Columns */}
                  {showAdvanced && (
                    <>
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
                      
                      <th onClick={() => handleSort('coverMarginAvg')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'coverMarginAvg' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Cover +/-
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
                        O/U%
                      </th>
                      
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        Fav ATS%
                      </th>
                      
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        Dog ATS%
                      </th>
                      
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        L5 Form
                      </th>
                      
                      <th onClick={() => handleSort('sosRank')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'sosRank' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SoS
                      </th>
                      
                      <th onClick={() => handleSort('spOverallRank')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'spOverallRank' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SP+ Rk
                      </th>
                      
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        Off PPA
                      </th>
                      
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px'
                      }}>
                        Def PPA
                      </th>
                      
                      <th onClick={() => handleSort('spPlusOverall')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'spPlusOverall' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        SP+ Overall
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
                      
                      <th onClick={() => handleSort('efficiency')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'efficiency' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Efficiency
                      </th>
                      
                      <th onClick={() => handleSort('ppaOverall')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'ppaOverall' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        PPA Overall
                      </th>
                      
                      <th onClick={() => handleSort('talentRank')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'talentRank' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Talent
                      </th>
                      
                      {/* MIT Tier 1 Extended Fields */}
                      <th onClick={() => handleSort('secondOrderWins')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'secondOrderWins' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Exp Wins
                      </th>
                      
                      <th onClick={() => handleSort('havocRate')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'havocRate' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Havoc %
                      </th>
                      
                      <th onClick={() => handleSort('finishingRate')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'finishingRate' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Finishing %
                      </th>
                      
                      <th onClick={() => handleSort('fieldPosition')} style={{ 
                        textAlign: 'center', 
                        padding: '0 8px',
                        color: sortField === 'fieldPosition' ? '#2D81FF' : '#A1ACB8',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '18px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        Field Pos
                      </th>
                      
                    </>
                  )}
                </tr>
              </thead>
              
              {/* Team Rows Grouped by Conference */}
              <tbody>
                {Object.entries(sortedFilteredTeams).map(([conference, confTeams], confIndex) => (
                  <React.Fragment key={conference}>
                    {/* Conference Header */}
                    <tr style={{
                      height: '36px',
                      backgroundColor: '#151C24',
                      borderBottom: '1px solid #1C232C'
                    }}>
                      <td colSpan={showAdvanced ? 22 : 8} style={{
                        padding: '0 20px',
                        color: '#E6E8EB',
                        fontSize: '13px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#151C24',
                        zIndex: 1
                      }}>
                        {conference.toUpperCase()}
                      </td>
                    </tr>
                    
                    {/* Conference Teams */}
                    {confTeams.map((team, teamIndex) => (
                      <tr
                        key={team.teamId}
                        data-standings-row="true"
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
                              data-standings-logo="true"
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
                        
                        {/* Basic Stats */}
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: '#D5DAE1',
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '22px'
                        }}>
                          {team.wins}
                        </td>
                        
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: '#D5DAE1',
                          fontSize: '14px',
                          fontWeight: '500',
                          lineHeight: '22px'
                        }}>
                          {team.losses}
                        </td>
                        
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: '#A1ACB8',
                          fontSize: '14px',
                          fontWeight: '500',
                          lineHeight: '22px'
                        }}>
                          {team.conferenceWins}-{team.conferenceLosses}
                        </td>
                        
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: '#D5DAE1',
                          fontSize: '14px',
                          fontWeight: '500',
                          lineHeight: '22px'
                        }}>
                          {team.pointsForPerGame}
                        </td>
                        
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: '#D5DAE1',
                          fontSize: '14px',
                          fontWeight: '500',
                          lineHeight: '22px'
                        }}>
                          {team.pointsAgainstPerGame}
                        </td>
                        
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '0 8px',
                          color: team.avgMargin > 0 ? '#22C55E' : team.avgMargin < 0 ? '#EF4444' : '#A1ACB8',
                          fontSize: '14px',
                          fontWeight: '500',
                          lineHeight: '22px'
                        }}>
                          {team.avgMargin > 0 ? '+' : ''}{team.avgMargin}
                        </td>

                        {/* Advanced Metrics */}
                        {showAdvanced && (
                          <>
                            {/* ATS Percentage with Bar */}
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
                                    backgroundColor: team.atsPercentage >= 60 ? '#22C55E' : team.atsPercentage >= 50 ? '#3B82F6' : '#EF4444',
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
                            
                            {/* Cover Margin */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: team.coverMarginAvg > 0 ? '#22C55E' : team.coverMarginAvg < 0 ? '#EF4444' : '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.coverMarginAvg > 0 ? '+' : ''}{team.coverMarginAvg}
                            </td>
                            
                            {/* O/U Percentage with Bar */}
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
                                    backgroundColor: team.overPercentage >= 60 ? '#F59E0B' : team.overPercentage >= 40 ? '#3B82F6' : '#8B5CF6',
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
                            
                            {/* Favorite ATS% */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.favoriteAtsPercentage}%
                            </td>
                            
                            {/* Dog ATS% */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {team.dogAtsPercentage}%
                            </td>
                            
                            {/* Last 5 Form */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                <span style={{
                                  color: '#D5DAE1',
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}>
                                  {team.last5Wins}-{team.last5Losses}
                                </span>
                                <span style={{
                                  color: team.last5AtsPercentage >= 60 ? '#22C55E' : team.last5AtsPercentage >= 40 ? '#3B82F6' : '#EF4444',
                                  fontSize: '10px',
                                  fontWeight: '500'
                                }}>
                                  {team.last5AtsPercentage}% ATS
                                </span>
                              </div>
                            </td>
                            
                            {/* SoS Rank */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              {(team as any).strengthOfSchedule && (
                                <span style={{
                                  color: '#A1ACB8',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  backgroundColor: '#1C232C',
                                  borderRadius: '4px',
                                  padding: '2px 6px'
                                }}>
                                  {(team as any).strengthOfSchedule.toFixed(1)}
                                </span>
                              )}
                            </td>
                            
                            {/* SP+ Overall Rank */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              {(team as any).spPlusRanking && (
                                <span style={{
                                  color: '#A1ACB8',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  backgroundColor: (team as any).spPlusRanking <= 25 ? '#22C55E' : (team as any).spPlusRanking <= 50 ? '#3B82F6' : '#1C232C',
                                  borderRadius: '4px',
                                  padding: '2px 6px'
                                }}>
                                  #{(team as any).spPlusRanking}
                                </span>
                              )}
                            </td>
                            
                            {/* Offensive PPA */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).offensePPA && (team as any).offensePPA > 0 ? '#22C55E' : '#EF4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).offensePPA ? (team as any).offensePPA.toFixed(2) : '-'}
                            </td>
                            
                            {/* Defensive PPA */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).defensePPA && (team as any).defensePPA < 0 ? '#22C55E' : '#EF4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).defensePPA ? (team as any).defensePPA.toFixed(2) : '-'}
                            </td>
                            
                            {/* SP+ Overall */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).spPlusRating && (team as any).spPlusRating > 0 ? '#22C55E' : '#EF4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).spPlusRating ? (team as any).spPlusRating.toFixed(1) : '-'}
                            </td>
                            
                            {/* Explosiveness */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).explosiveness && (team as any).explosiveness > 1.5 ? '#22C55E' : (team as any).explosiveness > 1.2 ? '#3B82F6' : '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).explosiveness ? (team as any).explosiveness.toFixed(2) : '-'}
                            </td>
                            
                            {/* Efficiency */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).offensiveEfficiency && (team as any).offensiveEfficiency > 0.7 ? '#22C55E' : (team as any).offensiveEfficiency > 0.5 ? '#3B82F6' : '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).offensiveEfficiency ? (team as any).offensiveEfficiency.toFixed(2) : '-'}
                            </td>
                            
                            {/* PPA Overall */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).offensePPA && (team as any).offensePPA > 0 ? '#22C55E' : '#EF4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).offensePPA ? (team as any).offensePPA.toFixed(2) : '-'}
                            </td>
                            
                            {/* Talent Rank */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              lineHeight: '22px'
                            }}>
                              {team.talentRank && (
                                <span style={{
                                  color: '#A1ACB8',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  backgroundColor: team.talentRank <= 10 ? '#F59E0B' : team.talentRank <= 25 ? '#3B82F6' : '#1C232C',
                                  borderRadius: '4px',
                                  padding: '2px 6px'
                                }}>
                                  #{team.talentRank}
                                </span>
                              )}
                            </td>
                            
                            {/* MIT Tier 1 Extended Fields */}
                            {/* Expected Wins */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).secondOrderWins >= team.wins ? '#22C55E' : '#EF4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).secondOrderWins ? (team as any).secondOrderWins.toFixed(1) : '-'}
                            </td>
                            
                            {/* Havoc Rate */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).havocRate > 0.10 ? '#22C55E' : (team as any).havocRate > 0.07 ? '#3B82F6' : '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).havocRate ? ((team as any).havocRate * 100).toFixed(1) + '%' : '-'}
                            </td>
                            
                            {/* Finishing Rate */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).finishingRate > 0.70 ? '#22C55E' : (team as any).finishingRate > 0.55 ? '#3B82F6' : '#A1ACB8',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).finishingRate ? ((team as any).finishingRate * 100).toFixed(0) + '%' : '-'}
                            </td>
                            
                            {/* Field Position */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '0 8px',
                              color: (team as any).fieldPosition > 0 ? '#22C55E' : '#EF4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              lineHeight: '22px'
                            }}>
                              {(team as any).fieldPosition ? ((team as any).fieldPosition > 0 ? '+' : '') + (team as any).fieldPosition.toFixed(1) : '-'}
                            </td>
                            
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
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
              {Object.values(sortedFilteredTeams).flat().length} teams
              {selectedConference !== 'All' && ` (${selectedConference})`}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
            <span>
              🎯 Powered by CFBD API • Updated live
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StandingsPage