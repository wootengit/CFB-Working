'use client'

import React from 'react'
import { resolveBackgroundForVenue, resolveIconForWeather, type WeatherCondition } from '@/lib/backgroundResolver'
import LavaTeamEmblem from './LavaTeamEmblem'

// 3D Weather Animation Component - Airbnb Lava Style
const LavaWeatherIcon: React.FC<{ 
  type: 'sunny-cloudy' | 'sunny' | 'cloudy' | 'rainy'
}> = ({ type }) => {
  
  if (type === 'sunny-cloudy') {
    return (
      <div style={{
        position: 'relative',
        width: '80px',
        height: '60px',
        transform: 'translateZ(20px)',
        animation: 'lavaFloat 4s ease-in-out infinite'
      }}>
        {/* Cloud Base - Lava Style */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          right: '10px',
          width: '50px',
          height: '30px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          borderRadius: '25px 25px 20px 15px',
          boxShadow: `
            0 4px 12px rgba(0,0,0,0.15),
            0 2px 4px rgba(255,255,255,0.8) inset,
            0 -1px 2px rgba(0,0,0,0.1) inset
          `,
          animation: 'cloudMorph 8s ease-in-out infinite',
          transform: 'translateZ(10px)'
        }} />
        
        {/* Sun - Enhanced Lava Style */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: '0px',
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle at 30% 30%, #fbbf24, #f59e0b, #d97706)',
          borderRadius: '50%',
          boxShadow: `
            0 6px 20px rgba(245,158,11,0.4),
            0 2px 8px rgba(0,0,0,0.1),
            0 1px 0 rgba(255,255,255,0.3) inset,
            0 -1px 0 rgba(0,0,0,0.1) inset
          `,
          animation: 'sunPulse 3s ease-in-out infinite',
          transform: 'translateZ(15px)'
        }}>
          {/* Sun Rays - Rotating */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            background: `
              conic-gradient(from 0deg,
                transparent 10deg,
                rgba(251,191,36,0.3) 15deg,
                transparent 20deg,
                transparent 40deg,
                rgba(251,191,36,0.3) 45deg,
                transparent 50deg,
                transparent 70deg,
                rgba(251,191,36,0.3) 75deg,
                transparent 80deg,
                transparent 100deg,
                rgba(251,191,36,0.3) 105deg,
                transparent 110deg
              )
            `,
            borderRadius: '50%',
            animation: 'sunRaysRotate 20s linear infinite',
            filter: 'blur(1px)'
          }} />
          
          {/* Pixel-Perfect Airbnb Sunglasses */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '4px',
            width: '32px',
            height: '16px',
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #000000 100%)',
            borderRadius: '16px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.6), 0 1px 2px rgba(255,255,255,0.15) inset',
            zIndex: 6,
            border: '1px solid #333'
          }}>
            {/* Left lens - chunky and rounded */}
            <div style={{
              position: 'absolute',
              left: '3px',
              top: '3px',
              width: '11px',
              height: '10px',
              background: 'radial-gradient(circle at 30% 30%, #1a1a1a, #000000)',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.8) inset, 0 1px 1px rgba(255,255,255,0.1)'
            }} />
            {/* Right lens - chunky and rounded */}
            <div style={{
              position: 'absolute',
              right: '3px',
              top: '3px',
              width: '11px',
              height: '10px',
              background: 'radial-gradient(circle at 30% 30%, #1a1a1a, #000000)',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.8) inset, 0 1px 1px rgba(255,255,255,0.1)'
            }} />
            {/* Thick bridge */}
            <div style={{
              position: 'absolute',
              top: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '4px',
              background: 'linear-gradient(135deg, #333, #1a1a1a)',
              borderRadius: '2px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }} />
          </div>
        </div>
      </div>
    )
  }
  
  return null
}

