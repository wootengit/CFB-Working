'use client'

import React from 'react'
import LavaGameCardFlippable from './lava/LavaGameCardFlippable'

type GameData = {
  id: number
  homeTeam: string
  awayTeam: string
  week: number
  season: number
  startDate: string
  venue: string
  spread?: number
  overUnder?: number
  homeScore?: number
  awayScore?: number
  completed: boolean
  homeRecord: { wins: number; losses: number; ties: number }
  awayRecord: { wins: number; losses: number; ties: number }
  homeLast5: string
  awayLast5: string
  homeLogoUrl: string
  awayLogoUrl: string
  weatherCondition?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy'
  temperature?: number
  humidity?: number
  windSpeed?: number
  feelsLike?: number
}

type QuarterScores = {
  away: [number, number, number, number]
  home: [number, number, number, number]
}

interface FinalGameCardProps {
  game: GameData
  preGameSpread?: number
  preGameOverUnder?: number
  quarterScores?: QuarterScores
}

function parseLast5(input: string): Array<'W'|'L'> {
  if (!input) return []
  return input.split('-').map(s => (s.trim().toUpperCase() === 'W' ? 'W' : 'L')) as Array<'W'|'L'>
}

export const FinalGameCard: React.FC<FinalGameCardProps> = ({ 
  game, 
  preGameSpread, 
  preGameOverUnder,
  quarterScores 
}) => {
  const actualSpread = preGameSpread || game.spread || 0
  const actualOU = preGameOverUnder || game.overUnder || 0
  
  // Create team snapshots with scores
  const homeSnapshot = {
    name: game.homeTeam,
    abbr: game.homeTeam.slice(0, 3).toUpperCase(),
    record: `${game.homeRecord.wins}-${game.homeRecord.losses}`,
    ats: '—',
    last5: parseLast5(game.homeLast5),
    spread: typeof actualSpread === 'number' ? -actualSpread : 0,
    score: game.homeScore
  }

  const awaySnapshot = {
    name: game.awayTeam,
    abbr: game.awayTeam.slice(0, 3).toUpperCase(),
    record: `${game.awayRecord.wins}-${game.awayRecord.losses}`,
    ats: '—',
    last5: parseLast5(game.awayLast5),
    spread: typeof actualSpread === 'number' ? actualSpread : 0,
    score: game.awayScore
  }

  return (
    <LavaGameCardFlippable
      venue={game.venue}
      home={homeSnapshot}
      away={awaySnapshot}
      totalOU={actualOU}
      homeLogoUrl={game.homeLogoUrl}
      awayLogoUrl={game.awayLogoUrl}
      completed={true}
      weather={game.weatherCondition === 'rainy' ? 'partial-rain' : 
               game.weatherCondition === 'sunny' ? 'sunny-beach' :
               game.weatherCondition === 'cloudy' ? 'sunny-cold' :
               game.weatherCondition === 'snowy' ? 'sunny-cold' :
               'sunny-beach'}
      weatherData={{
        temperature: game.temperature,
        condition: game.weatherCondition || 'sunny',
        humidity: game.humidity,
        windSpeed: game.windSpeed,
        feelsLike: game.feelsLike
      }}
      watermark={true}
      preGameSpread={actualSpread}
      preGameOverUnder={actualOU}
      quarterScores={quarterScores}
    />
  )
}

export default FinalGameCard