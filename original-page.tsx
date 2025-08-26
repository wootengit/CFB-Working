import Link from 'next/link'

export default function Home() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '2rem'}}>
      <div style={{maxWidth: '64rem', margin: '0 auto', textAlign: 'center'}}>
        <h1 style={{fontSize: '4rem', fontWeight: 'bold', marginBottom: '2rem', color: 'white'}}>CFB Match Cards</h1>
        <p style={{fontSize: '1.25rem', marginBottom: '3rem', color: '#9ca3af'}}>College Football Betting Cards with Weather Animations</p>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '2rem'}}>
          <Link href="/lava" style={{backgroundColor: '#ff5a5f', padding: '1.5rem 2rem', borderRadius: '0.5rem', fontSize: '1.25rem', color: 'white', textDecoration: 'none', display: 'block'}}>
            🌋 Lava Match Cards (NEW)
          </Link>
          <Link href="/games" style={{backgroundColor: '#7c3aed', padding: '1.5rem 2rem', borderRadius: '0.5rem', fontSize: '1.25rem', color: 'white', textDecoration: 'none', display: 'block'}}>
            🏈 View Match Cards
          </Link>
          <Link href="/standings" style={{backgroundColor: '#059669', padding: '1.5rem 2rem', borderRadius: '0.5rem', fontSize: '1.25rem', color: 'white', textDecoration: 'none', display: 'block'}}>
            📊 View Standings
          </Link>
        </div>
        
        <p style={{marginTop: '3rem', color: '#6b7280'}}>Enhanced betting cards with AI analysis and weather animations</p>
      </div>
    </div>
  )
}