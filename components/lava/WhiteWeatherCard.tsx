'use client'

import React from 'react'

type LastFive = Array<'W' | 'L'>

interface TeamSnapshot {
  name: string
  abbr: string
  record: string
  ats: string
  last5: LastFive
  spread: number
}

interface WhiteProps {
  venue?: string
  home: TeamSnapshot
  away: TeamSnapshot
  totalOU: number
  iconSrc?: string
}

export const WhiteWeatherCard: React.FC<WhiteProps> = ({
  venue = 'Michigan Stadium, Ann Arbor',
  home,
  away,
  totalOU,
  iconSrc = '/partial-rain-white.png?v=2'
}) => {
  return (
    <div style={{
      width: '640px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 12px 28px rgba(17,24,39,0.12), 0 4px 10px rgba(17,24,39,0.06)',
      border: '1px solid #e5e7eb',
      padding: '16px 22px 12px 22px',
      position: 'relative',
      margin: '20px'
    }}>
      {/* Weather icon, top-left */}
      <img
        src={iconSrc}
        alt="Weather"
        style={{
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          width: '78px',
          height: '78px',
          objectFit: 'contain'
        }}
      />

      {/* Venue */}
      <div style={{ textAlign: 'right', color: '#64748b', fontSize: '14px', fontWeight: 500, marginBottom: '18px' }}>
        {venue}
      </div>

      {/* Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Away */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', background: '#111827', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
          }}>{away.abbr}</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{away.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{away.record} • ATS {away.ats}</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: 4 }}>
              {away.last5.map((r, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: r === 'W' ? '#10b981' : '#ef4444' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Away spread */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#dc2626' }}>{away.spread > 0 ? `+${away.spread}` : `${away.spread}`}</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>SPREAD</div>
        </div>

        {/* Total */}
        <div style={{ textAlign: 'center', background: '#f1f5f9', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>TOTAL O/U</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{totalOU}</div>
        </div>

        {/* Home spread */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>{home.spread > 0 ? `+${home.spread}` : `${home.spread}`}</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>SPREAD</div>
        </div>

        {/* Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{home.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{home.record} • ATS {home.ats}</div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
              {home.last5.map((r, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: r === 'W' ? '#10b981' : '#ef4444' }} />
              ))}
            </div>
          </div>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', background: '#111827', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: 4
          }}>{home.abbr}</div>
        </div>
      </div>
    </div>
  )
}

export default WhiteWeatherCard


