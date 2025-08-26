// Test script to check CFBD API access
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_CFBD_API_KEY;
const BASE_URL = 'https://api.collegefootballdata.com';

console.log('🔍 Testing CFBD API Access...');
console.log('API Key found:', API_KEY ? `Yes (${API_KEY.substring(0, 10)}...)` : 'No');

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n📡 Testing: ${description}`);
    console.log(`   Endpoint: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.log('   ❌ Unauthorized - API key may be invalid or revoked');
      return false;
    } else if (response.status === 403) {
      console.log('   ❌ Forbidden - Account may be locked or rate limited');
      return false;
    } else if (response.status === 429) {
      console.log('   ⚠️ Rate limited - Too many requests');
      return false;
    } else if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Success - Retrieved ${Array.isArray(data) ? data.length : 1} records`);
      return true;
    } else {
      console.log(`   ⚠️ Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  const results = [];
  
  // Test various endpoints
  results.push(await testEndpoint('/teams/fbs', 'FBS Teams (Basic test)'));
  results.push(await testEndpoint('/games?year=2024&seasonType=regular&week=1', 'Games Week 1'));
  results.push(await testEndpoint('/ratings/sp?year=2024', 'SP+ Ratings'));
  results.push(await testEndpoint('/stats/season/advanced?year=2024', 'Advanced Stats'));
  results.push(await testEndpoint('/ppa/teams?year=2024', 'PPA Data'));
  results.push(await testEndpoint('/records?year=2024', 'Team Records'));
  results.push(await testEndpoint('/rankings?year=2024&week=1', 'Rankings'));
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  const successCount = results.filter(r => r).length;
  const failCount = results.filter(r => !r).length;
  
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  
  if (failCount === results.length) {
    console.log('\n🚨 CRITICAL: All API calls failed. Possible issues:');
    console.log('   1. API key is invalid or has been revoked');
    console.log('   2. Account has been locked/banned');
    console.log('   3. Network connectivity issues');
    console.log('   4. API service is down');
    console.log('\n💡 Recommendations:');
    console.log('   1. Check API key status at https://collegefootballdata.com');
    console.log('   2. Try regenerating a new API key');
    console.log('   3. Contact CFBD support if account is locked');
    console.log('   4. Use mock data mode as fallback');
  } else if (failCount > 0) {
    console.log('\n⚠️ WARNING: Some API calls failed');
    console.log('   - May be rate limiting or partial restrictions');
    console.log('   - Consider implementing caching and rate limit handling');
  } else {
    console.log('\n✅ SUCCESS: All API endpoints are accessible!');
    console.log('   - API key is valid');
    console.log('   - No apparent restrictions or locks');
  }
}

// Run the tests
runTests().catch(console.error);