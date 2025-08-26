export type WeatherCondition = 'sunny-beach' | 'sunny-cold' | 'partial-rain' | 'sunny-beach-cities'

export function resolveBackgroundForVenue(venue: string | undefined, weather: WeatherCondition = 'sunny-beach'): string {
  const isMichigan = (venue || '').toLowerCase().includes('michigan') || (venue || '').toLowerCase().includes('ann arbor')
  const base = isMichigan ? '/backgrounds/michigan' : '/backgrounds/generic'
  switch (weather) {
    case 'sunny-beach':
      return `${base}/sunny-beach.png`
    case 'sunny-cold':
      return `${base}/sunny-cold.png`
    case 'partial-rain':
      // For partial rain, use a clean white base (no vector background)
      return ''
    case 'sunny-beach-cities':
      return `${base}/sunny-beach-cities.png`
    default:
      return `${base}/sunny-beach.png`
  }
}

export function resolveIconForWeather(weather: WeatherCondition = 'sunny-beach'): string {
  // Use same assets for the watermark/icon to keep it simple
  switch (weather) {
    case 'sunny-beach':
      return '/backgrounds/generic/sunny-beach.png'
    case 'sunny-cold':
      return '/backgrounds/generic/sunny-cold.png'
    case 'partial-rain':
      return '/backgrounds/generic/partial-rain.png'
    case 'sunny-beach-cities':
      return '/backgrounds/generic/sunny-beach-cities.png'
    default:
      return '/backgrounds/generic/sunny-beach.png'
  }
}
