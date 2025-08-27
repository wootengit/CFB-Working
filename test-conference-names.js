// Test to see actual conference names from CFBD API
const fetch = require('node-fetch');

const API_KEY = process.env.CFBD_API_KEY || 'cT9zCzXWeUB9UyRSlVmnQ4RWOaRoLkgIZhb831ueEkv+Wz8gvNSPa+OKonDW7Cqa';
const CFBD_BASE_URL = 'https://api.collegefootballdata.com';

async function testConferenceNames() {
  console.log('Testing conference names from CFBD API...\n');
  
  // Get all teams
  const response = await fetch(
    `${CFBD_BASE_URL}/teams`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );
  
  const teams = await response.json();
  
  // Group by conference and classification
  const conferences = {};
  teams.forEach(team => {
    if (team.conference) {
      if (!conferences[team.conference]) {
        conferences[team.conference] = {
          classification: team.classification,
          teams: []
        };
      }
      conferences[team.conference].teams.push(team.school);
    }
  });
  
  // Show FBS conferences
  console.log('FBS CONFERENCES:');
  console.log('================');
  Object.entries(conferences)
    .filter(([conf, data]) => data.classification === 'fbs')
    .forEach(([conf, data]) => {
      console.log(`"${conf}" - ${data.teams.length} teams`);
    });
  
  // Show FCS conferences  
  console.log('\nFCS CONFERENCES:');
  console.log('================');
  Object.entries(conferences)
    .filter(([conf, data]) => data.classification === 'fcs')
    .forEach(([conf, data]) => {
      console.log(`"${conf}" - ${data.teams.length} teams`);
    });
  
  // Count totals
  const fbsTeams = Object.values(conferences)
    .filter(data => data.classification === 'fbs')
    .reduce((sum, data) => sum + data.teams.length, 0);
    
  const fcsTeams = Object.values(conferences)
    .filter(data => data.classification === 'fcs')
    .reduce((sum, data) => sum + data.teams.length, 0);
  
  console.log('\nTOTALS:');
  console.log(`FBS: ${fbsTeams} teams`);
  console.log(`FCS: ${fcsTeams} teams`);
  console.log(`Total Division I: ${fbsTeams + fcsTeams} teams`);
  
  // Check records endpoint for 2024
  console.log('\n\nChecking 2024 records endpoint for conference names...');
  const recordsResponse = await fetch(
    `${CFBD_BASE_URL}/records?year=2024`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );
  
  const records = await recordsResponse.json();
  const recordConferences = new Set();
  records.forEach(record => {
    if (record.conference) {
      recordConferences.add(record.conference);
    }
  });
  
  console.log('\nConferences in 2024 records:');
  Array.from(recordConferences).sort().forEach(conf => {
    console.log(`"${conf}"`);
  });
}

testConferenceNames();