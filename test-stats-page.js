const http = require('http');

console.log('Testing stats page availability...');

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/stats',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Stats page status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Stats page is accessible at http://localhost:3005/stats');
  } else {
    console.log(`⚠️ Stats page returned status ${res.statusCode}`);
  }
  
  res.on('data', (chunk) => {
    // We don't need to log the HTML, just confirm it's responding
  });
});

req.on('error', (error) => {
  console.error('❌ Error accessing stats page:', error);
});

req.end();

// Also test the API endpoint
const apiOptions = {
  hostname: 'localhost', 
  port: 3005,
  path: '/api/team-stats?year=2024',
  method: 'GET'
};

const apiReq = http.request(apiOptions, (res) => {
  console.log(`\nAPI endpoint status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.success) {
        console.log(`✅ API is working - returned ${jsonData.data?.length || 0} teams`);
      } else {
        console.log('⚠️ API returned error:', jsonData.error);
      }
    } catch (e) {
      console.log('❌ Failed to parse API response');
    }
  });
});

apiReq.on('error', (error) => {
  console.error('❌ Error accessing API:', error);
});

apiReq.end();