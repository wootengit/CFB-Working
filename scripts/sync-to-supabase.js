// Sync CFB Data to Supabase Database
// Run: node scripts/sync-to-supabase.js

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure to set:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fetch data from your local API
async function fetchLocalData(endpoint) {
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return null;
  }
}

// Sync teams to Supabase
async function syncTeams(teamsData) {
  console.log('🏈 Syncing teams to Supabase...');
  
  const teamsToInsert = teamsData.data.map(team => ({
    name: team.team,
    conference: team.conference,
    division: team.division || '',
    logo_url: team.logo,
    espn_id: team.teamId || null,
    color: team.color || '#000000',
    alt_color: team.altColor || '#FFFFFF',
    classification: team.conference && ['Big Sky', 'CAA', 'MEAC', 'MVFC', 'Big South-OVC', 'Southern', 'SWAC', 'UAC', 'Ivy', 'Patriot', 'Pioneer', 'Southland', 'NEC', 'FCS Independents'].includes(team.conference) ? 'fcs' : 'fbs'
  }));

  const { data, error } = await supabase
    .from('teams')
    .upsert(teamsToInsert, { onConflict: 'name' });

  if (error) {
    console.error('❌ Error syncing teams:', error);
    return false;
  }

  console.log(`✅ Synced ${teamsToInsert.length} teams to Supabase`);
  return true;
}

// Sync team stats to Supabase
async function syncTeamStats(statsData, year = 2024) {
  console.log('📊 Syncing team stats to Supabase...');
  
  // First, get team IDs from Supabase
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('id, name');
    
  if (teamsError) {
    console.error('❌ Error fetching teams for stats sync:', teamsError);
    return false;
  }
  
  const teamIdMap = new Map(teams.map(team => [team.name, team.id]));
  
  const statsToInsert = statsData.data
    .filter(team => teamIdMap.has(team.team))
    .map(team => ({
      team_id: teamIdMap.get(team.team),
      year: year,
      wins: team.wins || 0,
      losses: team.losses || 0,
      ties: team.ties || 0,
      conference_wins: team.conferenceWins || 0,
      conference_losses: team.conferenceLosses || 0,
      sp_rating: team.spPlusRating || 0,
      sp_ranking: team.spPlusRanking || 999,
      offense_ppa: team.offensePPA || 0,
      defense_ppa: team.defensePPA || 0,
      overall_ppa: (team.offensePPA || 0) - (team.defensePPA || 0),
      offensive_efficiency: team.offensiveEfficiency || 0,
      defensive_efficiency: team.defensiveEfficiency || 0,
      explosiveness: team.explosiveness || 0,
      points_per_game: team.pointsPerGame || 0,
      points_allowed_per_game: team.pointsAllowedPerGame || 0,
      yards_per_game: team.yardsPerGame || 0,
      yards_allowed_per_game: team.yardsAllowedPerGame || 0,
      strength_of_schedule: team.strengthOfSchedule || 0,
      second_order_wins: team.secondOrderWins || 0,
      havoc_rate: team.havocRate || 0,
      finishing_rate: team.finishingRate || 0,
      field_position: team.fieldPosition || 0
    }));

  const { data, error } = await supabase
    .from('team_stats')
    .upsert(statsToInsert, { onConflict: 'team_id,year' });

  if (error) {
    console.error('❌ Error syncing team stats:', error);
    return false;
  }

  console.log(`✅ Synced ${statsToInsert.length} team stats to Supabase`);
  return true;
}

// Main sync function
async function syncAllData() {
  console.log('🚀 Starting CFB data sync to Supabase...');
  console.log('📡 Supabase URL:', supabaseUrl);
  
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('teams').select('count').single();
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned, which is okay
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    console.log('✅ Supabase connection successful');
    
    // Fetch data from local API (make sure server is running)
    console.log('📥 Fetching data from local API...');
    const [teamsData] = await Promise.all([
      fetchLocalData('team-stats?year=2024')
    ]);

    if (!teamsData || !teamsData.success) {
      throw new Error('Failed to fetch teams data from local API');
    }

    console.log(`📊 Retrieved ${teamsData.data.length} teams from API`);

    // Sync to Supabase
    const teamsSuccess = await syncTeams(teamsData);
    const statsSuccess = await syncTeamStats(teamsData, 2024);

    if (teamsSuccess && statsSuccess) {
      console.log('');
      console.log('🎉 SYNC COMPLETED SUCCESSFULLY!');
      console.log('📊 Your CFB data is now in Supabase');
      console.log('🔗 Database URL:', supabaseUrl);
      console.log('');
      console.log('Next steps:');
      console.log('1. Get your ANON_KEY from Supabase dashboard');
      console.log('2. Update .env.local with your ANON_KEY');
      console.log('3. Your app can now use Supabase for real-time data!');
    } else {
      console.error('❌ Sync partially failed. Check errors above.');
    }

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure your dev server is running (npm run dev)');
    console.log('2. Verify Supabase credentials in .env.local');
    console.log('3. Run the SQL schema in your Supabase SQL editor');
    process.exit(1);
  }
}

// Run the sync
syncAllData();