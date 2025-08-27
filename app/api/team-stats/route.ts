// Team Stats API Route
// Comprehensive team statistics for offense, defense, and betting
// Route: /api/team-stats

import { NextRequest, NextResponse } from 'next/server';
import { fetchComprehensiveTeamStats } from '@/lib/cfbd-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || '2024');
  const conference = searchParams.get('conference');
  const division = searchParams.get('division');

  try {
    console.log(`🏈 Team stats API called - Year: ${year}, Conference: ${conference || 'All'}`);

    // Fetch comprehensive team stats
    const response = await fetchComprehensiveTeamStats(year);

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

    // Filter by conference if requested
    let filteredData = response.data;
    if (conference && conference !== 'All') {
      filteredData = response.data.filter((team: any) => 
        team.conference?.toLowerCase().includes(conference.toLowerCase())
      );
    }

    // Filter by division if requested (FBS/FCS)
    if (division) {
      filteredData = filteredData.filter((team: any) => 
        team.division?.toLowerCase() === division.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      metadata: {
        year,
        totalTeams: filteredData.length,
        conference: conference || 'All',
        division: division || 'All',
        lastUpdated: new Date().toISOString(),
        statsCategories: {
          offense: ['yardsPerGame', 'rushingYardsPerGame', 'passingYardsPerGame', 'pointsPerGame', 'thirdDownPct'],
          defense: ['yardsAllowedPerGame', 'sacks', 'pointsAllowedPerGame', 'thirdDownDefensePct'],
          betting: ['atsPercentage', 'overPercentage', 'favoriteATSPct', 'dogATSPct'],
          advanced: ['spPlusRating', 'offensePPA', 'defensePPA', 'explosiveness', 'efficiency']
        }
      }
    });

  } catch (error) {
    console.error('Team stats API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch team statistics',
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