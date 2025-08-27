// Simple conference discovery script for debugging
const https = require('https');

function fetchConferences() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.collegefootballdata.com',
      path: '/games?year=2024&seasonType=regular',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CFBD_API_KEY || ''}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const games = JSON.parse(data);
          
          if (!Array.isArray(games)) {
            console.log('API Error:', games);
            reject(new Error('Invalid API response'));
            return;
          }

          const conferences = new Set();
          
          games.forEach(game => {
            if (game.homeConference) conferences.add(game.homeConference);
            if (game.awayConference) conferences.add(game.awayConference);
          });
          
          console.log('All unique conference names in CFBD API:');
          console.log('='.repeat(60));
          Array.from(conferences).sort().forEach(conf => {
            console.log(`"${conf}"`);
          });
          
          console.log('\nLooking for our problematic conferences:');
          console.log('-'.repeat(40));
          
          const problematic = ['Independent', 'American', 'C-USA', 'MAC', 'PAC-12'];
          
          problematic.forEach(target => {
            const matches = Array.from(conferences).filter(conf => 
              conf.toLowerCase().includes(target.toLowerCase()) ||
              target.toLowerCase().includes(conf.toLowerCase())
            );
            
            console.log(`${target}: ${matches.length > 0 ? matches.join(', ') : 'NO MATCHES'}`);
          });
          
          resolve(Array.from(conferences).sort());
          
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Check if we have the API key
if (!process.env.CFBD_API_KEY) {
  console.log('❌ CFBD_API_KEY not found in environment variables');
  console.log('Please set the API key to run this test');
  process.exit(1);
}

fetchConferences()
  .then(conferences => {
    console.log(`\nFound ${conferences.length} unique conferences`);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });