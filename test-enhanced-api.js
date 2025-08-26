// Test Script for Enhanced MIT Research API Endpoints
// Tests SP+ ratings, PPA data, and enhanced standings integration

const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`   Endpoint: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`   ✅ SUCCESS: ${data.data?.length || 0} records`);
      if (data.metadata) {
        console.log(`   📊 Metadata: ${data.metadata.description || 'No description'}`);
      }
      if (data.predictiveAccuracy) {
        console.log(`   🎯 SP+ Correlation: ${data.predictiveAccuracy.spPlusCorrelation}%`);
        console.log(`   ⚡ Explosiveness Win Rate: ${data.predictiveAccuracy.explosiveness}%`);
      }
      return true;
    } else {
      console.log(`   ❌ FAILED: ${response.status} - ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🏈 MIT Research CFB API Testing Suite');
  console.log('=====================================');
  
  const tests = [
    {
      endpoint: '/api/sp-ratings?year=2024',
      description: 'SP+ Ratings (Primary Predictor - 72-86% correlation)'
    },
    {
      endpoint: '/api/ppa?year=2024', 
      description: 'PPA Neural Network Predictions'
    },
    {
      endpoint: '/api/standings/enhanced?year=2024&sec=true',
      description: 'Enhanced SEC Standings with MIT Research Fields'
    },
    {
      endpoint: '/api/standings/enhanced?year=2024',
      description: 'Enhanced All Teams Standings'
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const success = await testAPI(test.endpoint, test.description);
    if (success) passed++;
  }
  
  console.log('\n📋 TEST SUMMARY');
  console.log('================');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! MIT Research API integration is working.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the API endpoints and data sources.');
  }
}

// Test specific SEC teams endpoint
async function testSECSpecific() {
  console.log('\n🏆 SEC-Specific Testing');
  console.log('=======================');
  
  try {
    const response = await fetch(`${BASE_URL}/api/standings/enhanced?year=2024&sec=true`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const secTeams = data.data.filter(team => 
        ['Alabama', 'Georgia', 'Tennessee', 'LSU', 'Auburn', 'Florida'].includes(team.team)
      );
      
      console.log(`📊 Found ${secTeams.length} major SEC teams with predictive data:`);
      
      secTeams.slice(0, 3).forEach((team, index) => {
        console.log(`   ${index + 1}. ${team.team}`);
        console.log(`      SP+ Rating: ${team.spPlusRating?.toFixed(1) || 'N/A'} (Rank #${team.spPlusRanking || 'N/A'})`);
        console.log(`      Explosiveness: ${team.explosiveness?.toFixed(2) || 'N/A'}`);
        console.log(`      Offensive PPA: ${team.offensePPA?.toFixed(3) || 'N/A'}`);
        console.log(`      Record: ${team.wins}-${team.losses}`);
      });
    }
  } catch (error) {
    console.log(`❌ SEC test failed: ${error.message}`);
  }
}

// Run all tests
runTests().then(() => {
  return testSECSpecific();
});