/**
 * Test Problematic Team Logo Mappings
 * Focus on teams where school name != ESPN ID
 */

// Teams with known mismatches or issues
const PROBLEMATIC_TEAMS = {
  // Teams with different naming conventions
  'sam-houston': {
    currentId: 2534,
    alternateIds: [2535, 2700, 55], // Try JSU ID for Sam Houston State
    fullName: 'Sam Houston State',
    commonNames: ['Sam Houston', 'Sam Houston State', 'SHSU', 'Bearkats']
  },
  
  'coastal-carolina': {
    currentId: 324,
    alternateIds: [2131, 2429], // Charlotte might be mixed up
    fullName: 'Coastal Carolina University',
    commonNames: ['Coastal Carolina', 'CCU', 'Chanticleers']
  },
  
  'jacksonville-state': {
    currentId: 55,
    alternateIds: [2534], // Might be mixed with Sam Houston
    fullName: 'Jacksonville State University',
    commonNames: ['Jacksonville State', 'JSU', 'Gamecocks']
  },
  
  'miami': {
    currentId: 2390, // Miami Hurricanes
    alternateIds: [193], // Miami RedHawks (Ohio)
    fullName: 'University of Miami',
    commonNames: ['Miami', 'Miami Hurricanes', 'The U']
  },
  
  'miami-redhawks': {
    currentId: 193, // Miami (Ohio)
    alternateIds: [2390],
    fullName: 'Miami University',
    commonNames: ['Miami RedHawks', 'Miami Ohio', 'RedHawks']
  },
  
  'kennesaw-state': {
    currentId: 2246,
    alternateIds: [2245, 2344, 2247],
    fullName: 'Kennesaw State University',
    commonNames: ['Kennesaw State', 'KSU', 'Owls']
  },
  
  'montana': {
    currentId: 136,
    alternateIds: [135, 137, 138],
    fullName: 'University of Montana',
    commonNames: ['Montana', 'UM', 'Grizzlies']
  },
  
  'stony-brook': {
    currentId: 2522,
    alternateIds: [2521, 2523, 2520],
    fullName: 'Stony Brook University',
    commonNames: ['Stony Brook', 'SBU', 'Seawolves']
  },
  
  'lafayette': {
    currentId: 2297,
    alternateIds: [2296, 2298, 2295],
    fullName: 'Lafayette College',
    commonNames: ['Lafayette', 'Leopards']
  },
  
  'florida-international': {
    currentId: 2229,
    alternateIds: [2228, 2230],
    fullName: 'Florida International University',
    commonNames: ['FIU', 'Florida International', 'Panthers']
  },
  
  'missouri': {
    currentId: 142, // This might be Mississippi State
    alternateIds: [142, 43, 135],
    fullName: 'University of Missouri',
    commonNames: ['Missouri', 'Mizzou', 'Tigers']
  },
  
  'louisiana': {
    currentId: 2348, // This might be Louisiana Tech
    alternateIds: [309, 2433, 2348],
    fullName: 'University of Louisiana at Lafayette',
    commonNames: ['Louisiana', 'ULL', 'Ragin Cajuns', 'Louisiana Lafayette']
  },
  
  'louisiana-tech': {
    currentId: 2348, // Same as Louisiana - problem
    alternateIds: [2433, 309, 2434],
    fullName: 'Louisiana Tech University',
    commonNames: ['Louisiana Tech', 'La Tech', 'Bulldogs']
  }
};

