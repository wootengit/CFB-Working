'use client'

import React, { useState, useEffect } from 'react'
import LEDSportsbookBoard from '@/components/LEDSportsbookBoard'
import { EnhancedTeamData } from '@/types/cfb-api'

const LEDSportsbookPage: React.FC = () => {
  const [teams, setTeams] = useState<EnhancedTeamData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        // Use the same API endpoint as standings page for consistency
        const response = await fetch('/api/standings/enhanced?year=2024')
        const data = await response.json()
        
        if (!mounted) return
        
        if (data.success && data.data) {
          setTeams(data.data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading sportsbook data:', error)
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

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#000000',
        color: '#00FF41',
        fontFamily: 'SF Mono, Monaco, Roboto Mono, monospace',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        textShadow: '0 0 10px currentColor'
      }}>
        LOADING SPORTSBOOK DATA...
      </div>
    )
  }

  return <LEDSportsbookBoard teams={teams} title="COLLEGE FOOTBALL LIVE ODDS" />
}

export default LEDSportsbookPage