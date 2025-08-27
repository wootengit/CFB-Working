'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/dashboard')
  }, [])

  return (
    <div style={{
      minHeight: '100vh', 
      backgroundColor: '#000000', 
      color: '#00ff00', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '18px'
    }}>
      Loading Premium Dashboard...
    </div>
  )
}