// Team Logo Component with 3D Lava Effects
const LavaTeamLogo: React.FC<{
  team: 'Florida' | 'Texas'
  size?: number
}> = ({ team, size = 60 }) => {
  
  const getTeamColors = (teamName: string) => {
    if (teamName === 'Florida') {
      return {
        primary: '#0021A5',
        secondary: '#FA4616', 
        gradient: 'linear-gradient(135deg, #0021A5 0%, #002374 50%, #FA4616 100%)'
      }
    } else if (teamName === 'Texas') {
      return {
        primary: '#BF5700',
        secondary: '#FFFFFF',
        gradient: 'linear-gradient(135deg, #BF5700 0%, #9D4600 50%, #7A3400 100%)'
      }
    }
    return { primary: '#666', secondary: '#999', gradient: 'linear-gradient(135deg, #666, #999)' }
  }
  
  const colors = getTeamColors(team)
  
  if (team === 'Florida') {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        transform: 'translateZ(10px)',
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateZ(15px) scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateZ(10px) scale(1)'
      }}>
        <img 
          src="https://a.espncdn.com/i/teamlogos/ncaa/500/57.png"
          alt="Florida Gators logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            boxShadow: `
              0 6px 16px rgba(0,33,165,0.3),
              0 2px 4px rgba(255,255,255,0.2) inset,
              0 -2px 4px rgba(0,0,0,0.2) inset
            `,
            animation: 'logoMorph 10s ease-in-out infinite'
          }}
        />
      </div>
    )
  }
  
  if (team === 'Texas') {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        transform: 'translateZ(10px)',
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateZ(15px) scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateZ(10px) scale(1)'
      }}>
        <img 
          src="https://a.espncdn.com/i/teamlogos/ncaa/500/251.png"
          alt="Texas Longhorns logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            boxShadow: `
              0 6px 16px rgba(191,87,0,0.3),
              0 2px 4px rgba(255,255,255,0.3) inset,
              0 -2px 4px rgba(0,0,0,0.2) inset
            `,
            animation: 'logoMorph 12s ease-in-out infinite reverse'
          }}
        />
      </div>
    )
  }
  
  return null
}

// Main Lava Game Card Component
type LastFive = Array<'W' | 'L'>

interface TeamSnapshot {
  name: string
  abbr: string
  record: string
  ats: string
  last5: LastFive
  spread: number
  score?: number
}

interface WeatherData {
  temperature?: number
  condition?: string
  humidity?: number
  windSpeed?: number
  feelsLike?: number
}

interface LavaProps {
  venue?: string
  weather?: WeatherCondition
  weatherData?: WeatherData
  showTeams?: boolean
  watermark?: boolean
  home?: TeamSnapshot
  away?: TeamSnapshot
  totalOU?: number
  backgroundOverride?: string
  disableBackground?: boolean
  disableShineOverlay?: boolean
  iconOverride?: string
  aiNoteOverride?: string
  homeLogoUrl?: string
  awayLogoUrl?: string
  isExpanded?: boolean
  onToggleDetails?: () => void
  detailsContent?: React.ReactNode
  completed?: boolean
}

export const LavaGameCard: React.FC<LavaProps> = ({
  venue = 'Texas Stadium',
  weather = 'partial-rain',
  weatherData,
  showTeams = true,
  watermark = true,
  home,
  away,
  totalOU,
  backgroundOverride,
  disableBackground = false,
  disableShineOverlay = false,
  iconOverride,
  aiNoteOverride,
  homeLogoUrl,
  awayLogoUrl,
  isExpanded = false,
  onToggleDetails,
  detailsContent,
  completed = false
}) => {
  const backgroundImageUrl = backgroundOverride || resolveBackgroundForVenue(venue, weather)
  const backgroundCssUrl = backgroundImageUrl ? `url("${encodeURI(backgroundImageUrl)}")` : ''
  return (
    <>
      <style jsx global>{`
        @keyframes lavaFloat {
          0%, 100% { transform: translateY(0px) translateZ(20px) rotate(0deg); }
          33% { transform: translateY(-4px) translateZ(25px) rotate(1deg); }
          66% { transform: translateY(-2px) translateZ(22px) rotate(-0.5deg); }
        }
        
        @keyframes cloudMorph {
          0%, 100% { border-radius: 25px 25px 20px 15px; transform: translateZ(10px) scale(1); }
          50% { border-radius: 30px 20px 25px 20px; transform: translateZ(12px) scale(1.02); }
        }
        
        @keyframes sunPulse {
          0%, 100% { transform: translateZ(15px) scale(1); }
          50% { transform: translateZ(18px) scale(1.05); }
        }
        
        @keyframes sunRaysRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes logoMorph {
          0%, 100% { border-radius: 45% 55% 40% 60%; }
          25% { border-radius: 55% 45% 60% 40%; }
          50% { border-radius: 40% 60% 45% 55%; }
          75% { border-radius: 60% 40% 55% 45%; }
        }
        
        @keyframes cardMorph {
          0%, 100% { border-radius: 20px 22px 18px 24px; }
          25% { border-radius: 22px 18px 24px 20px; }
          50% { border-radius: 18px 24px 20px 22px; }
          75% { border-radius: 24px 20px 22px 18px; }
        }
        
        @keyframes shineEffect {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
      
      <div style={{
        width: '700px',
        height: 'auto',
        position: 'relative',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        margin: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Main Card with Lava Morphing */}
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          
          /* Lava Background Layers */
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%),
            linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 40%),
            linear-gradient(315deg, rgba(0,0,0,0.05) 0%, transparent 60%),
            linear-gradient(45deg, #fefefe 0%, #f0f9ff 100%)
          `,
          
          /* More rectangular for mobile-first design */
          borderRadius: '12px',
          
          /* Advanced Shadows */
          boxShadow: `
            0 12px 28px rgba(17,24,39,0.15),
            0 4px 10px rgba(17,24,39,0.08),
            0 1px 0 rgba(255,255,255,0.85) inset,
            0 -1px 0 rgba(0,0,0,0.06) inset
          `,
          
          /* Performance */
          willChange: 'transform',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'perspective(1200px) rotateX(8deg) rotateY(-5deg) translateZ(30px) scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
        }}>
          
          {/* Background image from template resolver */}
          {!disableBackground && backgroundImageUrl && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: backgroundCssUrl,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              pointerEvents: 'none'
            }} />
          )}

          {/* Large translucent watermark of the weather icon with bottom bleed */}
          {watermark && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 18,
              backgroundImage: `url(${resolveIconForWeather(weather)})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center 88%',
              backgroundSize: '110% auto',
              opacity: 0.2,
              WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)',
              pointerEvents: 'none'
            }} />
          )}

          {/* Shine Effect Overlay */}
          {!disableShineOverlay && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              transform: 'skewX(-20deg)',
              pointerEvents: 'none',
              zIndex: 10,
              animation: 'shineEffect 8s ease-in-out infinite'
            }} />
          )}
          

          {/* Content Section */}
          <div style={{
            padding: '16px 32px 12px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            zIndex: 5,
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset'
          }}>
            {/* Top Row: Weather image (top-left) + Stadium (right) */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* Absolute weather icon image in upper-left (picked by weather) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  width: '78px',
                  height: '78px',
                  WebkitMaskImage: 'radial-gradient(72% 62% at 46% 52%, black 92%, transparent 100%)',
                  maskImage: 'radial-gradient(72% 62% at 46% 52%, black 92%, transparent 100%)'
                }}
              >
                <img
                  src={iconOverride || resolveIconForWeather(weather)}
                  alt="Weather"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))'
                  }}
                />
              </div>

              {/* Weather Data Display - to the right of the weather icon */}
              {weatherData && (
                <div style={{
                  marginLeft: '85px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1e293b',
                    lineHeight: '1.1'
                  }}>
                    {Math.round(weatherData.temperature || 0)}°C
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {weatherData.condition || 'Unknown'}
                  </div>
                  {weatherData.feelsLike && (
                    <div style={{
                      fontSize: '9px',
                      color: '#94a3b8',
                      fontWeight: '500'
                    }}>
                      Feels {Math.round(weatherData.feelsLike)}°C
                    </div>
                  )}
                </div>
              )}

              <div style={{
                marginLeft: weatherData ? '50px' : '80px',
                flex: 1
              }} />
              <div style={{
                textAlign: 'right',
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {venue}
              </div>
            </div>
          
            {/* Main Team Matchup Row */}
            {showTeams && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginTop: '16px'
            }}>
              {/* Away Side */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '12px'
              }}>
                <LavaTeamEmblem
                  src={awayLogoUrl || (function(){
                    const map: Record<string,string> = {
                      'Alabama': 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
                      'Georgia': 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
                      'Florida': 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
                      'Texas': 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
                    };
                    return map[away.name] || 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
                  })()}
                  alt={`${away.name} logo`}
                  size={72}
                  variant="glass"
                />
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {away.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    {away.record} • ATS {away.ats}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {away.last5.map((r, i) => (
                      <div key={i} style={{
                        width: '14px', height: '14px', borderRadius: '3px',
                        background: r === 'W' ? '#10b981' : '#ef4444',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Away Spread/Score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#dc2626'
                }}>
                  {completed && away.score !== undefined ? away.score : (away.spread > 0 ? `+${away.spread}` : `${away.spread}`)}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#64748b',
                  fontWeight: '600'
                }}>
                  {completed ? 'SCORE' : 'SPREAD'}
                </div>
              </div>

              {/* Center Total */}
              <div style={{
                textAlign: 'center',
                background: '#f1f5f9',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  fontSize: '10px',
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  TOTAL O/U
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  {totalOU}
                </div>
              </div>

              {/* Home Spread/Score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#059669'
                }}>
                  {completed && home.score !== undefined ? home.score : (home.spread > 0 ? `+${home.spread}` : `${home.spread}`)}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#64748b',
                  fontWeight: '600'
                }}>
                  {completed ? 'SCORE' : 'SPREAD'}
                </div>
              </div>

              {/* Home Side */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {home.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    {home.record} • ATS {home.ats}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    {home.last5.map((r, i) => (
                      <div key={i} style={{
                        width: '14px', height: '14px', borderRadius: '3px',
                        background: r === 'W' ? '#10b981' : '#ef4444',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }} />
                    ))}
                  </div>
                </div>
                <LavaTeamEmblem
                  src={homeLogoUrl || (function(){
                    const map: Record<string,string> = {
                      'Alabama': 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
                      'Georgia': 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
                      'Florida': 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
                      'Texas': 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
                    };
                    return map[home.name] || 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
                  })()}
                  alt={`${home.name} logo`}
                  size={72}
                  variant="glass"
                />
              </div>
            </div>
            )}

            {/* AI Recommendation Bar */}
            <div style={{
              background: 'linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)',
              border: '1px solid #60a5fa',
              borderRadius: '8px',
              padding: '12px 16px',
              marginTop: '28px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1e40af'
                }}>
                  AI RECOMMENDATION: STRONG BUY
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  87% confidence
                </div>
              </div>
              <div style={{
                fontSize: '13px',
                color: '#374151'
              }}>
                {aiNoteOverride || 'Rain expected (4.5% chance) - favors under'}
              </div>
            </div>
          
            {/* Bottom Action Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '10px',
              paddingBottom: '4px',
              borderTop: '1px solid #e2e8f0',
              marginTop: '8px'
            }}>
              <button style={{
                background: 'linear-gradient(180deg, #f97316 0%, #ea580c 55%, #dc2626 100%)',
                border: '1px solid rgba(234,88,12,0.9)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.2px',
                padding: '12px 22px',
                cursor: 'pointer',
                boxShadow: '0 10px 22px rgba(234,88,12,0.35), 0 4px 8px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.12) inset',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 14px 26px rgba(234,88,12,0.42), 0 6px 10px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.5) inset, 0 -1px 0 rgba(0,0,0,0.12) inset'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(234,88,12,0.35), 0 4px 8px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.12) inset'
              }}
              onClick={() => { if (onToggleDetails) onToggleDetails() }}>
                View Matchup
              </button>
              
              <div style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center'
              }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Consensus
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Expert Picks
                  </button>
                  <div style={{
                    background: '#dc2626',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    1
                  </div>
                </div>
                
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Line Moves <span>↗</span>
                </button>
              </div>
            </div>

            {/* Collapsible Details Tray */}
            {detailsContent !== undefined && (
              <div style={{
                overflow: 'hidden',
                transition: 'max-height 300ms ease, opacity 220ms ease, transform 220ms ease',
                maxHeight: isExpanded ? '480px' : '0px',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0px)' : 'translateY(-6px)'
              }}>
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.06)'
                }}>
                  {detailsContent}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}