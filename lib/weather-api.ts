// Open-Meteo Weather API Integration
// Free weather API - no key required for non-commercial use

interface WeatherData {
  temperature?: number
  condition?: string
  humidity?: number
  windSpeed?: number
  feelsLike?: number
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    apparent_temperature: number
  }
}

// College football venue coordinates (major stadiums)
const VENUE_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
  // SEC Venues
  'Bryant-Denny Stadium': { lat: 33.2082, lon: -87.5467, name: 'Tuscaloosa, AL' },
  'Tiger Stadium': { lat: 30.4118, lon: -91.1837, name: 'Baton Rouge, LA' },
  'Ben Hill Griffin Stadium': { lat: 29.6499, lon: -82.3482, name: 'Gainesville, FL' },
  'Sanford Stadium': { lat: 33.9496, lon: -83.3732, name: 'Athens, GA' },
  'Kyle Field': { lat: 30.6103, lon: -96.3398, name: 'College Station, TX' },
  'Darrell K Royal Stadium': { lat: 30.2839, lon: -97.7322, name: 'Austin, TX' },
  'Gaylord Family Stadium': { lat: 35.2057, lon: -97.4426, name: 'Norman, OK' },
  
  // Big Ten Venues  
  'Ohio Stadium': { lat: 39.9984, lon: -83.0306, name: 'Columbus, OH' },
  'Michigan Stadium': { lat: 42.2658, lon: -83.7487, name: 'Ann Arbor, MI' },
  'Beaver Stadium': { lat: 40.8122, lon: -77.8562, name: 'University Park, PA' },
  'Camp Randall Stadium': { lat: 43.0705, lon: -89.4124, name: 'Madison, WI' },
  
  // ACC Venues
  'Memorial Stadium': { lat: 34.6774, lon: -82.8376, name: 'Clemson, SC' },
  'Doak Campbell Stadium': { lat: 30.4375, lon: -84.3044, name: 'Tallahassee, FL' },
  'Hard Rock Stadium': { lat: 25.9580, lon: -80.2389, name: 'Miami Gardens, FL' },
  
  // Big 12 Venues
  'Boone Pickens Stadium': { lat: 36.1217, lon: -97.0652, name: 'Stillwater, OK' },
  'McLane Stadium': { lat: 31.5513, lon: -97.1114, name: 'Waco, TX' },
  
  // Pac-12 Venues
  'Autzen Stadium': { lat: 44.0584, lon: -123.0685, name: 'Eugene, OR' },
  'Husky Stadium': { lat: 47.6509, lon: -122.3015, name: 'Seattle, WA' },
  'Los Angeles Memorial Coliseum': { lat: 34.0141, lon: -118.2879, name: 'Los Angeles, CA' },
  'Rose Bowl': { lat: 34.1611, lon: -118.1675, name: 'Pasadena, CA' },
  
  // Default fallbacks for common city names
  'Alabama': { lat: 33.2082, lon: -87.5467, name: 'Tuscaloosa, AL' },
  'Georgia': { lat: 33.9496, lon: -83.3732, name: 'Athens, GA' },
  'Florida': { lat: 29.6499, lon: -82.3482, name: 'Gainesville, FL' },
  'Texas': { lat: 30.2839, lon: -97.7322, name: 'Austin, TX' },
  'Michigan': { lat: 42.2658, lon: -83.7487, name: 'Ann Arbor, MI' },
  'Ohio State': { lat: 39.9984, lon: -83.0306, name: 'Columbus, OH' },
}

// Weather code to condition mapping (Open-Meteo WMO codes)
const WEATHER_CODES: Record<number, string> = {
  0: 'clear',
  1: 'mainly clear',
  2: 'partly cloudy', 
  3: 'overcast',
  45: 'foggy',
  48: 'rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  56: 'light freezing drizzle',
  57: 'dense freezing drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  66: 'light freezing rain',
  67: 'heavy freezing rain',
  71: 'slight snow',
  73: 'moderate snow',
  75: 'heavy snow',
  77: 'snow grains',
  80: 'slight rain showers',
  81: 'moderate rain showers',
  82: 'violent rain showers',
  85: 'slight snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with slight hail',
  99: 'thunderstorm with heavy hail'
}

// Map Open-Meteo conditions to our game card weather types
function mapToWeatherCondition(code: number): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' {
  if (code === 0 || code === 1) return 'sunny'
  if (code >= 51 && code <= 67) return 'rainy'
  if (code >= 80 && code <= 82) return 'rainy'
  if (code >= 71 && code <= 77) return 'snowy'
  if (code >= 85 && code <= 86) return 'snowy'
  if (code >= 95 && code <= 99) return 'rainy' // thunderstorms
  return 'cloudy' // default for overcast, fog, etc.
}

export async function getWeatherForVenue(venue: string): Promise<WeatherData | null> {
  try {
    // Find coordinates for venue
    const coords = VENUE_COORDINATES[venue] || 
                   Object.entries(VENUE_COORDINATES).find(([key]) => 
                     venue.toLowerCase().includes(key.toLowerCase()) ||
                     key.toLowerCase().includes(venue.toLowerCase())
                   )?.[1]
    
    if (!coords) {
      console.warn(`No coordinates found for venue: ${venue}`)
      return null
    }

    // Fetch weather from Open-Meteo API
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CFB-Calendar/1.0 (Educational Use)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`)
    }
    
    const data: OpenMeteoResponse = await response.json()
    
    return {
      temperature: Math.round(data.current.temperature_2m),
      condition: WEATHER_CODES[data.current.weather_code] || 'unknown',
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      feelsLike: Math.round(data.current.apparent_temperature)
    }
    
  } catch (error) {
    console.error('Weather API error:', error)
    return null
  }
}

export function mapWeatherToCondition(weatherData: WeatherData | null): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' {
  if (!weatherData) return 'sunny'
  
  const condition = weatherData.condition?.toLowerCase() || ''
  
  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
    return 'rainy'
  }
  if (condition.includes('snow') || condition.includes('freezing')) {
    return 'snowy'
  }
  if (condition.includes('clear') || condition.includes('sunny')) {
    return 'sunny'
  }
  if (condition.includes('wind')) {
    return 'windy'
  }
  return 'cloudy'
}

export { type WeatherData }