// Test function to validate multiple IDs for a team
async function testTeamLogoAlternatives(teamKey, teamData) {
  console.log(`\n🔍 Testing ${teamKey} (${teamData.fullName}):`);
  
  const results = [];
  
  // Test current ID
  const currentUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamData.currentId}.png`;
  console.log(`  Current ID ${teamData.currentId}: Testing...`);
  
  try {
    const response = await fetch(currentUrl, { method: 'HEAD' });
    const isValid = response.ok && response.headers.get('content-type')?.startsWith('image/');
    
    results.push({
      id: teamData.currentId,
      url: currentUrl,
      valid: isValid,
      status: response.status,
      type: 'current'
    });
    
    console.log(`    ${isValid ? '✅' : '❌'} Status: ${response.status}`);
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }
  
  // Test alternative IDs
  for (const altId of teamData.alternateIds) {
    const altUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${altId}.png`;
    console.log(`  Alt ID ${altId}: Testing...`);
    
    try {
      const response = await fetch(altUrl, { method: 'HEAD' });
      const isValid = response.ok && response.headers.get('content-type')?.startsWith('image/');
      
      results.push({
        id: altId,
        url: altUrl,
        valid: isValid,
        status: response.status,
        type: 'alternative'
      });
      
      console.log(`    ${isValid ? '✅' : '❌'} Status: ${response.status}`);
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}

// Main test function
async function testProblematicLogos() {
  console.log('🏈 Testing Problematic Team Logo Mappings\n');
  console.log('=' * 50);
  
  const allResults = {};
  const fixes = {};
  
  for (const [teamKey, teamData] of Object.entries(PROBLEMATIC_TEAMS)) {
    const results = await testTeamLogoAlternatives(teamKey, teamData);
    allResults[teamKey] = results;
    
    // Find the best working logo
    const validResults = results.filter(r => r.valid);
    if (validResults.length > 0) {
      const bestResult = validResults[0]; // First valid one
      fixes[teamKey] = bestResult.id;
      console.log(`  🎯 RECOMMENDED: Use ESPN ID ${bestResult.id} for ${teamKey}`);
    } else {
      console.log(`  ⚠️  NO VALID LOGOS FOUND for ${teamKey}`);
    }
  }
  
  // Generate fix code
  console.log('\n' + '=' * 50);
  console.log('🔧 LOGO FIXES TO IMPLEMENT:\n');
  
  for (const [teamKey, espnId] of Object.entries(fixes)) {
    console.log(`'${teamKey}': ${espnId}, // Fixed from ${PROBLEMATIC_TEAMS[teamKey].currentId}`);
  }
  
  // Generate problematic teams list
  console.log('\n🚨 TEAMS STILL NEEDING MANUAL FIXES:\n');
  for (const teamKey of Object.keys(PROBLEMATIC_TEAMS)) {
    if (!fixes[teamKey]) {
      console.log(`- ${teamKey}: No working ESPN ID found`);
    }
  }
  
  return { results: allResults, fixes };
}

// Additional test for similar team names
async function testSimilarNames() {
  console.log('\n🔄 Testing teams with similar names that might share logos:\n');
  
  const similarTeams = [
    ['miami', 'miami-redhawks'],
    ['louisiana', 'louisiana-tech'],
    ['missouri', 'mississippi-state'],
    ['sam-houston', 'jacksonville-state'],
    ['georgia-state', 'georgia-southern']
  ];
  
  for (const [team1, team2] of similarTeams) {
    console.log(`\n🔍 Comparing ${team1} vs ${team2}:`);
    
    if (PROBLEMATIC_TEAMS[team1] && PROBLEMATIC_TEAMS[team2]) {
      const id1 = PROBLEMATIC_TEAMS[team1].currentId;
      const id2 = PROBLEMATIC_TEAMS[team2].currentId;
      
      if (id1 === id2) {
        console.log(`  ⚠️  DUPLICATE ESPN IDs: Both use ${id1}`);
      } else {
        console.log(`  ✅ Different IDs: ${team1}=${id1}, ${team2}=${id2}`);
      }
    }
  }
}

// Run tests
async function runAllTests() {
  try {
    const results = await testProblematicLogos();
    await testSimilarNames();
    
    console.log('\n✅ Problematic logo testing complete!');
    console.log('Use the fixes above to update your ESPN_TEAM_IDS mapping.');
    
    return results;
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  PROBLEMATIC_TEAMS,
  testProblematicLogos,
  testSimilarNames
};