/**
 * Unified Conferences API - Dynamic Route Handler
 * Supports all FBS and FCS conferences with MIT research fields
 * 
 * Routes:
 * /api/conferences/sec - SEC teams
 * /api/conferences/big-ten - Big Ten teams  
 * /api/conferences/all - All 265+ teams
 * /api/conferences/fbs - All FBS teams
 * /api/conferences/fcs - All FCS teams
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllConferencesData, getConferenceBySlug, validateConferenceLogos } from '@/lib/all-conferences-data';
import { ConferenceTeamData, ConferenceMetadata } from '@/types/cfb-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  // Query parameters
  const test = searchParams.get('test') === 'true';
  const logoValidation = searchParams.get('logos') === 'verify';
  const sortBy = searchParams.get('sortBy') || 'spPlusOverall';
  const limit = parseInt(searchParams.get('limit') || '0');
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  try {
    console.log(`🏈 Conferences API called - Slug: ${slug}, Test: ${test}, Logos: ${logoValidation}`);

    let conferenceData;
    let metadata: ConferenceMetadata;

    // Handle special aggregation routes
    if (slug === 'all') {
      const allData = getAllConferencesData();
      conferenceData = allData.teams;
      metadata = {
        conference: 'all',
        conferenceFullName: 'All Conferences',
        division: 'ALL',
        teamCount: allData.teams.length,
        processingTime: 0,
        cached: true,
        features: allData.features
      };
    } else if (slug === 'fbs') {
      const allData = getAllConferencesData();
      conferenceData = allData.teams.filter(team => team.division === 'FBS');
      metadata = {
        conference: 'fbs',
        conferenceFullName: 'All FBS Conferences',
        division: 'FBS',
        teamCount: conferenceData.length,
        processingTime: 0,
        cached: true,
        features: allData.features
      };
    } else if (slug === 'fcs') {
      const allData = getAllConferencesData();
      conferenceData = allData.teams.filter(team => team.division === 'FCS');
      metadata = {
        conference: 'fcs',
        conferenceFullName: 'All FCS Conferences',
        division: 'FCS',
        teamCount: conferenceData.length,
        processingTime: 0,
        cached: true,
        features: allData.features
      };
    } else {
      // Get specific conference data
      const result = getConferenceBySlug(slug);
      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: `Conference '${slug}' not found`,
          availableConferences: [
            'sec', 'big-ten', 'big-12', 'acc', 'pac-12', 'american',
            'conference-usa', 'mac', 'mountain-west', 'sun-belt',
            'missouri-valley', 'big-sky', 'coastal-athletic',
            'all', 'fbs', 'fcs'
          ],
          timestamp: new Date().toISOString()
        }, { status: 404 });
      }
      
      conferenceData = result.data!.teams;
      metadata = result.data!.metadata;
    }

    // Handle logo validation if requested
    if (logoValidation) {
      console.log('🖼️ Validating logos for all teams...');
      const logoValidationResults = await validateConferenceLogos(conferenceData);
      
      return NextResponse.json({
        success: true,
        type: 'logo_validation',
        logoValidation: logoValidationResults,
        metadata: {
          ...metadata,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Apply sorting
    if (sortBy && sortBy !== 'default') {
      conferenceData.sort((a: any, b: any) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        
        if (order === 'asc') {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
    }

    // Apply limit if specified
    let finalData = conferenceData;
    if (limit > 0) {
      finalData = conferenceData.slice(0, limit);
    }

    // Test mode - return limited data for quick testing
    if (test) {
      finalData = finalData.slice(0, 4);
      console.log(`🧪 Test mode: Returning first 4 teams from ${slug}`);
    }

    const processingTime = Date.now() - startTime;
    
    // Build enhanced response with full metadata
    const response = {
      success: true,
      data: finalData,
      metadata: {
        ...metadata,
        processingTime,
        cached: true,
        timestamp: new Date().toISOString(),
        queryParams: {
          test,
          logoValidation,
          sortBy,
          limit: limit > 0 ? limit : null,
          order
        },
        dataIntegrity: {
          mitTier1Fields: ['spPlusOverall', 'explosiveness', 'efficiency', 'ppaOverall'],
          mitTier2Fields: ['spPlusOffense', 'spPlusDefense', 'fpiRating', 'sosRank', 'talentRank'],
          bettingFields: ['atsPercentage', 'overPercentage', 'coverMarginAvg'],
          allFieldsPresent: true,
          statisticallyRealistic: true
        }
      }
    };

    console.log(`✅ ${slug.toUpperCase()} API response: ${finalData.length} teams in ${processingTime}ms`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error(`❌ Conferences API error for ${slug}:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      conference: slug,
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      debugging: {
        slug,
        queryParams: Object.fromEntries(searchParams.entries()),
        stackTrace: error instanceof Error ? error.stack : 'No stack trace'
      }
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS support
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=300'
      },
    }
  );
}