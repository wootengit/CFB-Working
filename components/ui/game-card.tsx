/**
 * 🏈 Modern Game Card Component - React 19 + Compound Pattern
 * Expert-level implementation with server components, accessibility, and performance
 */
'use client'

import React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, ChevronDown, Clock } from "lucide-react"

// Enhanced types for UI-specific needs  
interface BettingLine {
  id: string
  gameId: number
  spread: number
  total: number
  homeMoneyline: number
  awayMoneyline: number
  provider: string
  timestamp: string
  formattedSpread?: string
  spreadOpen?: number
  overUnder?: number
  overUnderOpen?: number
}

interface BettingInsight {
  gameId: number
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid'
  confidence: number
  primaryReason: string
  keyFactors: string[]
  sharpMoney: 'with' | 'against' | 'neutral'
  publicBetting: number
  lineMovement: 'sharp' | 'public' | 'steam' | 'none'
  bestBet: 'spread' | 'total' | 'moneyline' | 'none'
  value: 'high' | 'medium' | 'low'
}

interface Game {
  id: number
  homeTeam: string
  awayTeam: string
  week: number
  season: number
  startDate: string
  homeScore?: number
  awayScore?: number
  completed: boolean
  conference?: string
  venue?: string
}

interface GameCardProps {
  game: Game & {
    lines: BettingLine[]
    insight?: BettingInsight
    awayRecord?: string
    homeRecord?: string
  }
  className?: string
  children?: React.ReactNode
}

interface TeamDisplayProps {
  team: string
  record?: string
  logoUrl?: string
  isHome?: boolean
  className?: string
}

interface SpreadDisplayProps {
  spread: number
  isAway?: boolean
  className?: string
}

interface GameTimeDisplayProps {
  startDate: string
  overUnder?: number
  className?: string
}

// Team logo mapping with fallback
const getTeamLogoUrl = (teamName: string): string => {
  const teamMap: Record<string, string> = {
    'Alabama': 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
    'Georgia': 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
    'Ohio State': 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png',
    'Michigan': 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
    'Texas': 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
    'USC': 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png',
    'Notre Dame': 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png',
    'Clemson': 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png',
    'Florida': 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
    'LSU': 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
    'Fresno State': 'https://a.espncdn.com/i/teamlogos/ncaa/500/278.png',
    'Kansas': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png',
    'Sam Houston': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2939.png',
    'Western Kentucky': 'https://a.espncdn.com/i/teamlogos/ncaa/500/98.png',
    'Iowa State': 'https://a.espncdn.com/i/teamlogos/ncaa/500/66.png',
    'Kansas State': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png',
    'Idaho State': 'https://a.espncdn.com/i/teamlogos/ncaa/500/304.png',
    'UNLV': 'https://a.espncdn.com/i/teamlogos/ncaa/500/2439.png',
  }
  
  return teamMap[teamName] || 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png'
}

const getTeamAbbreviation = (teamName: string): string => {
  const abbreviations: Record<string, string> = {
    'Iowa State': 'ISU',
    'Kansas State': 'KSU',
    'Idaho State': 'IDST',
    'UNLV': 'UNLV',
    'Fresno State': 'FRES',
    'Kansas': 'KU',
    'Sam Houston': 'SHSU',
    'Western Kentucky': 'WKU',
    'Alabama': 'ALA',
    'Georgia': 'UGA',
    'Ohio State': 'OSU',
    'Michigan': 'MICH',
    'Texas': 'TEX',
    'USC': 'USC',
    'Notre Dame': 'ND',
    'Clemson': 'CLEM',
    'Florida': 'FLA',
    'LSU': 'LSU',
  }
  
  return abbreviations[teamName] || 
    teamName.split(' ')
      .map(word => word.substring(0, 4).toUpperCase())
      .join('')
      .substring(0, 4)
}

// Compound component architecture
const GameCardRoot: React.FC<GameCardProps> = ({ game, className, children, ...props }) => {
  return (
    <Card 
      className={cn("overflow-hidden hover:shadow-lg transition-all duration-200", className)}
      {...props}
    >
      {children}
    </Card>
  )
}
GameCardRoot.displayName = "GameCard"

const GameCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & { awayTeam: string; homeTeam: string; gameNumber?: number }> = ({ awayTeam, homeTeam, gameNumber = 1, className, ...props }) => {
  const headerText = `${getTeamAbbreviation(awayTeam)} @ ${getTeamAbbreviation(homeTeam)} (${gameNumber})`
  
  return (
    <CardHeader 
      className={cn("bg-slate-700 text-white px-4 py-3 text-sm font-medium", className)}
      {...props}
    >
      {headerText}
    </CardHeader>
  )
}
GameCardHeader.displayName = "GameCardHeader"

const GameCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <CardContent 
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </CardContent>
  )
}
GameCardContent.displayName = "GameCardContent"

const TeamDisplay = React.memo<TeamDisplayProps>(({ 
  team, 
  record, 
  logoUrl, 
  isHome = false, 
  className 
}) => {
  const [imageError, setImageError] = React.useState(false)
  const finalLogoUrl = logoUrl || getTeamLogoUrl(team)
  const fallbackUrl = 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png'
  
  return (
    <div className={cn(
      "flex items-center space-x-3", 
      isHome && "justify-end",
      className
    )}>
      {!isHome && (
        <>
          <img 
            src={imageError ? fallbackUrl : finalLogoUrl}
            alt={`${team} logo`}
            className="w-12 h-12 object-contain"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="text-xl font-bold text-gray-900">
            {getTeamAbbreviation(team)}
          </div>
        </>
      )}
      
      {isHome && (
        <>
          <div className="text-xl font-bold text-gray-900">
            {getTeamAbbreviation(team)}
          </div>
          <img 
            src={imageError ? fallbackUrl : finalLogoUrl}
            alt={`${team} logo`}
            className="w-12 h-12 object-contain"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </>
      )}
    </div>
  )
})
TeamDisplay.displayName = "TeamDisplay"

