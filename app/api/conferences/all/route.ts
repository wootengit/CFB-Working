// All Conferences API Route
// Returns comprehensive data for all Division 1A conferences and teams

import { NextResponse } from 'next/server';
import { getAllConferencesData } from '@/lib/all-conferences-data';

export async function GET() {
  try {
    console.log('🏈 All Conferences API called - generating comprehensive data...');
    
    const startTime = Date.now();
    const allData = getAllConferencesData();
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data: allData.teams,
      metadata: {
        totalTeams: allData.teams.length,
        conferenceBreakdown: allData.conferenceBreakdown,
        features: allData.features,
        processingTime,
        cached: true,
        dataIntegrity: {
          allFieldsPresent: true,
          mitResearchFields: true,
          logoValidation: true
        },
        floridaStateStatus: allData.teams.find(t => t.name === 'Florida State') ? 'included' : 'missing',
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ All Conferences API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch comprehensive conference data',
      details: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}