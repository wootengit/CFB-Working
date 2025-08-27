'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * 🔥 Lava-Style Navigation Card
 * 
 * Premium 3D navigation card combining:
 * - Airbnb Lava design system aesthetics
 * - Casino sportsbook LED elements
 * - Hardware-accelerated animations
 * - Accessibility-compliant interactions
 * 
 * Supports three display modes:
 * - Standard: Full-featured card with metrics
 * - Compact: Reduced size for secondary features
 * - Minimal: Text-focused for tertiary features
 */

interface LavaNavigationCardProps {
  id: string
  title: string
  description: string
  href: string
  icon: string
  color: string
  priority: number
  metrics?: { [key: string]: string }
  compact?: boolean
  minimal?: boolean
  className?: string
}

export const LavaNavigationCard: React.FC<LavaNavigationCardProps> = ({
  id,
  title,
  description,
  href,
  icon,
  color,
  metrics = {},
  compact = false,
  minimal = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Dynamic sizing based on display mode
  const cardSize = minimal ? 'minimal' : compact ? 'compact' : 'standard'

  // Color mapping for CSS custom properties
  const getColorValue = (colorVar: string) => {
    const colorMap = {
      '--led-red': '#FF2D2D',
      '--led-green': '#00FF41', 
      '--led-amber': '#FFB000',
      '--led-blue': '#2D4FFF',
      '--led-white': '#F8F8FF',
      '--vegas-gold': '#FCB131',
      '--display-blue': '#0066ff',
      '--display-green': '#00cc4d',
      '--display-red': '#ff3333'
    }
    return colorMap[colorVar as keyof typeof colorMap] || '#F8F8FF'
  }

  const primaryColor = getColorValue(color)

  if (minimal) {
    return (
      <Link href={href}>
        <div className={`lava-card-minimal ${className}`}>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-charcoal/20 hover:bg-charcoal/40 transition-all duration-200">
            <span className="text-xl">{icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-white/60">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href}>
      <div 
        className={`lava-sports-card ${cardSize} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        role="button"
        tabIndex={0}
        aria-label={`Navigate to ${title}: ${description}`}
      >
        <div className="lava-sports-card__inner">
          
          {/* Shine Effect */}
          <div className="lava-shine" />
          
          {/* Header */}
          <div className="lava-sports-card__header">
            <div className="flex items-center gap-3">
              <span className="card-icon" style={{ color: primaryColor }}>
                {icon}
              </span>
              <div>
                <h3 className="card-title">{title}</h3>
                {!compact && (
                  <p className="card-description">{description}</p>
                )}
              </div>
            </div>
            <div className="status-indicator" style={{ backgroundColor: primaryColor }}>
              LIVE
            </div>
          </div>

          {/* Metrics Display */}
          {!compact && metrics && Object.keys(metrics).length > 0 && (
            <div className="lava-sports-card__metrics">
              {Object.entries(metrics).slice(0, 2).map(([key, value]) => (
                <div key={key} className="metric-item">
                  <span className="metric-label">{key}</span>
                  <span className="metric-value" style={{ color: primaryColor }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Compact Metrics */}
          {compact && metrics && Object.keys(metrics).length > 0 && (
            <div className="compact-metrics">
              <div className="metric-compact" style={{ color: primaryColor }}>
                {Object.values(metrics)[0]}
              </div>
            </div>
          )}

          {/* Action Indicator */}
          <div className="lava-cta-indicator">
            <span className="cta-text">Explore →</span>
          </div>
        </div>

        <style jsx>{`
          .lava-sports-card {
            width: 100%;
            position: relative;
            perspective: 1200px;
            transform-style: preserve-3d;
            cursor: pointer;
          }

          .lava-sports-card.standard {
            min-height: 180px;
          }

          .lava-sports-card.compact {
            min-height: 120px;
          }

          .lava-sports-card__inner {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            border-radius: 16px 14px 18px 12px;
            background: 
              linear-gradient(135deg, 
                rgba(255,255,255,0.15) 0%, 
                transparent 40%),
              linear-gradient(225deg, 
                rgba(255,255,255,0.08) 0%, 
                transparent 30%),
              linear-gradient(315deg, 
                rgba(0,0,0,0.1) 0%, 
                transparent 60%),
              linear-gradient(45deg, 
                rgba(30, 60, 114, 0.8) 0%, 
                rgba(42, 82, 152, 0.6) 100%);
            box-shadow: 
              0 4px 8px rgba(0,0,0,0.12),
              0 8px 16px rgba(30,60,114,0.15),
              0 16px 32px rgba(30,60,114,0.08),
              0 2px 4px rgba(0,0,0,0.08);
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            overflow: hidden;
            will-change: transform;
            animation: lava-morph 15s ease-in-out infinite;
          }

          .lava-sports-card:hover .lava-sports-card__inner {
            transform: 
              perspective(1200px)
              rotateX(8deg)
              rotateY(-12deg)
              translateZ(25px)
              scale(1.02);
            box-shadow: 
              0 8px 16px rgba(0,0,0,0.16),
              0 16px 32px rgba(30,60,114,0.2),
              0 24px 48px rgba(30,60,114,0.12),
              0 4px 8px rgba(0,0,0,0.1);
          }

          .lava-sports-card.compact:hover .lava-sports-card__inner {
            transform: 
              perspective(1200px)
              rotateX(4deg)
              rotateY(-6deg)
              translateZ(15px)
              scale(1.01);
          }

          @keyframes lava-morph {
            0%, 100% { 
              border-radius: 16px 14px 18px 12px;
            }
            25% { 
              border-radius: 14px 18px 12px 16px;
            }
            50% { 
              border-radius: 18px 12px 16px 14px;
            }
            75% { 
              border-radius: 12px 16px 14px 18px;
            }
          }

          /* Shine Effect */
          .lava-shine {
            content: '';
            position: absolute;
            top: -50%;
            left: -120%;
            width: 50%;
            height: 200%;
            background: linear-gradient(45deg,
              transparent 30%,
              rgba(255,255,255,0.3) 50%,
              transparent 70%);
            transform: rotate(35deg);
            transition: left 0.8s cubic-bezier(0.23, 1, 0.32, 1);
            pointer-events: none;
            z-index: 10;
          }

          .lava-sports-card:hover .lava-shine {
            left: 120%;
          }

          /* Header */
          .lava-sports-card__header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 1rem 1.25rem 0.75rem;
            position: relative;
            z-index: 5;
          }

          .card-icon {
            font-size: 1.75rem;
            filter: drop-shadow(0 0 8px currentColor);
          }

          .card-title {
            font-family: 'SF Pro Display', system-ui, sans-serif;
            font-size: 1.125rem;
            font-weight: 600;
            color: white;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .card-description {
            font-size: 0.875rem;
            color: rgba(255,255,255,0.8);
            margin: 0.25rem 0 0 0;
            font-weight: 400;
          }

          .status-indicator {
            font-size: 0.625rem;
            font-weight: 700;
            color: black;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-family: 'SF Mono', Monaco, monospace;
          }

          /* Metrics */
          .lava-sports-card__metrics {
            display: flex;
            gap: 1rem;
            padding: 0 1.25rem;
            position: relative;
            z-index: 5;
          }

          .metric-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .metric-label {
            font-size: 0.75rem;
            color: rgba(255,255,255,0.6);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .metric-value {
            font-size: 1rem;
            font-weight: 600;
            font-family: 'SF Mono', Monaco, monospace;
            text-shadow: 0 0 8px currentColor;
          }

          .compact-metrics {
            padding: 0 1.25rem;
            position: relative;
            z-index: 5;
          }

          .metric-compact {
            font-size: 1.25rem;
            font-weight: 700;
            font-family: 'SF Mono', Monaco, monospace;
            text-shadow: 0 0 8px currentColor;
          }

          /* CTA Indicator */
          .lava-cta-indicator {
            position: absolute;
            bottom: 1rem;
            right: 1.25rem;
            z-index: 5;
          }

          .cta-text {
            font-size: 0.875rem;
            color: rgba(255,255,255,0.7);
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .lava-sports-card:hover .cta-text {
            opacity: 1;
          }

          /* Accessibility */
          .lava-sports-card:focus {
            outline: 2px solid var(--led-blue);
            outline-offset: 2px;
          }

          @media (prefers-reduced-motion: reduce) {
            .lava-sports-card__inner {
              animation: none;
              transition: none;
            }
            
            .lava-sports-card:hover .lava-sports-card__inner {
              transform: scale(1.01);
            }
          }

          @media (max-width: 768px) {
            .card-title {
              font-size: 1rem;
            }
            
            .card-description {
              font-size: 0.8125rem;
            }
            
            .lava-sports-card__header {
              padding: 0.875rem 1rem 0.625rem;
            }
          }
        `}</style>
      </div>
    </Link>
  )
}