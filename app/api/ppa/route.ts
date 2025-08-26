// PPA (Predicted Points Added) API Route
// Neural Network Based Predictions - HIGH VALUE
// Route: /api/ppa

import { NextRequest, NextResponse } from 'next/server';
import { fetchPPAData } from '@/lib/cfbd-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || '2024');

  try {
    console.log(`🧠 PPA Data API called for year: ${year}`);

    const response = await fetchPPAData(year);

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
        description: 'PPA (Predicted Points Added) - Neural network based predictions',
        source: 'College Football Data API',
        lastUpdated: new Date().toISOString(),
        researchBasis: 'MIT research identifies PPA as high-value predictive metric',
        predictionModel: 'Neural network based point predictions per play'
      }
    });

  } catch (error) {
    console.error('PPA Data API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch PPA data',
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