'use client'

import React from 'react'
import { LavaGameCard } from './lava/LavaGameCard'
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

function parseLast5(input: string): Array<'W'|'L'> {
  if (!input) return []
  return input.split('-').map(s => (s.trim().toUpperCase() === 'W' ? 'W' : 'L')) as Array<'W'|'L'>
}

export const EnhancedLavaGameCard: React.FC<{ game: GameData }> = ({ game }) => {
  const [expanded, setExpanded] = React.useState(false)
  const homeSnapshot = {
    name: game.homeTeam,
    abbr: game.homeTeam.slice(0, 3).toUpperCase(),
    record: `${game.homeRecord.wins}-${game.homeRecord.losses}`,
    ats: '—',
    last5: parseLast5(game.homeLast5),
    spread: typeof game.spread === 'number' ? -(game.spread || 0) : 0,
    score: game.homeScore
  }

  const awaySnapshot = {
    name: game.awayTeam,
    abbr: game.awayTeam.slice(0, 3).toUpperCase(),
    record: `${game.awayRecord.wins}-${game.awayRecord.losses}`,
    ats: '—',
    last5: parseLast5(game.awayLast5),
    spread: typeof game.spread === 'number' ? (game.spread || 0) : 0,
    score: game.awayScore
  }

  const details = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Away</div>
        <div style={{ fontWeight: 700 }}>{game.awayTeam}</div>
        <div style={{ fontSize: 12, color: '#475569' }}>Record {awaySnapshot.record}</div>
        <div style={{ fontSize: 12, color: '#475569' }}>Last 5 {game.awayLast5}</div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textAlign: 'right' }}>Home</div>
        <div style={{ fontWeight: 700, textAlign: 'right' }}>{game.homeTeam}</div>
        <div style={{ fontSize: 12, color: '#475569', textAlign: 'right' }}>Record {homeSnapshot.record}</div>
        <div style={{ fontSize: 12, color: '#475569', textAlign: 'right' }}>Last 5 {game.homeLast5}</div>
      </div>
      <div style={{ gridColumn: '1 / -1', fontSize: 12, color: '#475569', display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <div>Spread: {game.spread ?? '—'}</div>
        <div>Total O/U: {game.overUnder ?? '—'}</div>
        <div>Kickoff: {new Date(game.startDate).toLocaleString()}</div>
        <div>Venue: {game.venue}</div>
      </div>
    </div>
  )

  // Use flippable card for completed games, regular card for upcoming games
  if (game.completed) {
    return (
      <LavaGameCardFlippable
        venue={game.venue}
        home={homeSnapshot}
        away={awaySnapshot}
        totalOU={game.overUnder || 0}
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
        preGameSpread={game.spread}
        preGameOverUnder={game.overUnder}
      />
    )
  }

  return (
    <LavaGameCard
      venue={game.venue}
      home={homeSnapshot}
      away={awaySnapshot}
      totalOU={game.overUnder || 0}
      homeLogoUrl={game.homeLogoUrl}
      awayLogoUrl={game.awayLogoUrl}
      completed={false}
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
      isExpanded={expanded}
      onToggleDetails={() => setExpanded(v => !v)}
      detailsContent={details}
    />
  )
}

export default EnhancedLavaGameCard