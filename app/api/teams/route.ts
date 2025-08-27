import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  request: NextRequest,
  
) {
  try {
    const teamSlug = getAllTeams();
    
    // Validate slug format
    if (!teamSlug || !/^[a-z0-9-]+$/.test(teamSlug)) {
      return NextResponse.json(
        { error: 'Invalid team slug format' },
        { status: 400 }
      );
    }
    
    // Load team data from our generated files
    const dataPath = path.join(process.cwd(), 'data', 'teams', `${teamSlug}.json`);
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }
    
    const teamData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Add cache headers for performance
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600'); // 5min cache, 10min stale
    headers.set('Content-Type', 'application/json');
    
    return new NextResponse(JSON.stringify(teamData), { headers });
    
  } catch (error) {
    console.error('Error serving team data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET all teams endpoint for listings
export async function getAllTeams() {
  try {
    const indexPath = path.join(process.cwd(), 'data', 'teams', 'team-data-index.json');
    
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json(
        { error: 'Teams index not found' },
        { status: 404 }
      );
    }
    
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    
    return NextResponse.json({
      teams: indexData.teams,
      totalTeams: indexData.totalTeams,
      lastUpdated: indexData.timestamp
    });
    
  } catch (error) {
    console.error('Error serving teams index:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}