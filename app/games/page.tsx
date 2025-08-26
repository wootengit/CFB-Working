'use client'

import React from 'react'
import { GameCard } from '../../components/GameCard'
import SlickCalendarPicker from '../../components/SlickCalendarPicker'

// Sample game data to showcase the match card
const sampleGames = [
  {
    id: 1,
    homeTeam: 'Alabama',
    awayTeam: 'Georgia', 
    week: 1,
    season: 2025,
    startDate: '2025-08-30T19:30:00Z',
    completed: false,
    conference: 'SEC',
    venue: 'Mercedes-Benz Stadium, Atlanta, GA',
    lines: [{
      id: '1',
      gameId: 1,
      spread: -3.5,
      total: 52.5,
      homeMoneyline: -165,
      awayMoneyline: 140,
      provider: 'DraftKings',
      timestamp: '2025-08-23T17:00:00Z'
    }],
    aiAnalysis: {
      recommendation: 'strong_buy' as const,
      confidence: 87,
      reasoning: ['Rain expected in Atlanta area affecting passing game and favoring under total'],
      sharpIndicators: [],
      weatherImpact: {
        factors: ['precipitation', 'wind'],
        totalAdjustment: 4.5
      },
      valueAnalysis: [],
      bestBet: 'total' as const,
      expectedValue: 12.3,
      kellyPercentage: 8.5,
      riskLevel: 'medium' as const
    }
  },
  {
    id: 2,
    homeTeam: 'Michigan',
    awayTeam: 'Ohio State',
    week: 1,
    season: 2025, 
    startDate: '2025-08-30T15:30:00Z',
    completed: false,
    conference: 'Big Ten',
    venue: 'Michigan Stadium, Ann Arbor, MI',
    lines: [{
      id: '2',
      gameId: 2,
      spread: 2.5,
      total: 48.5,
      homeMoneyline: 125,
      awayMoneyline: -150,
      provider: 'FanDuel',
      timestamp: '2025-08-23T16:45:00Z'
    }],
    aiAnalysis: {
      recommendation: 'buy' as const,
      confidence: 74,
      reasoning: ['Clear sunny conditions perfect for offensive showcase in Ann Arbor'],
      sharpIndicators: [],
      weatherImpact: {
        factors: ['sunny', 'clear'],
        totalAdjustment: 0
      },
      valueAnalysis: [],
      bestBet: 'spread' as const,
      expectedValue: 8.7,
      kellyPercentage: 5.2,
      riskLevel: 'low' as const
    }
  },
  {
    id: 3,
    homeTeam: 'Notre Dame',
    awayTeam: 'USC',
    week: 1,
    season: 2025,
    startDate: '2025-08-30T21:00:00Z', 
    completed: false,
    conference: 'Independent',
    venue: 'Notre Dame Stadium, South Bend, IN',
    lines: [{
      id: '3',
      gameId: 3,
      spread: -1.5,
      total: 55.0,
      homeMoneyline: -110,
      awayMoneyline: -110,
      provider: 'Caesars',
      timestamp: '2025-08-23T17:15:00Z'
    }],
    aiAnalysis: {
      recommendation: 'hold' as const,
      confidence: 62,
      reasoning: ['Strong winds expected affecting kicking game and deep passes'],
      sharpIndicators: [],
      weatherImpact: {
        factors: ['wind'],
        totalAdjustment: -2.3
      },
      valueAnalysis: [],
      bestBet: 'none' as const,
      expectedValue: -1.2,
      kellyPercentage: 0,
      riskLevel: 'high' as const
    }
  }
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            College Football Betting Center
          </h1>
          <p className="text-lg text-slate-600">
            Live betting cards with calendar navigation
          </p>
        </div>
        
        {/* Calendar Component */}
        <div className="mb-8">
          <SlickCalendarPicker 
            selectedDate={new Date()}
            onDateSelect={(date) => console.log('Selected date:', date)}
          />
        </div>
        
        <div className="space-y-6">
          {sampleGames.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              isHighlight={index === 0}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}