'use client'

import React, { useState, useEffect } from 'react'

/**
 * 🌤️ Weather Radar Widget
 * 
 * Professional broadcast-quality weather display:
 * - Game location weather conditions
 * - Radar-style color schemes
 * - Impact assessment for betting
 * - Real-time weather updates
 */

interface WeatherData {
  location: string
  game: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  visibility: number
  impact: 'high' | 'medium' | 'low' | 'none'
  lastUpdated: string
}

// Mock weather data - In production, this would come from your weather API
const mockWeatherData: WeatherData[] = [
  {
    location: 'Ann Arbor, MI',
    game: 'Ohio State @ Michigan',
    temperature: 28,
    condition: 'Snow Showers',
    humidity: 78,
    windSpeed: 12,
    windDirection: 'NW',
    precipitation: 75,
    visibility: 2.5,
    impact: 'high',
    lastUpdated: '2 min ago'
  },
  {
    location: 'Athens, GA',
    game: 'Alabama @ Georgia',
    temperature: 45,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    windDirection: 'SW',
    precipitation: 10,
    visibility: 10,
    impact: 'low',
    lastUpdated: '5 min ago'
  },
  {
    location: 'Dallas, TX',
    game: 'Texas @ Oklahoma',
    temperature: 72,
    condition: 'Clear',
    humidity: 42,
    windSpeed: 5,
    windDirection: 'S',
    precipitation: 0,
    visibility: 10,
    impact: 'none',
    lastUpdated: '3 min ago'
  }
]

