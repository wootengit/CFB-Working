

'use client'

import React from 'react'

interface EmblemProps {
  src: string
  alt: string
  size?: number
  variant?: 'glass' | 'solid'
}

/*
  3D Lava Team Emblem
  - Organic pill container with multi-layer gradient lighting
  - Inner shadow and outer ambient shadow
  - Subtle morphing and hover lift for tactile feel
*/
const LavaTeamEmblem: React.FC<EmblemProps> = ({ src, alt, size = 72, variant = 'glass' }) => {
  const container = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '22px',
    position: 'relative' as const,
    // Apple-style glass (VisionOS / iOS) vs solid lava
    background: variant === 'glass'
      ? `linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.16) 100%),
         radial-gradient(120% 120% at 10% 0%, rgba(255,255,255,0.35) 0%, transparent 60%),
         linear-gradient(315deg, rgba(0,0,0,0.06), transparent 60%)`
      : `linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 35%, rgba(240,244,255,0.85) 100%),
         radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8), transparent 60%),
         linear-gradient(315deg, rgba(0,0,0,0.05), transparent 60%)`,
    boxShadow: variant === 'glass'
      ? `0 10px 20px rgba(0,0,0,0.18),
         0 1px 0 rgba(255,255,255,0.55) inset,
         0 -1px 0 rgba(0,0,0,0.1) inset`
      : `0 8px 16px rgba(0,0,0,0.12),
         0 16px 32px rgba(0,0,0,0.08),
         0 2px 0 rgba(255,255,255,0.9) inset,
         0 -2px 0 rgba(0,0,0,0.06) inset`,
    border: variant === 'glass' ? '1px solid rgba(255,255,255,0.35)' : 'none',
    backdropFilter: variant === 'glass' ? 'blur(14px) saturate(140%)' : undefined,
    WebkitBackdropFilter: variant === 'glass' ? 'blur(14px) saturate(140%)' : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transformStyle: 'preserve-3d' as const
  }

  const logo = {
    width: `${size - 14}px`,
    height: `${size - 14}px`,
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))'
  }

  return (
    <div style={container}>
      {/* Specular highlight sweep (Apple glass) */}
      {variant === 'glass' && (
        <div style={{
          position: 'absolute' as const,
          top: '-40%',
          left: '-80%',
          width: '260%',
          height: '180%',
          background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.35) 50%, transparent 55%)',
          transform: 'rotate(8deg)',
          filter: 'blur(6px)',
          animation: 'glassSweep 6s ease-in-out infinite'
        }} />
      )}
      <img src={src} alt={alt} style={logo}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png' }}
      />
      <style jsx global>{`
        @keyframes glassSweep {
          0%, 100% { left: -80%; }
          50% { left: 20%; }
        }
      `}</style>
    </div>
  )
}

export default LavaTeamEmblem
