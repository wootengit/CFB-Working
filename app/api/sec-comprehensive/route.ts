// 🏈 SEC COMPREHENSIVE API ROUTE
// Serves all MIT research data fields for SEC teams

import { NextRequest, NextResponse } from 'next/server';
import { loadComprehensiveSECData, verifyTeamLogos, SEC_TEAMS } from '@/lib/cfbd-comprehensive-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const test = searchParams.get('test');
  const logos = searchParams.get('logos');
  
  try {
    console.log('🏈 SEC Comprehensive API called');
    
    // Logo verification mode
    if (logos === 'verify') {
      console.log('🖼️ Verifying team logos...');
      const logoResults = await verifyTeamLogos();
      
      return NextResponse.json({
        success: true,
        type: 'logo_verification',
        data: logoResults,
        summary: {
          total: logoResults.length,
          working: logoResults.filter(l => l.working).length,
          broken: logoResults.filter(l => !l.working).length
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Test mode - returns sample data quickly
    if (test === 'true') {
      console.log('🧪 Test mode - returning sample data');
      return NextResponse.json({
        success: true,
        type: 'test_data',
        data: SEC_TEAMS.slice(0, 3).map(team => ({
          team: team.name,
          teamId: team.id,
          logo: team.logo,
          conference: 'SEC',
          wins: Math.floor(Math.random() * 10) + 2,
          losses: Math.floor(Math.random() * 4),
          spPlusOverall: Math.round((Math.random() * 40 - 20) * 10) / 10,
          explosiveness: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
          efficiency: Math.round((Math.random() * 0.5 + 0.3) * 100) / 100,
          ppaOverall: Math.round((Math.random() * 0.4 - 0.2) * 100) / 100,
          fpiRating: Math.round((Math.random() * 30 - 15) * 10) / 10,
          atsPercentage: Math.floor(Math.random() * 40) + 30
        })),
        message: 'Test data generated successfully',
        timestamp: new Date().toISOString()
      });
    }
    
    // Full comprehensive data load
    console.log('🚀 Loading comprehensive SEC data...');
    const startTime = Date.now();
    
    const comprehensiveData = await loadComprehensiveSECData();
    
    const loadTime = Date.now() - startTime;
    console.log(`✅ SEC data loaded in ${loadTime}ms`);
    
    // Data quality check
    const dataQuality = {
      totalTeams: comprehensiveData.length,
      teamsWithLogos: comprehensiveData.filter(t => t.logo).length,
      teamsWithSPPlus: comprehensiveData.filter(t => t.spPlusOverall !== undefined).length,
      teamsWithPPA: comprehensiveData.filter(t => t.ppaOverall !== undefined).length,
      teamsWithExplosiveness: comprehensiveData.filter(t => t.explosiveness !== undefined).length,
      avgWins: Math.round(comprehensiveData.reduce((sum, t) => sum + (t.wins || 0), 0) / comprehensiveData.length * 10) / 10,
      avgSPPlus: Math.round(comprehensiveData
        .filter(t => t.spPlusOverall !== undefined)
        .reduce((sum, t) => sum + (t.spPlusOverall || 0), 0) / comprehensiveData.length * 10) / 10
    };
    
    return NextResponse.json({
      success: true,
      type: 'comprehensive_data',
      data: comprehensiveData,
      metadata: {
        loadTime: `${loadTime}ms`,
        dataQuality,
        fields: {
          basic: ['team', 'teamId', 'logo', 'conference', 'wins', 'losses', 'winPct'],
          mitTier1: ['spPlusOverall', 'spPlusOffense', 'spPlusDefense', 'explosiveness', 'efficiency', 'ppaOverall', 'ppaOffense', 'ppaDefense'],
          mitTier2: ['fpiRating', 'sosRank', 'talentRank'],
          betting: ['atsPercentage', 'overPercentage', 'coverMarginAvg']
        },
        notes: [
          'SP+ Overall Rating: Primary predictor with 86% accuracy',
          'Explosiveness: 86% win rate when superior',
          'PPA: Neural network-based predictions',
          'All fields optimized for LLM game prediction'
        ]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ SEC Comprehensive API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle CORS for development
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}