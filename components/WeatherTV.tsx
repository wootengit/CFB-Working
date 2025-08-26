/**
 * 🌩️ Professional US Saturday Weather Forecast TV Component
 * ESPN/CNN Style Weather Broadcast for College Football
 */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Wind,
  Thermometer,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  Zap
} from 'lucide-react'

interface WeatherZone {
  id: string
  name: string
  coordinates: { x: number; y: number }
  condition: 'severe' | 'moderate' | 'good'
  temperature: number
  windSpeed: number
  precipitation: number
  icon: string
  description: string
  gameImpact: 'high' | 'medium' | 'low'
}

interface StadiumAlert {
  stadium: string
  location: string
  team: string
  condition: string
  temperature: number
  windSpeed: number
  impact: 'high' | 'medium' | 'low'
  gameTime: string
}

interface WeatherTVProps {
  className?: string
  autoUpdate?: boolean
}

const WeatherTV: React.FC<WeatherTVProps> = ({ 
  className = "", 
  autoUpdate = true 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)

  // Mock weather data - structured for future Mateo MCP server integration
  const weatherZones = useMemo<WeatherZone[]>(() => [
    {
      id: 'northeast',
      name: 'Northeast',
      coordinates: { x: 85, y: 20 },
      condition: 'good',
      temperature: 68,
      windSpeed: 8,
      precipitation: 0,
      icon: 'sun',
      description: 'Partly Cloudy',
      gameImpact: 'low'
    },
    {
      id: 'southeast',
      name: 'Southeast',
      coordinates: { x: 75, y: 55 },
      condition: 'severe',
      temperature: 87,
      windSpeed: 25,
      precipitation: 85,
      icon: 'storm',
      description: 'Severe Thunderstorms',
      gameImpact: 'high'
    },
    {
      id: 'midwest',
      name: 'Midwest',
      coordinates: { x: 55, y: 35 },
      condition: 'moderate',
      temperature: 72,
      windSpeed: 15,
      precipitation: 40,
      icon: 'rain',
      description: 'Light Showers',
      gameImpact: 'medium'
    },
    {
      id: 'southwest',
      name: 'Southwest',
      coordinates: { x: 35, y: 65 },
      condition: 'good',
      temperature: 95,
      windSpeed: 5,
      precipitation: 0,
      icon: 'sun',
      description: 'Hot & Sunny',
      gameImpact: 'low'
    },
    {
      id: 'northwest',
      name: 'Northwest',
      coordinates: { x: 25, y: 25 },
      condition: 'moderate',
      temperature: 55,
      windSpeed: 20,
      precipitation: 60,
      icon: 'rain',
      description: 'Steady Rain',
      gameImpact: 'medium'
    },
    {
      id: 'plains',
      name: 'Great Plains',
      coordinates: { x: 45, y: 50 },
      condition: 'severe',
      temperature: 78,
      windSpeed: 35,
      precipitation: 70,
      icon: 'storm',
      description: 'Tornado Watch',
      gameImpact: 'high'
    }
  ], [])

  const stadiumAlerts = useMemo<StadiumAlert[]>(() => [
    {
      stadium: 'Tiger Stadium',
      location: 'Baton Rouge, LA',
      team: 'LSU',
      condition: 'Severe Thunderstorms',
      temperature: 89,
      windSpeed: 28,
      impact: 'high',
      gameTime: '7:00 PM CT'
    },
    {
      stadium: 'Neyland Stadium',
      location: 'Knoxville, TN',
      team: 'Tennessee',
      condition: 'Heavy Rain',
      temperature: 75,
      windSpeed: 18,
      impact: 'high',
      gameTime: '3:30 PM ET'
    },
    {
      stadium: 'Memorial Stadium',
      location: 'Lincoln, NE',
      team: 'Nebraska',
      condition: 'High Winds',
      temperature: 68,
      windSpeed: 32,
      impact: 'medium',
      gameTime: '12:00 PM CT'
    },
    {
      stadium: 'Kyle Field',
      location: 'College Station, TX',
      team: 'Texas A&M',
      condition: 'Extreme Heat',
      temperature: 98,
      windSpeed: 8,
      impact: 'medium',
      gameTime: '6:00 PM CT'
    },
    {
      stadium: 'Autzen Stadium',
      location: 'Eugene, OR',
      team: 'Oregon',
      condition: 'Light Rain',
      temperature: 58,
      windSpeed: 15,
      impact: 'low',
      gameTime: '10:30 PM ET'
    }
  ], [])

  // Auto-update time
  useEffect(() => {
    if (autoUpdate) {
      const interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoUpdate])

  const getWeatherIcon = (iconType: string, size = 'w-6 h-6') => {
    const iconClass = `${size} text-white`
    switch (iconType) {
      case 'sun':
        return <Sun className={iconClass} />
      case 'rain':
        return <CloudRain className={iconClass} />
      case 'storm':
        return <Zap className={iconClass} />
      case 'snow':
        return <CloudSnow className={iconClass} />
      case 'wind':
        return <Wind className={iconClass} />
      default:
        return <Cloud className={iconClass} />
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'severe':
        return 'bg-red-600 border-red-500'
      case 'moderate':
        return 'bg-yellow-600 border-yellow-500'
      case 'good':
        return 'bg-green-600 border-green-500'
      default:
        return 'bg-gray-600 border-gray-500'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white min-h-screen ${className}`}>
      {/* TV Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-4 border-b-2 border-blue-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              LIVE
            </div>
            <h1 className="text-3xl font-bold tracking-wide">
              SATURDAY CFB WEATHER CENTER
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
            <div className="text-sm text-blue-200">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
        {/* Main Weather Map */}
        <div className="xl:col-span-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 border-b border-gray-600">
            <h2 className="text-xl font-bold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              US Weather Impact Map - Saturday Game Day
            </h2>
          </div>
          
          {/* Weather Map */}
          <div className="relative p-6 bg-gradient-to-br from-blue-950 to-gray-900 min-h-96">
            {/* US Map Outline (Simplified SVG) */}
            <svg 
              viewBox="0 0 100 60" 
              className="w-full h-full absolute inset-0 opacity-20"
              fill="none" 
              stroke="white" 
              strokeWidth="0.5"
            >
              {/* Simplified US outline */}
              <path d="M10,50 L15,45 L20,25 L25,20 L35,15 L50,20 L70,15 L85,20 L90,30 L88,45 L85,55 L70,58 L50,55 L35,58 L20,55 L10,50 Z" />
              <path d="M15,45 L25,40 L35,45 L45,40 L55,45 L65,40 L75,45 L80,50" />
            </svg>

            {/* Weather Zones */}
            {weatherZones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                  selectedZone === zone.id ? 'scale-125 z-10' : ''
                }`}
                style={{ 
                  left: `${zone.coordinates.x}%`, 
                  top: `${zone.coordinates.y}%` 
                }}
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
              >
                <div className={`rounded-full border-2 p-3 ${getConditionColor(zone.condition)} shadow-lg backdrop-blur-sm`}>
                  {getWeatherIcon(zone.icon, 'w-8 h-8')}
                </div>
                
                {/* Zone Info Tooltip */}
                {selectedZone === zone.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black bg-opacity-90 rounded-lg p-3 text-sm min-w-48 border border-gray-600 animate-fade-in z-20">
                    <div className="font-bold text-lg mb-1">{zone.name}</div>
                    <div className="text-gray-300 mb-2">{zone.description}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <Thermometer className="w-3 h-3 mr-1" />
                        {zone.temperature}°F
                      </div>
                      <div className="flex items-center">
                        <Wind className="w-3 h-3 mr-1" />
                        {zone.windSpeed} mph
                      </div>
                      <div className="flex items-center col-span-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Game Impact: <span className={`ml-1 font-bold ${getImpactColor(zone.gameImpact)}`}>
                          {zone.gameImpact.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weather Legend */}
          <div className="bg-gray-800 px-4 py-3 border-t border-gray-600">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Weather Conditions:</span>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span>Severe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span>Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Detailed Forecasts */}
        <div className="space-y-6">
          {/* National Summary */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 border-b border-gray-600">
              <h3 className="font-bold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                National Summary
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-3">
                <div className="text-red-400 font-bold text-sm mb-1">SEVERE WEATHER ALERT</div>
                <div className="text-sm">Strong storms affecting Southeast and Plains regions. Game delays possible.</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-xl font-bold text-green-400">4</div>
                  <div className="text-gray-300">Games Clear</div>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-xl font-bold text-red-400">3</div>
                  <div className="text-gray-300">At Risk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Breakdown */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 border-b border-gray-600">
              <h3 className="font-bold">Regional Conditions</h3>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {weatherZones.map((zone) => (
                <div key={zone.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                     onClick={() => setSelectedZone(zone.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm">{zone.name}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${getConditionColor(zone.condition)}`}>
                      {zone.condition.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>{zone.description}</span>
                    <span>{zone.temperature}°F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Outlook */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 border-b border-gray-600">
              <h3 className="font-bold flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Saturday Timeline
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {['12:00 PM', '3:30 PM', '7:00 PM', '10:30 PM'].map((time, index) => (
                <div key={time} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span className="font-semibold text-sm">{time}</span>
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(['sun', 'rain', 'storm', 'rain'][index], 'w-4 h-4')}
                    <span className="text-sm">{[72, 68, 75, 58][index]}°F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker - Stadium Alerts */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 border-t-2 border-red-500 overflow-hidden">
        <div className="bg-red-800 px-4 py-2 text-sm font-bold">
          STADIUM WEATHER ALERTS
        </div>
        <div className="relative h-16 bg-red-900">
          <div className="absolute whitespace-nowrap animate-scroll-left flex items-center h-full">
            {stadiumAlerts.map((alert, index) => (
              <div key={index} className="inline-flex items-center mx-8 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="font-bold mr-2">{alert.stadium}</span>
                <span className="mr-2">•</span>
                <span className="mr-2">{alert.location}</span>
                <span className="mr-2">•</span>
                <span className="mr-2">{alert.condition}</span>
                <span className="mr-2">•</span>
                <span className="mr-2">{alert.temperature}°F</span>
                <span className="mr-2">•</span>
                <span className="mr-2">Winds: {alert.windSpeed} mph</span>
                <span className="mr-2">•</span>
                <span className="mr-2">Kickoff: {alert.gameTime}</span>
                <span className="mr-2">•</span>
                <span className={`font-bold ${getImpactColor(alert.impact)}`}>
                  {alert.impact.toUpperCase()} IMPACT
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 45s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default WeatherTV