'use client'

import SECStandingsEnhanced from '@/components/SECStandingsEnhanced'

export default function EnhancedStandingsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F15]">
      <SECStandingsEnhanced 
        year={2024} 
        showAllTeams={false} // SEC-focused by default
      />
    </div>
  )
}