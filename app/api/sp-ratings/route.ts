// SP+ Ratings API Route
// Primary Predictor with 72-86% Win Correlation
// Route: /api/sp-ratings

import { NextRequest, NextResponse } from 'next/server';
import { fetchSPRatings } from '@/lib/cfbd-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || '2024');

  try {
    console.log(`🎯 SP+ Ratings API called for year: ${year}`);

    const response = await fetchSPRatings(year);

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

    return NextResponse.json({
      success: true,
      data: response.data,
      metadata: {
        year,
        totalTeams: response.data.length,
        description: 'SP+ Ratings - Primary predictor with 72-86% win correlation',
        source: 'College Football Data API',
        lastUpdated: new Date().toISOString(),
        researchBasis: 'MIT research shows SP+ as strongest single predictor',
        correlationRate: '72-86%'
      }
    });

  } catch (error) {
    console.error('SP+ Ratings API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch SP+ ratings',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    );
  }
}

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