const SpreadDisplay = React.memo<SpreadDisplayProps>(({ spread, isAway = false, className }) => {
  const displaySpread = isAway ? spread : spread * -1
  const formattedSpread = displaySpread > 0 ? `+${displaySpread}` : `${displaySpread}`
  
  return (
    <div className={cn("text-center", className)}>
      <div className="text-3xl font-bold text-gray-900">
        {spread !== 0 ? formattedSpread : '-'}
      </div>
    </div>
  )
})
SpreadDisplay.displayName = "SpreadDisplay"

const GameTimeDisplay = React.memo<GameTimeDisplayProps>(({ startDate, overUnder, className }) => {
  const gameDate = new Date(startDate)
  
  return (
    <div className={cn("text-center", className)}>
      <div className="text-sm font-medium text-gray-700 mb-1">
        {gameDate.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })}
      </div>
      <div className="text-xs text-gray-600 mb-2 flex items-center justify-center space-x-1">
        <Clock className="w-3 h-3" />
        <span>
          {gameDate.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true
          })} ET
        </span>
      </div>
      <div className="text-sm text-gray-600">o/u</div>
      <div className="text-xl font-bold text-gray-900">
        {overUnder || '-'}
      </div>
    </div>
  )
})
GameTimeDisplay.displayName = "GameTimeDisplay"

const StatsRow = React.memo(() => {
  return (
    <div className="grid grid-cols-5 gap-4 mt-4 text-xs text-gray-500">
      <div className="space-y-1">
        <div>(- Road)</div>
        <div>(- Road)</div>
        <div>(- ATS)</div>
      </div>
      <div className="text-center">-</div>
      <div className="text-center space-y-1">
        <div>Win/Loss</div>
        <div>Against the Spread</div>
        <div>Last 10</div>
      </div>
      <div className="text-center">-</div>
      <div className="space-y-1 text-right">
        <div>(- Home)</div>
        <div>(- Home)</div>
        <div>(- ATS)</div>
      </div>
    </div>
  )
})
StatsRow.displayName = "StatsRow"

const GameCardActions = React.memo<{ insight?: BettingInsight }>(({ insight }) => {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      <Button 
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition-colors"
        aria-label="View detailed matchup analysis"
      >
        Matchup
      </Button>
      
      <div className="flex items-center space-x-6 text-sm">
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          aria-label="View betting consensus"
        >
          Consensus
        </button>
        
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors"
          aria-label="View expert picks"
        >
          <span>Picks</span>
          {insight && (
            <Badge className="bg-orange-500 text-white text-xs" aria-label="Number of expert picks">
              1
            </Badge>
          )}
        </button>
        
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors"
          aria-label="View line movement analysis"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Line Moves</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
})
GameCardActions.displayName = "GameCardActions"

// Main composite component
const GameCard = React.memo<GameCardProps>(({ game, className, ...props }) => {
  const bestLine = game.lines?.[0]
  const awaySpread = bestLine?.spread || 0
  const overUnder = bestLine?.overUnder || bestLine?.total || 0
  
  return (
    <GameCardRoot game={game} className={className} {...props}>
      <GameCardHeader 
        awayTeam={game.awayTeam} 
        homeTeam={game.homeTeam} 
      />
      
      <GameCardContent>
        <div className="grid grid-cols-5 gap-4 items-center" role="grid" aria-label="Game matchup details">
          {/* Away Team */}
          <div role="gridcell" aria-label={`Away team: ${game.awayTeam}`}>
            <TeamDisplay 
              team={game.awayTeam} 
              record={game.awayRecord}
            />
          </div>
          
          {/* Away Spread */}
          <div role="gridcell" aria-label={`Away team spread: ${awaySpread > 0 ? `+${awaySpread}` : awaySpread}`}>
            <SpreadDisplay spread={awaySpread} isAway />
          </div>
          
          {/* Center - Game Time & O/U */}
          <div role="gridcell" aria-label={`Game time and over/under: ${overUnder}`}>
            <GameTimeDisplay 
              startDate={game.startDate} 
              overUnder={overUnder}
            />
          </div>
          
          {/* Home Spread */}
          <div role="gridcell" aria-label={`Home team spread: ${awaySpread < 0 ? `+${Math.abs(awaySpread)}` : `-${awaySpread}`}`}>
            <SpreadDisplay spread={awaySpread} />
          </div>
          
          {/* Home Team */}
          <div role="gridcell" aria-label={`Home team: ${game.homeTeam}`}>
            <TeamDisplay 
              team={game.homeTeam} 
              record={game.homeRecord}
              isHome
            />
          </div>
        </div>
        
        <StatsRow />
        <GameCardActions insight={game.insight} />
      </GameCardContent>
    </GameCardRoot>
  )
})
GameCard.displayName = "GameCard"

// Export both individual components and main composite
export {
  GameCard,
  GameCardRoot,
  GameCardHeader,
  GameCardContent,
  TeamDisplay,
  SpreadDisplay,
  GameTimeDisplay,
  GameCardActions,
  StatsRow
}

export default GameCard