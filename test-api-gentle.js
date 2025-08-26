// Gentle API test with delays to avoid rate limiting
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.CFBD_API_KEY || process.env.NEXT_PUBLIC_CFBD_API_KEY;
const BASE_URL = 'https://api.collegefootballdata.com';

console.log('🔍 Gentle CFBD API Test (with delays)...');
console.log('API Key found:', API_KEY ? `Yes (${API_KEY.substring(0, 10)}...)` : 'No');
console.log('Note: Adding 2-second delays between requests to avoid rate limits\n');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEndpoint(endpoint, description) {
  try {
    console.log(`📡 Testing: ${description}`);
    console.log(`   Endpoint: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.log('   ❌ Unauthorized - API key invalid');
      return 'unauthorized';
    } else if (response.status === 403) {
      console.log('   ❌ Forbidden - Account locked');
      return 'forbidden';
    } else if (response.status === 429) {
      console.log('   ⚠️ Rate limited - Still cooling down');
      // Get rate limit headers if available
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        console.log(`   Retry after: ${retryAfter} seconds`);
      }
      return 'rate-limited';
    } else if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Success - Retrieved ${Array.isArray(data) ? data.length : 1} records`);
      return 'success';
    } else {
      console.log(`   ⚠️ Unexpected: ${response.status}`);
      return 'error';
    }
  } catch (error) {
    console.log(`   ❌ Network error: ${error.message}`);
    return 'network-error';
  }
}

async function runGentleTest() {
  console.log('Starting gentle test with delays...\n');
  
  // Test just a couple of endpoints with delays
  const result1 = await testEndpoint('/teams/fbs', 'FBS Teams (Basic health check)');
  
  if (result1 === 'success') {
    console.log('\n✅ API is accessible! Continuing tests...\n');
    
    await sleep(2000); // 2 second delay
    await testEndpoint('/teams?conference=SEC', 'SEC Teams');
    
    await sleep(2000);
    await testEndpoint('/records?year=2024&team=Georgia', 'Single Team Record');
    
    console.log('\n✅ API is working! The rate limit has likely reset.');
    console.log('💡 Recommendations:');
    console.log('   1. Implement caching to reduce API calls');
    console.log('   2. Add delays between bulk requests');
    console.log('   3. Store frequently used data locally');
    
  } else if (result1 === 'rate-limited') {
    console.log('\n⏳ Still rate limited. Recommendations:');
    console.log('   1. Wait 15-30 more minutes for reset');
    console.log('   2. Use mock data mode for now');
    console.log('   3. The app will automatically use mock data if API fails');
    
  } else if (result1 === 'unauthorized' || result1 === 'forbidden') {
    console.log('\n🔐 Authentication issue. Actions needed:');
    console.log('   1. Check API key at https://collegefootballdata.com');
    console.log('   2. Generate a new key if needed');
    console.log('   3. Update .env.local with new key');
    
  } else {
    console.log('\n❌ Unexpected error. Check network and API status.');
  }
}

// Run the gentle test
runGentleTest().catch(console.error);