export const WeatherRadarWidget: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState(0)
  const [weatherData, setWeatherData] = useState<WeatherData[]>(mockWeatherData)

  const currentWeather = weatherData[selectedGame]

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => prev.map(weather => ({
        ...weather,
        temperature: weather.temperature + (Math.random() > 0.5 ? 1 : -1),
        windSpeed: Math.max(0, weather.windSpeed + (Math.random() > 0.5 ? 1 : -1)),
        lastUpdated: 'Just now'
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getConditionIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('snow')) return '🌨️'
    if (lowerCondition.includes('rain')) return '🌧️'
    if (lowerCondition.includes('cloud')) return '☁️'
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️'
    if (lowerCondition.includes('fog')) return '🌫️'
    return '🌤️'
  }

  const getImpactColor = (impact: WeatherData['impact']) => {
    switch (impact) {
      case 'high': return 'var(--led-red)'
      case 'medium': return 'var(--led-amber)'
      case 'low': return 'var(--led-blue)'
      case 'none': return 'var(--led-green)'
    }
  }

  const getImpactText = (impact: WeatherData['impact']) => {
    switch (impact) {
      case 'high': return 'High Impact'
      case 'medium': return 'Moderate Impact'
      case 'low': return 'Low Impact'
      case 'none': return 'No Impact'
    }
  }

  const getPrecipitationIntensity = (precipitation: number) => {
    if (precipitation >= 80) return 'Heavy'
    if (precipitation >= 50) return 'Moderate'
    if (precipitation >= 20) return 'Light'
    return 'None'
  }

  const getPrecipitationColor = (precipitation: number) => {
    if (precipitation >= 80) return '#F44336'  // Extreme (Red)
    if (precipitation >= 60) return '#FF9800'  // Very Heavy (Orange)
    if (precipitation >= 40) return '#FFEB3B'  // Heavy (Yellow)
    if (precipitation >= 20) return '#4CAF50'  // Moderate (Green)
    if (precipitation > 0) return '#00E5FF'    // Light (Light Blue)
    return 'transparent'
  }

  return (
    <div className="weather-radar-widget">
      {/* Widget Header */}
      <div className="widget-header">
        <h3 className="widget-title">Game Weather</h3>
        <div className="radar-indicator">
          <span className="radar-sweep" />
          RADAR
        </div>
      </div>

      {/* Game Selector */}
      <div className="game-selector">
        {weatherData.map((weather, index) => (
          <button
            key={index}
            className={`game-button ${index === selectedGame ? 'active' : ''}`}
            onClick={() => setSelectedGame(index)}
          >
            {weather.game.split('@')[0].trim()}
          </button>
        ))}
      </div>

      {/* Current Weather Display */}
      <div className="weather-display">
        {/* Main Temperature */}
        <div className="temperature-section">
          <div className="condition-icon">
            {getConditionIcon(currentWeather.condition)}
          </div>
          <div className="temperature-display">
            <div className="temperature">{currentWeather.temperature}°F</div>
            <div className="condition">{currentWeather.condition}</div>
          </div>
          <div className="impact-indicator" style={{ color: getImpactColor(currentWeather.impact) }}>
            {getImpactText(currentWeather.impact)}
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="weather-details">
          {/* Wind */}
          <div className="weather-metric">
            <div className="metric-icon">💨</div>
            <div className="metric-info">
              <div className="metric-label">Wind</div>
              <div className="metric-value">
                {currentWeather.windSpeed} mph {currentWeather.windDirection}
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="weather-metric">
            <div className="metric-icon">💧</div>
            <div className="metric-info">
              <div className="metric-label">Humidity</div>
              <div className="metric-value">{currentWeather.humidity}%</div>
            </div>
          </div>

          {/* Precipitation */}
          <div className="weather-metric">
            <div className="metric-icon">☔</div>
            <div className="metric-info">
              <div className="metric-label">Precipitation</div>
              <div className="metric-value">
                {getPrecipitationIntensity(currentWeather.precipitation)}
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="weather-metric">
            <div className="metric-icon">👁️</div>
            <div className="metric-info">
              <div className="metric-label">Visibility</div>
              <div className="metric-value">{currentWeather.visibility} mi</div>
            </div>
          </div>
        </div>

        {/* Precipitation Bar */}
        <div className="precipitation-bar">
          <div className="bar-label">Precipitation Intensity</div>
          <div className="bar-container">
            <div 
              className="bar-fill" 
              style={{ 
                width: `${currentWeather.precipitation}%`,
                backgroundColor: getPrecipitationColor(currentWeather.precipitation)
              }}
            />
          </div>
          <div className="bar-percentage">{currentWeather.precipitation}%</div>
        </div>

        {/* Location and Update Info */}
        <div className="weather-footer">
          <div className="location">📍 {currentWeather.location}</div>
          <div className="last-updated">Updated: {currentWeather.lastUpdated}</div>
        </div>
      </div>

      <style jsx>{`
        .weather-radar-widget {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .widget-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0;
          font-family: 'SF Pro Display', system-ui, sans-serif;
        }

        .radar-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--led-green);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .radar-sweep {
          width: 12px;
          height: 12px;
          border: 2px solid var(--led-green);
          border-radius: 50%;
          border-top-color: transparent;
          animation: radar-sweep 2s linear infinite;
        }

        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .game-selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .game-button {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .game-button.active {
          background: var(--led-blue);
          border-color: var(--led-blue);
          color: white;
          transform: translateY(-1px);
        }

        .game-button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.2);
        }

        .weather-display {
          space-y: 1rem;
        }

        .temperature-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .condition-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .temperature-display {
          flex: 1;
        }

        .temperature {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--led-white);
          font-family: 'SF Mono', Monaco, monospace;
          text-shadow: 0 0 15px currentColor;
          line-height: 1;
        }

        .condition {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .impact-indicator {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-shadow: 0 0 8px currentColor;
          font-family: 'SF Mono', Monaco, monospace;
        }

        .weather-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .weather-metric {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric-icon {
          font-size: 1.25rem;
        }

        .metric-info {
          flex: 1;
        }

        .metric-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 0.875rem;
          color: white;
          font-weight: 600;
          font-family: 'SF Mono', Monaco, monospace;
        }

        .precipitation-bar {
          margin-bottom: 1.25rem;
        }

        .bar-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .bar-container {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          margin-bottom: 0.5rem;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 4px;
        }

        .bar-percentage {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'SF Mono', Monaco, monospace;
          text-align: center;
        }

        .weather-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .location {
          font-size: 0.875rem;
          color: var(--vegas-gold);
          font-weight: 500;
        }

        .last-updated {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'SF Mono', Monaco, monospace;
        }

        @media (max-width: 768px) {
          .weather-details {
            grid-template-columns: 1fr;
          }

          .temperature-section {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .weather-footer {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .radar-sweep {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}