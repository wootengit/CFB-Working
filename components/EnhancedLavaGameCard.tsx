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
  
  // Enhanced Statistics
  homeStats?: {
    pointsForPerGame: number
    pointsAgainstPerGame: number
    margin: number
    marginPerGame: number
    atsPercentage: number
    overUnderPercentage: number
    favoriteAtsPercentage: number
    underdogAtsPercentage: number
    strengthOfSchedule: number
    strengthOfScheduleRank: number
    last5Record: { wins: number; losses: number }
  }
  awayStats?: {
    pointsForPerGame: number
    pointsAgainstPerGame: number
    margin: number
    marginPerGame: number
    atsPercentage: number
    overUnderPercentage: number
    favoriteAtsPercentage: number
    underdogAtsPercentage: number
    strengthOfSchedule: number
    strengthOfScheduleRank: number
    last5Record: { wins: number; losses: number }
  }
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
    spread: typeof game.spread === 'number' ? (game.spread || 0) : 0,
    score: game.homeScore
  }

  const awaySnapshot = {
    name: game.awayTeam,
    abbr: game.awayTeam.slice(0, 3).toUpperCase(),
    record: `${game.awayRecord.wins}-${game.awayRecord.losses}`,
    ats: '—',
    last5: parseLast5(game.awayLast5),
    spread: typeof game.spread === 'number' ? -(game.spread || 0) : 0,
    score: game.awayScore
  }

  const details = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Team Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Away</div>
          <div style={{ fontWeight: 700 }}>{game.awayTeam}</div>
          <div style={{ fontSize: 12, color: '#475569' }}>Record {awaySnapshot.record}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textAlign: 'right' }}>Home</div>
          <div style={{ fontWeight: 700, textAlign: 'right' }}>{game.homeTeam}</div>
          <div style={{ fontSize: 12, color: '#475569', textAlign: 'right' }}>Record {homeSnapshot.record}</div>
        </div>
      </div>

      {/* Enhanced Statistics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr 1fr', 
        gap: '8px 12px',
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        {/* Headers */}
        <div style={{ fontWeight: 600, color: '#374151' }}>Stats</div>
        <div style={{ fontWeight: 600, color: '#374151', textAlign: 'center' }}>{game.awayTeam.slice(0, 10)}</div>
        <div style={{ fontWeight: 600, color: '#374151', textAlign: 'center' }}>{game.homeTeam.slice(0, 10)}</div>
        
        {/* PF/G - Points For per Game */}
        <div style={{ color: '#64748b' }}>PF/G</div>
        <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>
          {game.awayStats?.pointsForPerGame?.toFixed(1) ?? '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>
          {game.homeStats?.pointsForPerGame?.toFixed(1) ?? '—'}
        </div>
        
        {/* PA/G - Points Against per Game */}
        <div style={{ color: '#64748b' }}>PA/G</div>
        <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>
          {game.awayStats?.pointsAgainstPerGame?.toFixed(1) ?? '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>
          {game.homeStats?.pointsAgainstPerGame?.toFixed(1) ?? '—'}
        </div>
        
        {/* MARGIN - Point Differential per Game */}
        <div style={{ color: '#64748b' }}>MARGIN</div>
        <div style={{ 
          textAlign: 'center', 
          color: (game.awayStats?.marginPerGame ?? 0) >= 0 ? '#16a34a' : '#dc2626',
          fontWeight: 600 
        }}>
          {game.awayStats?.marginPerGame ? 
            (game.awayStats.marginPerGame >= 0 ? '+' : '') + game.awayStats.marginPerGame.toFixed(1) 
            : '—'}
        </div>
        <div style={{ 
          textAlign: 'center', 
          color: (game.homeStats?.marginPerGame ?? 0) >= 0 ? '#16a34a' : '#dc2626',
          fontWeight: 600 
        }}>
          {game.homeStats?.marginPerGame ? 
            (game.homeStats.marginPerGame >= 0 ? '+' : '') + game.homeStats.marginPerGame.toFixed(1) 
            : '—'}
        </div>
        
        {/* ATS% - Against The Spread */}
        <div style={{ color: '#64748b' }}>ATS%</div>
        <div style={{ textAlign: 'center', color: '#7c3aed', fontWeight: 600 }}>
          {game.awayStats?.atsPercentage ? game.awayStats.atsPercentage.toFixed(1) + '%' : '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#7c3aed', fontWeight: 600 }}>
          {game.homeStats?.atsPercentage ? game.homeStats.atsPercentage.toFixed(1) + '%' : '—'}
        </div>
        
        {/* O/U% - Over/Under */}
        <div style={{ color: '#64748b' }}>O/U%</div>
        <div style={{ textAlign: 'center', color: '#059669', fontWeight: 600 }}>
          {game.awayStats?.overUnderPercentage ? game.awayStats.overUnderPercentage.toFixed(1) + '%' : '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#059669', fontWeight: 600 }}>
          {game.homeStats?.overUnderPercentage ? game.homeStats.overUnderPercentage.toFixed(1) + '%' : '—'}
        </div>
        
        {/* Fav ATS% - Favorite ATS */}
        <div style={{ color: '#64748b' }}>Fav ATS%</div>
        <div style={{ textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>
          {game.awayStats?.favoriteAtsPercentage ? game.awayStats.favoriteAtsPercentage.toFixed(1) + '%' : '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>
          {game.homeStats?.favoriteAtsPercentage ? game.homeStats.favoriteAtsPercentage.toFixed(1) + '%' : '—'}
        </div>
        
        {/* Dog ATS% - Underdog ATS */}
        <div style={{ color: '#64748b' }}>Dog ATS%</div>
        <div style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 600 }}>
          {game.awayStats?.underdogAtsPercentage ? game.awayStats.underdogAtsPercentage.toFixed(1) + '%' : '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 600 }}>
          {game.homeStats?.underdogAtsPercentage ? game.homeStats.underdogAtsPercentage.toFixed(1) + '%' : '—'}
        </div>
        
        {/* L5 Form - Last 5 games */}
        <div style={{ color: '#64748b' }}>L5 Form</div>
        <div style={{ textAlign: 'center', fontWeight: 600 }}>
          {game.awayStats?.last5Record ? 
            `${game.awayStats.last5Record.wins}-${game.awayStats.last5Record.losses}` 
            : game.awayLast5 || '—'}
        </div>
        <div style={{ textAlign: 'center', fontWeight: 600 }}>
          {game.homeStats?.last5Record ? 
            `${game.homeStats.last5Record.wins}-${game.homeStats.last5Record.losses}` 
            : game.homeLast5 || '—'}
        </div>
        
        {/* SoS - Strength of Schedule */}
        <div style={{ color: '#64748b' }}>SoS</div>
        <div style={{ textAlign: 'center', color: '#9333ea', fontWeight: 600 }}>
          {game.awayStats?.strengthOfSchedule ? game.awayStats.strengthOfSchedule.toFixed(2) : '—'}
        </div>
        <div style={{ textAlign: 'center', color: '#9333ea', fontWeight: 600 }}>
          {game.homeStats?.strengthOfSchedule ? game.homeStats.strengthOfSchedule.toFixed(2) : '—'}
        </div>
      </div>

      {/* Game Info */}
      <div style={{ fontSize: 12, color: '#475569', display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <div>Spread: {game.spread ?? '—'}</div>
        <div>Total O/U: {game.overUnder ?? '—'}</div>
        <div>Kickoff: {new Date(game.startDate).toLocaleString()}</div>
        <div>Venue: {game.venue}</div>
      </div>
    </div>
  )

  // Use enhanced card for completed games with both prediction and results
  if (game.completed && (game.homeScore !== undefined || game.awayScore !== undefined)) {
    const homeScore = game.homeScore || 0
    const awayScore = game.awayScore || 0
    const totalScore = homeScore + awayScore
    const margin = homeScore - awayScore
    const spread = game.spread || 0
    const overUnder = game.overUnder || 0
    
    // Determine who covered the spread
    const homeCovered = margin > -spread
    const coveringTeam = homeCovered ? game.homeTeam : game.awayTeam
    const coverMargin = Math.abs(margin + spread)
    
    // Determine over/under
    const wasOver = totalScore > overUnder
    const ouMargin = Math.abs(totalScore - overUnder)

    return (
      <LavaGameCard
        venue={game.venue}
        home={{...homeSnapshot, score: homeScore}}
        away={{...awaySnapshot, score: awayScore}}
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
        isExpanded={true}
        detailsContent={
          <div>
            {/* Original Predictions Section - Muted */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                ORIGINAL PREDICTIONS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '11px' }}>
                <div style={{ color: '#475569' }}>
                  Away Spread: {awaySnapshot.spread > 0 ? `+${awaySnapshot.spread}` : awaySnapshot.spread}
                </div>
                <div style={{ color: '#475569', textAlign: 'center' }}>
                  O/U: {overUnder}
                </div>
                <div style={{ color: '#475569', textAlign: 'right' }}>
                  Home Spread: {homeSnapshot.spread > 0 ? `+${homeSnapshot.spread}` : homeSnapshot.spread}
                </div>
              </div>
            </div>

            {/* Actual Results Section - Prominent */}
            <div style={{
              background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
              border: '2px solid #16a34a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#15803d',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>FINAL RESULT</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>
                  {game.venue}
                </span>
              </div>
              
              {/* Final scores */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                    {game.awayTeam}
                  </span>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: awayScore > homeScore ? '#16a34a' : '#64748b'
                  }}>
                    {awayScore}
                  </span>
                </div>
                
                <div style={{ color: '#94a3b8', fontSize: '18px', fontWeight: '600' }}>-</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: homeScore > awayScore ? '#16a34a' : '#64748b'
                  }}>
                    {homeScore}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                    {game.homeTeam}
                  </span>
                </div>
              </div>

              {/* Spread coverage analysis */}
              <div style={{
                background: '#e0f2fe',
                border: '1px solid #0284c7',
                borderRadius: '6px',
                padding: '10px 12px',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#0c4a6e',
                  fontWeight: '600',
                  lineHeight: '1.4'
                }}>
                  <strong>{coveringTeam}</strong> covered the spread of {spread > 0 ? `+${spread}` : spread} by {coverMargin.toFixed(1)} points.
                </div>
              </div>
              
              {/* Over/Under result */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#475569'
              }}>
                <span>
                  O/U {overUnder}: <strong style={{ color: wasOver ? '#dc2626' : '#16a34a' }}>
                    {wasOver ? 'OVER' : 'UNDER'} by {ouMargin.toFixed(1)}
                  </strong>
                </span>
                <span>
                  Total Score: <strong style={{ color: '#1e293b' }}>{totalScore}</strong>
                </span>
              </div>
            </div>
          </div>
        }
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