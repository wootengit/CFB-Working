// 🏈 SEC IMPLEMENTATION TEST - WORKING VERSION
// Tests real API endpoints and gets actual results

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// SEC Team Configuration with Florida State included
const SEC_TEAMS = [
  { name: 'Alabama', id: 'alabama', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png' },
  { name: 'Auburn', id: 'auburn', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png' },
  { name: 'Arkansas', id: 'arkansas', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png' },
  { name: 'Florida', id: 'florida', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png' },
  { name: 'Florida State', id: 'florida-state', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/52.png' },
  { name: 'Georgia', id: 'georgia', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png' },
  { name: 'Kentucky', id: 'kentucky', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png' },
  { name: 'LSU', id: 'lsu', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png' },
  { name: 'Mississippi State', id: 'mississippi-state', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/344.png' },
  { name: 'Missouri', id: 'missouri', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png' },
  { name: 'Ole Miss', id: 'ole-miss', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png' },
  { name: 'South Carolina', id: 'south-carolina', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png' },
  { name: 'Tennessee', id: 'tennessee', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png' },
  { name: 'Texas A&M', id: 'texas-am', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png' },
  { name: 'Vanderbilt', id: 'vanderbilt', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png' }
];

const CFBD_BASE_URL = 'https://api.collegefootballdata.com';
const CURRENT_YEAR = 2024;

class SECImplementationTest {
  constructor() {
    this.results = {
      teamLogos: {},
      realApiData: {},
      workingEndpoints: [],
      errors: [],
      startTime: Date.now()
    };
  }

  log(message, type = 'info') {
    const prefix = { 'info': '📋', 'success': '✅', 'warning': '⚠️', 'error': '❌', 'test': '🧪' }[type] || '📋';
    console.log(`${prefix} ${message}`);
    if (type === 'error') this.results.errors.push(message);
  }

  // Test team logos - CRITICAL for Florida State
  async testTeamLogos() {
    this.log('🖼️ Testing all team logos...', 'test');
    
    for (const team of SEC_TEAMS) {
      try {
        const response = await fetch(team.logo, { 
          method: 'HEAD', 
          timeout: 5000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const working = response.ok;
        this.results.teamLogos[team.name] = {
          logo: team.logo,
          working,
          status: response.status
        };
        
        if (working) {
          this.log(`${team.name}: Logo ✅`, 'success');
        } else {
          this.log(`${team.name}: Logo ❌ (${response.status})`, 'error');
        }
        
        // Special attention to Florida State
        if (team.name === 'Florida State') {
          if (working) {
            this.log('🍢 Florida State logo is working perfectly!', 'success');
          } else {
            this.log('🚨 Florida State logo BROKEN - needs immediate fix!', 'error');
          }
        }
        
      } catch (error) {
        this.results.teamLogos[team.name] = {
          logo: team.logo,
          working: false,
          error: error.message
        };
        this.log(`${team.name}: Logo ❌ (${error.message})`, 'error');
      }
    }
    
    const workingCount = Object.values(this.results.teamLogos).filter(t => t.working).length;
    this.log(`Logo Summary: ${workingCount}/${SEC_TEAMS.length} working`, 
      workingCount >= SEC_TEAMS.length - 2 ? 'success' : 'warning');
  }

  // Test actual API endpoints
  async testRealAPIEndpoints() {
    this.log('🌐 Testing real CFBD API endpoints...', 'test');
    
    const endpoints = [
      { name: 'SP+ Ratings', url: `${CFBD_BASE_URL}/ratings/sp?year=${CURRENT_YEAR}` },
      { name: 'Team Records', url: `${CFBD_BASE_URL}/records?year=${CURRENT_YEAR}` },
      { name: 'Advanced Stats', url: `${CFBD_BASE_URL}/stats/season/advanced?year=${CURRENT_YEAR}` },
      { name: 'FPI Ratings', url: `${CFBD_BASE_URL}/ratings/fpi?year=${CURRENT_YEAR}` }
    ];
    
    for (const endpoint of endpoints) {
      try {
        this.log(`Testing ${endpoint.name}...`, 'test');
        const startTime = Date.now();
        
        const response = await fetch(endpoint.url, {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CFB-Betting-Tool'
          }
        });
        
        const duration = Date.now() - startTime;
        
        if (response.ok) {
          const data = await response.json();
          this.results.realApiData[endpoint.name] = {
            status: 'success',
            dataPoints: Array.isArray(data) ? data.length : 1,
            duration: `${duration}ms`,
            sampleData: Array.isArray(data) ? data.slice(0, 3) : data,
            responseSize: JSON.stringify(data).length
          };
          this.workingEndpoints.push(endpoint.name);
          this.log(`${endpoint.name}: ✅ ${Array.isArray(data) ? data.length : 1} records in ${duration}ms`, 'success');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
      } catch (error) {
        this.results.realApiData[endpoint.name] = {
          status: 'failed',
          error: error.message
        };
        this.log(`${endpoint.name}: ❌ ${error.message}`, 'error');
      }
    }
  }

  // Generate working code based on real test results
  generateWorkingCode() {
    this.log('🔧 Generating working implementation code...', 'test');
    
    const workingLogos = Object.entries(this.results.teamLogos)
      .filter(([_, data]) => data.working)
      .map(([name, data]) => ({ name, logo: data.logo }));
    
    const workingData = this.workingEndpoints.length > 0 ? 
      this.results.realApiData : 'fallback';
    
    // Generate the exact code that works
    const workingCode = `
// 🏈 WORKING SEC IMPLEMENTATION - Generated from real test results
// ${new Date().toISOString()}

const SEC_TEAMS_WORKING = ${JSON.stringify(workingLogos, null, 2)};

const WORKING_ENDPOINTS = ${JSON.stringify(this.workingEndpoints, null, 2)};

// Real API results that actually work:
const REAL_API_SAMPLE = ${JSON.stringify(
      Object.entries(this.results.realApiData)
        .filter(([_, data]) => data.status === 'success')
        .reduce((acc, [name, data]) => {
          acc[name] = data.sampleData;
          return acc;
        }, {}), null, 2
    )};

// Florida State specific result:
const FLORIDA_STATE_STATUS = ${JSON.stringify(this.results.teamLogos['Florida State'] || {}, null, 2)};

// Working implementation function
function getWorkingSECData() {
  return {
    teams: SEC_TEAMS_WORKING,
    endpoints: WORKING_ENDPOINTS,
    floridaStateWorking: ${this.results.teamLogos['Florida State']?.working || false},
    realData: REAL_API_SAMPLE,
    testResults: {
      totalTeams: ${SEC_TEAMS.length},
      workingLogos: ${workingLogos.length},
      workingEndpoints: ${this.workingEndpoints.length},
      errors: ${this.results.errors.length}
    }
  };
}

module.exports = { getWorkingSECData, SEC_TEAMS_WORKING, WORKING_ENDPOINTS };
`;

    // Save working code
    const codePath = path.join(__dirname, 'lib', 'sec-working-implementation.js');
    fs.writeFileSync(codePath, workingCode);
    this.log(`✅ Working code saved to: ${codePath}`, 'success');
    
    return workingCode;
  }

  // Run all tests and generate working code
  async runTests() {
    this.log('🚀 Starting SEC implementation test with Florida State focus...', 'info');
    
    try {
      await this.testTeamLogos();
      await this.testRealAPIEndpoints();
      
      const workingCode = this.generateWorkingCode();
      
      // Final report
      const duration = Date.now() - this.results.startTime;
      const workingLogos = Object.values(this.results.teamLogos).filter(t => t.working).length;
      const floridaStateWorking = this.results.teamLogos['Florida State']?.working || false;
      
      this.log('📊 FINAL RESULTS:', 'info');
      this.log(`Duration: ${duration}ms`, 'info');
      this.log(`Team Logos: ${workingLogos}/${SEC_TEAMS.length} working`, 
        workingLogos >= SEC_TEAMS.length - 2 ? 'success' : 'warning');
      this.log(`Florida State: ${floridaStateWorking ? 'WORKING ✅' : 'BROKEN ❌'}`, 
        floridaStateWorking ? 'success' : 'error');
      this.log(`API Endpoints: ${this.workingEndpoints.length}/4 working`, 
        this.workingEndpoints.length >= 2 ? 'success' : 'warning');
      this.log(`Errors: ${this.results.errors.length}`, 
        this.results.errors.length === 0 ? 'success' : 'error');
      
      // Save detailed results
      const reportPath = path.join(__dirname, 'screenshots', 'sec-test-results.json');
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      this.log(`📄 Full results: ${reportPath}`, 'info');
      
      return {
        success: this.results.errors.length === 0,
        floridaStateWorking,
        workingLogos,
        workingEndpoints: this.workingEndpoints.length,
        results: this.results
      };
      
    } catch (error) {
      this.log(`Test failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
}

// Run the test
if (require.main === module) {
  const test = new SECImplementationTest();
  test.runTests()
    .then(results => {
      if (results.success && results.floridaStateWorking) {
        console.log('\n🎉 All tests passed! Florida State is working!');
        process.exit(0);
      } else {
        console.log('\n⚠️ Issues found - check results');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Test crashed:', error);
      process.exit(1);
    });
}

module.exports = SECImplementationTest;