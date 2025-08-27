// Test logo generation for specific teams
const http = require('http');

const testTeams = ['Howard', 'UAlbany', 'Charleston Southern', 'Tennessee State', 'Sam Houston'];

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/team-stats?year=2024',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.success) {
        testTeams.forEach(teamName => {
          const team = response.data.find(t => t.team === teamName);
          if (team) {
            console.log(`${teamName}:`);
            console.log(`  Team ID: ${team.teamId}`);
            console.log(`  Current Logo: ${team.logo}`);
            console.log(`  Conference: ${team.conference}`);
            console.log('');
          } else {
            console.log(`${teamName}: NOT FOUND`);
          }
        });
      } else {
        console.error('API Error:', response.error);
      }
    } catch (error) {
      console.error('Parse Error:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.end();