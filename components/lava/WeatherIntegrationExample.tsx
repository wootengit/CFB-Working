'use client'

import React, { useState, useEffect } from 'react'
import { LavaGameCard } from './LavaGameCard'

// Example component showing how to integrate Mateo weather MCP server with LavaGameCard
export const WeatherIntegratedGameCard: React.FC<{
  venue: string
  city: string
}> = ({ venue, city }) => {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // In a real implementation, you would call the Mateo MCP server here
  // This example shows the structure of the integration
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Example: This would be replaced with actual MCP server call
        // const response = await mcp__mateo_weather__get_weather({ city })
        
        // Mock data for demonstration - replace with actual MCP call
        const mockWeatherResponse = {
          temperature: 22.73,
          condition: 'scattered clouds',
          humidity: 84,
          windSpeed: 1.54,
          feelsLike: 23.25
        }

        setWeatherData({
          temperature: mockWeatherResponse.temperature,
          condition: mockWeatherResponse.condition,
          humidity: mockWeatherResponse.humidity,
          windSpeed: mockWeatherResponse.windSpeed,
          feelsLike: mockWeatherResponse.feelsLike
        })
      } catch (error) {
        console.error('Error fetching weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [city])

  if (loading) {
    return (
      <div style={{ 
        width: '700px', 
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc',
        borderRadius: '12px',
        margin: '20px'
      }}>
        Loading weather data...
      </div>
    )
  }

  return (
    <LavaGameCard
      venue={venue}
      weatherData={weatherData}
      weather="partial-rain"
      home={{ 
        name: 'Florida', 
        abbr: 'UF', 
        record: '8-3', 
        ats: '6-5', 
        last5: ['W','W','L','W','W'], 
        spread: -7 
      }}
      away={{ 
        name: 'Georgia', 
        abbr: 'UGA', 
        record: '10-1', 
        ats: '8-3', 
        last5: ['W','W','W','W','L'], 
        spread: 7 
      }}
      totalOU={45.5}
    />
  )
}

// Usage example in a calendar or parent component:
/*
<WeatherIntegratedGameCard 
  venue="Ben Hill Griffin Stadium" 
  city="Gainesville" 
/>

// Or with direct MCP integration:
const weatherData = await mcp__mateo_weather__get_weather({ 
  parameters: { city: 'Atlanta' } 
})

<LavaGameCard
  venue="Mercedes-Benz Stadium"
  weatherData={{
    temperature: weatherData.main.temp,
    condition: weatherData.weather[0].description,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    feelsLike: weatherData.main.feels_like
  }}
/>
*/