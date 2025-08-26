// Enhanced Standings API Route
// MIT Research Predictive Fields Integration
// Route: /api/standings/enhanced

import { NextRequest, NextResponse } from 'next/server';
import { fetchEnhancedStandings, fetchSECStandings } from '@/lib/cfbd-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || '2024');
  const conference = searchParams.get('conference');
  const secOnly = searchParams.get('sec') === 'true';

  try {
    console.log(`📊 Enhanced standings API called - Year: ${year}, SEC Only: ${secOnly}`);

    let response;
    
    if (secOnly) {
      // SEC-specific standings with all predictive fields
      response = await fetchSECStandings(year);
    } else {
      // Full enhanced standings
      response = await fetchEnhancedStandings(year);
    }

    if (!response.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: response.message,
          data: [] 
        },
        { status: 500 }
      );
    }

    // Filter by specific conference if requested
    let filteredData = response.data;
    if (conference && !secOnly) {
      filteredData = response.data.filter(team => 
        team.conference?.toLowerCase().includes(conference.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      metadata: {
        year,
        totalTeams: filteredData.length,
        secTeams: filteredData.filter(t => t.conference === 'SEC').length,
        lastUpdated: new Date().toISOString(),
        predictiveAccuracy: response.predictiveAccuracy,
        mitResearchFields: {
          spPlusRating: 'Primary predictor (72-86% correlation)',
          explosiveness: 'Win rate 86% when superior',
          offensiveEfficiency: 'Core efficiency metric',
          defensiveEfficiency: 'Core efficiency metric',
          offensePPA: 'Neural network predictions',
          defensePPA: 'Neural network predictions'
        }
      }
    });

  } catch (error) {
    console.error('Enhanced standings API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch enhanced standings',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}