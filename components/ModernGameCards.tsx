/**
 * 🏈 Modern Game Cards Container - React 19 Best Practices
 * Server-side data with compound components and performance optimization
 */
'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGameData } from '@/hooks/useGameData'
import GameCard from '@/components/ui/game-card'
import { 
  RefreshCw,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface ModernGameCardsProps {
  initialWeek?: number
  initialSeason?: number
  autoRefresh?: boolean
  className?: string
}

const ModernGameCards: React.FC<ModernGameCardsProps> = ({
  initialWeek = 1,
  initialSeason = new Date().getFullYear(),
  autoRefresh = false,
  className = ""
}) => {
  const [selectedWeek, setSelectedWeek] = useState(initialWeek)
  const [selectedSeason] = useState(initialSeason)
  const [searchTerm, setSearchTerm] = useState('')

  const { games, loading, error, refresh, filteredGames } = useGameData(selectedWeek)

  // Memoized filtered games for performance
  const displayGames = useMemo(() => 
    filteredGames.filter(game => 
      searchTerm === '' || 
      game.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [filteredGames, searchTerm]
  )

  // Week options for navigation
  const weeks = useMemo(() => [
    { week: 1, dates: 'AUG 23 - SEP 1' },
    { week: 2, dates: 'SEP 5 - 7' },
    { week: 3, dates: 'SEP 11 - 14' },
    { week: 4, dates: 'SEP 18 - 21' },
    { week: 5, dates: 'SEP 25 - 28' }
  ], [])

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week)
  }

  const handleRefresh = async () => {
    await refresh()
  }

  if (error && games.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Games</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={handleRefresh} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">NCAAF Scores & Matchups</h1>
              {error && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>API Error</span>
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                🏈 NCAAF <ChevronDown className="w-4 h-4 ml-1" />
              </Badge>
              
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2"
                aria-label="Refresh game data"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Refresh</span>
              </Button>
            </div>
          </div>
          
          {/* Week Navigation */}
          <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Week selection">
            {weeks.map(({ week, dates }) => (
              <button
                key={week}
                onClick={() => handleWeekChange(week)}
                role="tab"
                aria-selected={selectedWeek === week}
                aria-controls={`week-${week}-content`}
                className={`px-4 py-2 text-sm font-medium border-2 rounded-lg transition-all duration-200 ${
                  selectedWeek === week
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
                disabled={loading}
              >
                <div className="font-semibold">WEEK {week}</div>
                <div className="text-xs opacity-90">{dates}</div>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 max-w-md min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                aria-label="Search for teams"
              />
            </div>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Date</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && games.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading games...</p>
          </div>
        ) : displayGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Games Found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No games match "${searchTerm}". Try a different search term.`
                : 'No games available for the selected week.'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{displayGames.length} games</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Filtered by: {searchTerm}
                  </Badge>
                )}
              </div>
              
              {loading && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
            </div>

            <div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              role="grid"
              aria-label="Game cards"
            >
              {displayGames.map((game, index) => (
                <div
                  key={game.id}
                  className="transform transition-all duration-200"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <GameCard 
                    game={game}
                    className={loading ? 'opacity-75' : ''}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ModernGameCards