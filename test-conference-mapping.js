// Test conference mapping fix
const https = require('https');

const CFBD_API_KEY = 'cT9zCzXWeUB9UyRSlVmnQ4RWOaRoLkgIZhb831ueEkv+Wz8gvNSPa+OKonDW7Cqa';

async function testConferenceMapping() {
  console.log('🧪 Testing Conference Mapping Fixes');
  console.log('='.repeat(60));
  
  // Fetch games data
  const options = {
    hostname: 'api.collegefootballdata.com',
    path: '/games?year=2024&seasonType=regular',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CFBD_API_KEY}`,
      'Accept': 'application/json'
    }
  };

  const games = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });

  // Filter for completed games only  
  const completedGames = games.filter((game) => 
    game.completed && 
    (game.homePoints !== null && game.homePoints !== undefined) && 
    (game.awayPoints !== null && game.awayPoints !== undefined)
  );

  console.log(`📊 Total completed games: ${completedGames.length}`);
  console.log(`📊 Total games from API: ${games.length}`);

  // Test our problematic conferences
  const conferenceMapping = {
    'Independent': ['FBS Independents', 'FCS Independents', 'Independent DII', 'Independent DIII'],
    'American': ['American Athletic'],
    'C-USA': ['Conference USA'],
    'MAC': ['Mid-American'],
    'PAC-12': ['Pac-12']
  };

  const problematicConferences = ['Independent', 'American', 'C-USA', 'MAC', 'PAC-12'];

  console.log('\n🎯 Testing Conference Mapping:');
  console.log('-'.repeat(40));

  for (const conference of problematicConferences) {
    const allowedNames = conferenceMapping[conference] || [conference];
    
    const matchingGames = completedGames.filter((game) => 
      allowedNames.some(name => 
        game.homeConference?.toLowerCase().includes(name.toLowerCase()) ||
        game.awayConference?.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(game.homeConference?.toLowerCase() || '') ||
        name.toLowerCase().includes(game.awayConference?.toLowerCase() || '')
      )
    );

    const status = matchingGames.length > 0 ? '✅' : '❌';
    console.log(`${status} ${conference}: ${matchingGames.length} games (mapping: ${allowedNames.join(', ')})`);
    
    if (matchingGames.length > 0 && matchingGames.length < 10) {
      // Show a few examples for small results
      console.log(`   Examples: ${matchingGames.slice(0,3).map(g => `${g.awayTeam} @ ${g.homeTeam}`).join(', ')}`);
    }
  }

  // Show all unique conferences for reference
  console.log('\n📋 All Unique Conferences in Data:');
  console.log('-'.repeat(40));
  const uniqueConfs = new Set();
  completedGames.forEach(game => {
    if (game.homeConference) uniqueConfs.add(game.homeConference);
    if (game.awayConference) uniqueConfs.add(game.awayConference);
  });
  
  Array.from(uniqueConfs).sort().forEach(conf => {
    console.log(`  - ${conf}`);
  });

  console.log(`\n✅ Test completed. Found ${uniqueConfs.size} unique conferences.`);
}

testConferenceMapping().catch(console.error);