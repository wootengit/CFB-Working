'use client'

import React, { useState, useEffect } from 'react'
import { EnhancedTeamData, SEC_TEAMS } from '@/types/cfb-api'

interface SECStandingsProps {
  year?: number
  showAllTeams?: boolean
}

const SECStandingsEnhanced: React.FC<SECStandingsProps> = ({ 
  year = 2024, 
  showAllTeams = false 
}) => {
  const [teams, setTeams] = useState<EnhancedTeamData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>('spPlusRating')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'tier1' | 'efficiency'>('tier1')

  useEffect(() => {
    fetchEnhancedStandings()
  }, [year, showAllTeams])

  const fetchEnhancedStandings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🏈 Fetching enhanced standings with MIT research fields...')
      
      const params = new URLSearchParams({
        year: year.toString(),
        sec: showAllTeams ? 'false' : 'true'
      })
      
      const response = await fetch(`/api/standings/enhanced?${params}`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch enhanced standings')
      }
      
      console.log(`✅ Loaded ${data.data.length} teams with predictive fields`)
      setTeams(data.data)
      
    } catch (err) {
      console.error('Error fetching enhanced standings:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => {
      let aVal = (a as any)[sortField] ?? 0
      let bVal = (b as any)[sortField] ?? 0
      
      if (sortDirection === 'desc') {
        return bVal - aVal
      } else {
        return aVal - bVal
      }
    })
  }, [teams, sortField, sortDirection])

  const getMetricColor = (value: number, field: string): string => {
    if (field === 'spPlusRating') {
      if (value > 15) return '#22C55E' // Green for top tier
      if (value > 5) return '#3B82F6'  // Blue for good
      if (value > -5) return '#F59E0B' // Yellow for average
      return '#EF4444'                 // Red for poor
    }
    
    if (field === 'explosiveness') {
      if (value > 1.5) return '#22C55E'
      if (value > 1.0) return '#3B82F6'
      if (value > 0.5) return '#F59E0B'
      return '#EF4444'
    }
    
    if (field === 'offensePPA' || field === 'defensePPA') {
      if (Math.abs(value) > 0.5) return '#22C55E'
      if (Math.abs(value) > 0.25) return '#3B82F6'
      if (Math.abs(value) > 0.1) return '#F59E0B'
      return '#EF4444'
    }
    
    return '#A1ACB8'
  }

  const formatValue = (value: number, decimals: number = 1): string => {
    if (value === 0) return '0'
    return value.toFixed(decimals)
  }

  const getTeamLogo = (team: EnhancedTeamData): string => {
    if (team.logo) return team.logo
    
    // SEC team logo fallbacks
    const secLogos: { [key: string]: string } = {
      'Alabama': 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
      'Georgia': 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png', 
      'Tennessee': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png',
      'LSU': 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
      'Auburn': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png',
      'Florida': 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
      'Kentucky': 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png',
      'Mississippi State': 'https://a.espncdn.com/i/teamlogos/ncaa/500/344.png',
      'Missouri': 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png',
      'Ole Miss': 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png',
      'South Carolina': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png',
      'Texas A&M': 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png',
      'Arkansas': 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png',
      'Vanderbilt': 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png'
    }
    
    return secLogos[team.team] || 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading MIT research predictive fields...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0F15] min-h-screen font-['Inter'] text-white">
      
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            {showAllTeams ? 'Enhanced College Football Standings' : 'SEC Enhanced Standings'}
          </h1>
          <p className="text-gray-400 mb-4">
            Powered by MIT Research - Tier 1 Predictive Fields with 72-86% Win Correlation
          </p>
          
          {/* Metric Filter */}
          <div className="flex gap-3">
            {[
              { key: 'tier1', label: '🎯 Tier 1 Fields', desc: 'SP+, Explosiveness, PPA' },
              { key: 'efficiency', label: '⚡ Efficiency', desc: 'Offensive & Defensive' },
              { key: 'all', label: '📊 All Metrics', desc: 'Complete Dataset' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedMetric(filter.key as any)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedMetric === filter.key
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Accuracy Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-200">SP+ Rating: 79% Average Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-200">Explosiveness: 86% Win Rate When Superior</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-purple-200">PPA: Neural Network Predictions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Standings Table */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0F131A] rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#151C24] border-b border-gray-800">
                    <th className="text-left p-4 font-semibold text-gray-300 sticky left-0 bg-[#151C24] z-10">
                      Team
                    </th>
                    
                    <th className="text-center p-4 font-semibold text-gray-300 min-w-[60px]">
                      Record
                    </th>
                    
                    {/* MIT Research Tier 1 Fields */}
                    {(selectedMetric === 'tier1' || selectedMetric === 'all') && (
                      <>
                        <th 
                          onClick={() => handleSort('spPlusRating')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-green-400 min-w-[100px]"
                          title="SP+ Rating - Primary predictor with 72-86% correlation"
                        >
                          SP+ Rating ⭐
                          {sortField === 'spPlusRating' && (
                            <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </th>
                        
                        <th 
                          onClick={() => handleSort('explosiveness')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 min-w-[120px]"
                          title="Explosiveness - 86% win rate when superior"
                        >
                          Explosiveness ⚡
                          {sortField === 'explosiveness' && (
                            <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </th>
                        
                        <th 
                          onClick={() => handleSort('offensePPA')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-purple-400 min-w-[100px]"
                          title="Offensive PPA - Neural network predictions"
                        >
                          Off PPA 🧠
                          {sortField === 'offensePPA' && (
                            <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </th>
                        
                        <th 
                          onClick={() => handleSort('defensePPA')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-purple-400 min-w-[100px]"
                          title="Defensive PPA - Neural network predictions"
                        >
                          Def PPA 🛡️
                          {sortField === 'defensePPA' && (
                            <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </th>
                      </>
                    )}
                    
                    {/* Efficiency Metrics */}
                    {(selectedMetric === 'efficiency' || selectedMetric === 'all') && (
                      <>
                        <th 
                          onClick={() => handleSort('offensiveEfficiency')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-orange-400 min-w-[120px]"
                          title="Offensive Efficiency Rating"
                        >
                          Off Efficiency
                          {sortField === 'offensiveEfficiency' && (
                            <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </th>
                        
                        <th 
                          onClick={() => handleSort('defensiveEfficiency')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-orange-400 min-w-[120px]"
                          title="Defensive Efficiency Rating"
                        >
                          Def Efficiency
                          {sortField === 'defensiveEfficiency' && (
                            <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </th>
                      </>
                    )}
                    
                    {/* Additional Metrics for 'all' view */}
                    {selectedMetric === 'all' && (
                      <>
                        <th 
                          onClick={() => handleSort('spPlusRanking')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-yellow-400 min-w-[100px]"
                        >
                          SP+ Rank
                        </th>
                        
                        <th 
                          onClick={() => handleSort('strengthOfSchedule')}
                          className="text-center p-4 font-semibold text-gray-300 cursor-pointer hover:text-red-400 min-w-[80px]"
                        >
                          SOS
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                
                <tbody>
                  {sortedTeams.map((team, index) => (
                    <tr 
                      key={team.teamId}
                      className={`border-b border-gray-800 hover:bg-[#1A1F27] transition-colors ${
                        index % 2 === 0 ? 'bg-[#0F131A]' : 'bg-[#0B0F15]'
                      }`}
                    >
                      {/* Team Cell */}
                      <td className="p-4 sticky left-0 bg-inherit z-10">
                        <div className="flex items-center gap-3">
                          <img
                            src={getTeamLogo(team)}
                            alt={team.team}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
                            }}
                          />
                          <div>
                            <div className="text-white font-semibold">{team.team}</div>
                            <div className="text-xs text-gray-400">{team.conference}</div>
                          </div>
                          {SEC_TEAMS.includes(team.team as any) && (
                            <div className="px-2 py-1 bg-orange-600 text-white text-xs rounded font-bold">
                              SEC
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Record */}
                      <td className="p-4 text-center">
                        <div className="text-white font-semibold">
                          {team.wins}-{team.losses}
                        </div>
                        <div className="text-xs text-gray-400">
                          {team.conferenceWins}-{team.conferenceLosses} conf
                        </div>
                      </td>
                      
                      {/* MIT Research Tier 1 Fields */}
                      {(selectedMetric === 'tier1' || selectedMetric === 'all') && (
                        <>
                          {/* SP+ Rating */}
                          <td className="p-4 text-center">
                            <div 
                              className="text-lg font-bold"
                              style={{ color: getMetricColor(team.spPlusRating, 'spPlusRating') }}
                            >
                              {formatValue(team.spPlusRating, 1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{team.spPlusRanking}
                            </div>
                          </td>
                          
                          {/* Explosiveness */}
                          <td className="p-4 text-center">
                            <div 
                              className="text-lg font-bold"
                              style={{ color: getMetricColor(team.explosiveness, 'explosiveness') }}
                            >
                              {formatValue(team.explosiveness, 2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              big plays
                            </div>
                          </td>
                          
                          {/* Offensive PPA */}
                          <td className="p-4 text-center">
                            <div 
                              className="text-lg font-bold"
                              style={{ color: getMetricColor(team.offensePPA, 'offensePPA') }}
                            >
                              {formatValue(team.offensePPA, 3)}
                            </div>
                            <div className="text-xs text-gray-500">
                              per play
                            </div>
                          </td>
                          
                          {/* Defensive PPA */}
                          <td className="p-4 text-center">
                            <div 
                              className="text-lg font-bold"
                              style={{ color: getMetricColor(team.defensePPA, 'defensePPA') }}
                            >
                              {formatValue(team.defensePPA, 3)}
                            </div>
                            <div className="text-xs text-gray-500">
                              allowed
                            </div>
                          </td>
                        </>
                      )}
                      
                      {/* Efficiency Metrics */}
                      {(selectedMetric === 'efficiency' || selectedMetric === 'all') && (
                        <>
                          <td className="p-4 text-center">
                            <div className="text-lg font-bold text-orange-400">
                              {formatValue(team.offensiveEfficiency, 2)}
                            </div>
                          </td>
                          
                          <td className="p-4 text-center">
                            <div className="text-lg font-bold text-orange-400">
                              {formatValue(team.defensiveEfficiency, 2)}
                            </div>
                          </td>
                        </>
                      )}
                      
                      {/* Additional Metrics */}
                      {selectedMetric === 'all' && (
                        <>
                          <td className="p-4 text-center text-yellow-400">
                            #{team.spPlusRanking}
                          </td>
                          
                          <td className="p-4 text-center text-red-400">
                            {formatValue(team.strengthOfSchedule, 2)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>
              🎯 Enhanced with MIT Research Findings • 
              SP+ Primary Predictor (72-86% correlation) • 
              Explosiveness (86% win rate when superior) • 
              Neural Network PPA Predictions
            </p>
            <p className="mt-2">
              Displaying {sortedTeams.length} teams • 
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SECStandingsEnhanced