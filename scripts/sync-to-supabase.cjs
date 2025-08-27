// Sync CFB Data to Supabase Database
// Run: node scripts/sync-to-supabase.cjs

// Load environment variables first
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const http = require('http');

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

// Simple HTTP request function for localhost
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Fetch data from your local API
async function fetchLocalData(endpoint) {
  try {
    const data = await httpGet(`http://localhost:3000/api/${endpoint}`);
    return data;
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

// Test Supabase connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('count')
      .limit(1);
    
    if (error && !error.message.includes('relation "teams" does not exist')) {
      throw error;
    }
    return true;
  } catch (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
}

// Main sync function
async function syncAllData() {
  console.log('🚀 Starting CFB data sync to Supabase...');
  console.log('📡 Supabase URL:', supabaseUrl);
  
  try {
    // Test Supabase connection
    await testConnection();
    console.log('✅ Supabase connection successful');
    
    // Fetch data from local API (make sure server is running)
    console.log('📥 Fetching data from local API...');
    const teamsData = await fetchLocalData('team-stats?year=2024');

    if (!teamsData || !teamsData.success) {
      throw new Error('Failed to fetch teams data from local API. Make sure your dev server is running!');
    }

    console.log(`📊 Retrieved ${teamsData.data.length} teams from API`);

    // Sync to Supabase
    const teamsSuccess = await syncTeams(teamsData);

    if (teamsSuccess) {
      console.log('');
      console.log('🎉 SYNC COMPLETED SUCCESSFULLY!');
      console.log('📊 Your CFB teams are now in Supabase');
      console.log('🔗 Database URL:', supabaseUrl);
      console.log('');
      console.log('✅ Next: Run the SQL schema in your Supabase dashboard');
      console.log('   Go to SQL Editor and run the contents of supabase-schema.sql');
    } else {
      console.error('❌ Sync failed. Check errors above.');
    }

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure your dev server is running (npm run dev)');
    console.log('2. Verify Supabase credentials in .env.local');
    console.log('3. Run the SQL schema in your Supabase SQL editor first');
    process.exit(1);
  }
}

// Run the sync
syncAllData();