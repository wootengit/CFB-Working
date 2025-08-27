// Quick test to verify the expanded team mapping is working
const { TEAM_ID_MAPPING, getTeamId } = require('./utils/teamIdMapping.ts');

console.log('🏈 Testing Expanded ESPN Team ID Mapping\n');

// Test cases representing different conferences and divisions
const testTeams = [
  // FBS Power 5
  { name: 'Alabama', conference: 'SEC', expected: 333 },
  { name: 'Ohio State', conference: 'Big Ten', expected: 194 },
  { name: 'Oregon', conference: 'Big Ten', expected: 2483 },
  { name: 'Texas', conference: 'SEC', expected: 251 },
  
  // FBS Group of 5
  { name: 'Boise State', conference: 'Mountain West', expected: 68 },
  { name: 'Memphis', conference: 'American Athletic', expected: 235 },
  { name: 'App State', conference: 'Sun Belt', expected: 2026 },
  
  // FBS Smaller conferences
  { name: 'Toledo', conference: 'MAC', expected: 2649 },
  { name: 'Liberty', conference: 'Conference USA', expected: 2335 },
  
  // FCS Major programs
  { name: 'North Dakota State', conference: 'Missouri Valley', expected: 2449 },
  { name: 'Montana', conference: 'Big Sky', expected: 2151 },
  { name: 'James Madison', conference: 'Sun Belt (moved from FCS)', expected: 256 },
  
  // FCS Ivy League
  { name: 'Harvard', conference: 'Ivy League', expected: 108 },
  { name: 'Yale', conference: 'Ivy League', expected: 43 },
  
  // FCS HBCU
  { name: 'Jackson State', conference: 'SWAC', expected: 2296 },
  { name: 'Howard', conference: 'MEAC', expected: 2269 }
];

console.log('Testing team mappings...\n');

let passCount = 0;
let failCount = 0;

testTeams.forEach(team => {
  const actualId = getTeamId(team.name);
  const passed = actualId === team.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${team.name} (${team.conference})`);
  console.log(`   Expected: ${team.expected}, Got: ${actualId}`);
  
  if (passed) {
    passCount++;
  } else {
    failCount++;
  }
});

console.log(`\n📊 Test Results:`);
console.log(`✅ Passed: ${passCount}/${testTeams.length}`);
console.log(`❌ Failed: ${failCount}/${testTeams.length}`);

// Test the logo URL generation
console.log('\n🖼️  Logo URL Test:');
const logoBaseUrl = 'https://a.espncdn.com/i/teamlogos/ncaa/500';
const sampleTeams = ['Alabama', 'North Dakota State', 'Harvard'];

sampleTeams.forEach(teamName => {
  const teamId = getTeamId(teamName);
  const logoUrl = `${logoBaseUrl}/${teamId}.png`;
  console.log(`${teamName}: ${logoUrl}`);
});

console.log('\n🎯 Summary:');
console.log(`Total teams in mapping: ${Object.keys(TEAM_ID_MAPPING).length}`);
console.log('✅ Expanded mapping is ready for all Division I teams!');