// Test CFBD API directly to see what data we're getting
const fetch = require('node-fetch');

const API_KEY = process.env.CFBD_API_KEY || '';
const CFBD_BASE_URL = 'https://api.collegefootballdata.com';

async function testAPIEndpoints() {
  console.log('Testing CFBD API endpoints...\n');
  
  // Test stats/season endpoint
  try {
    console.log('1. Testing /stats/season endpoint for Alabama...');
    const response = await fetch(
      `${CFBD_BASE_URL}/stats/season?year=2024&team=Alabama`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': API_KEY ? `Bearer ${API_KEY}` : ''
        }
      }
    );
    
    const data = await response.json();
    console.log('Alabama stats count:', data.length);
    
    // Show some key stats
    const importantStats = data.filter(stat => 
      ['totalYards', 'rushingYards', 'netPassingYards', 'pointsPerGame', 
       'yardsPerGame', 'rushingTDs', 'passingTDs', 'scoringOffense',
       'totalOffense', 'thirdDownConversions', 'possessionTime'].includes(stat.statName)
    );
    
    console.log('\nKey offensive stats found:');
    importantStats.forEach(stat => {
      console.log(`  ${stat.statName}: ${stat.statValue} (per game: ${stat.perGameStat})`);
    });
    
  } catch (error) {
    console.error('Error testing stats/season:', error.message);
  }

  // Test team/season/stats endpoint (alternative)
  try {
    console.log('\n2. Testing /stats/season/teams endpoint...');
    const response = await fetch(
      `${CFBD_BASE_URL}/stats/season/teams?year=2024&startWeek=1&endWeek=14`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': API_KEY ? `Bearer ${API_KEY}` : ''
        }
      }
    );
    
    const data = await response.json();
    console.log('Teams with stats:', data.length);
    
    // Show Alabama's data
    const alabama = data.find(team => team.team === 'Alabama');
    if (alabama) {
      console.log('\nAlabama team stats:');
      console.log('  Games:', alabama.games);
      if (alabama.totalYards) console.log('  Total Yards:', alabama.totalYards);
      if (alabama.rushingYards) console.log('  Rushing Yards:', alabama.rushingYards);
      if (alabama.passingYards) console.log('  Passing Yards:', alabama.passingYards);
      if (alabama.pointsPerGame) console.log('  Points/Game:', alabama.pointsPerGame);
    }
    
  } catch (error) {
    console.error('Error testing stats/season/teams:', error.message);
  }

  // Test games endpoint to calculate points per game
  try {
    console.log('\n3. Testing /games endpoint for scoring data...');
    const response = await fetch(
      `${CFBD_BASE_URL}/games?year=2024&team=Alabama&seasonType=regular`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': API_KEY ? `Bearer ${API_KEY}` : ''
        }
      }
    );
    
    const games = await response.json();
    console.log('Alabama games played:', games.length);
    
    let totalPoints = 0;
    let gamesWithScores = 0;
    
    games.forEach(game => {
      if (game.home_team === 'Alabama' && game.home_points !== null) {
        totalPoints += game.home_points;
        gamesWithScores++;
      } else if (game.away_team === 'Alabama' && game.away_points !== null) {
        totalPoints += game.away_points;
        gamesWithScores++;
      }
    });
    
    if (gamesWithScores > 0) {
      console.log(`  Total points: ${totalPoints}`);
      console.log(`  Games with scores: ${gamesWithScores}`);
      console.log(`  Points per game: ${(totalPoints / gamesWithScores).toFixed(1)}`);
    }
    
  } catch (error) {
    console.error('Error testing games:', error.message);
  }
}

testAPIEndpoints();