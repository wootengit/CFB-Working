// 🏈 COMPREHENSIVE SEC IMPLEMENTATION TEST
// Tests all API endpoints, logos, and data fields for mission-critical deployment

const fs = require('fs');
const path = require('path');

// Import our comprehensive API (simulate ES6 import with require)
const { 
  loadComprehensiveSECData, 
  verifyTeamLogos, 
  SEC_TEAMS,
  fetchSPPlusRatings,
  fetchAdvancedStats,
  fetchPPAData,
  fetchFPIRatings,
  fetchTeamRecords,
  fetchRecruitingData
} = require('./lib/cfbd-comprehensive-api.ts');

class SECImplementationTest {
  constructor() {
    this.results = {
      apiEndpoints: {},
      teamLogos: {},
      dataFields: {},
      comprehensiveData: null,
      errors: [],
      warnings: [],
      startTime: Date.now()
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📋',
      'success': '✅', 
      'warning': '⚠️',
      'error': '❌',
      'test': '🧪'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    if (type === 'error') {
      this.results.errors.push(message);
    } else if (type === 'warning') {
      this.results.warnings.push(message);
    }
  }

  // Test 1: API Endpoint Availability
  async testAPIEndpoints() {
    this.log('Testing all API endpoints...', 'test');
    
    const endpoints = [
      { name: 'SP+ Ratings', func: fetchSPPlusRatings },
      { name: 'Advanced Stats', func: fetchAdvancedStats },
      { name: 'PPA Data', func: fetchPPAData },
      { name: 'FPI Ratings', func: fetchFPIRatings },
      { name: 'Team Records', func: fetchTeamRecords },
      { name: 'Recruiting Data', func: fetchRecruitingData }
    ];
    
    for (const endpoint of endpoints) {
      try {
        this.log(`Testing ${endpoint.name}...`, 'test');
        const startTime = Date.now();
        const data = await endpoint.func();
        const duration = Date.now() - startTime;
        
        if (data && data.length > 0) {
          this.results.apiEndpoints[endpoint.name] = {
            status: 'success',
            dataPoints: data.length,
            duration: `${duration}ms`,
            sample: data[0]
          };
          this.log(`${endpoint.name}: ✅ ${data.length} records in ${duration}ms`, 'success');
        } else {
          throw new Error('No data returned');
        }
      } catch (error) {
        this.results.apiEndpoints[endpoint.name] = {
          status: 'failed',
          error: error.message
        };
        this.log(`${endpoint.name}: Failed - ${error.message}`, 'error');
      }
    }
  }

  // Test 2: Team Logo Verification
  async testTeamLogos() {
    this.log('Verifying all SEC team logos...', 'test');
    
    try {
      const logoTests = await verifyTeamLogos();
      
      for (const test of logoTests) {
        this.results.teamLogos[test.team] = {
          logo: test.logo,
          working: test.working
        };
        
        if (test.working) {
          this.log(`${test.team}: Logo ✅`, 'success');
        } else {
          this.log(`${test.team}: Logo ❌`, 'error');
        }
      }
      
      const workingCount = logoTests.filter(t => t.working).length;
      this.log(`Logo Summary: ${workingCount}/${SEC_TEAMS.length} working`, 
        workingCount === SEC_TEAMS.length ? 'success' : 'warning');
        
    } catch (error) {
      this.log(`Logo verification failed: ${error.message}`, 'error');
    }
  }

  // Test 3: Comprehensive Data Loading
  async testComprehensiveDataLoading() {
    this.log('Testing comprehensive SEC data loading...', 'test');
    
    try {
      const startTime = Date.now();
      const data = await loadComprehensiveSECData();
      const duration = Date.now() - startTime;
      
      if (data && data.length > 0) {
        this.results.comprehensiveData = {
          status: 'success',
          teamCount: data.length,
          duration: `${duration}ms`,
          teams: data.map(t => t.team)
        };
        
        this.log(`Comprehensive data loaded: ${data.length} teams in ${duration}ms`, 'success');
        
        // Test data fields for each team
        await this.testDataFields(data);
        
        return data;
      } else {
        throw new Error('No comprehensive data returned');
      }
    } catch (error) {
      this.results.comprehensiveData = {
        status: 'failed',
        error: error.message
      };
      this.log(`Comprehensive data loading failed: ${error.message}`, 'error');
      return null;
    }
  }

  // Test 4: MIT Research Data Fields
  async testDataFields(data) {
    this.log('Testing MIT research data fields...', 'test');
    
    // Define required fields by tier
    const tier1Fields = [
      'spPlusOverall', 'spPlusOffense', 'spPlusDefense', 
      'explosiveness', 'efficiency', 'ppaOverall', 'ppaOffense', 'ppaDefense'
    ];
    
    const tier2Fields = [
      'fpiRating', 'sosRank', 'talentRank'
    ];
    
    const bettingFields = [
      'atsPercentage', 'overPercentage', 'coverMarginAvg'
    ];
    
    const basicFields = [
      'team', 'teamId', 'logo', 'conference', 'wins', 'losses', 
      'pointsForPerGame', 'pointsAgainstPerGame'
    ];
    
    const allRequiredFields = [...basicFields, ...tier1Fields, ...tier2Fields, ...bettingFields];
    
    // Test each team's data completeness
    for (const team of data) {
      const teamResults = {
        basic: {},
        tier1: {},
        tier2: {},
        betting: {},
        missing: [],
        score: 0
      };
      
      // Check basic fields
      for (const field of basicFields) {
        const hasField = team[field] !== undefined && team[field] !== null;
        teamResults.basic[field] = hasField;
        if (hasField) teamResults.score += 1;
        else teamResults.missing.push(field);
      }
      
      // Check Tier 1 fields (Most Important)
      for (const field of tier1Fields) {
        const hasField = team[field] !== undefined && team[field] !== null;
        teamResults.tier1[field] = hasField;
        if (hasField) teamResults.score += 3; // Weight Tier 1 fields higher
        else teamResults.missing.push(field);
      }
      
      // Check Tier 2 fields
      for (const field of tier2Fields) {
        const hasField = team[field] !== undefined && team[field] !== null;
        teamResults.tier2[field] = hasField;
        if (hasField) teamResults.score += 2;
        else teamResults.missing.push(field);
      }
      
      // Check betting fields
      for (const field of bettingFields) {
        const hasField = team[field] !== undefined && team[field] !== null;
        teamResults.betting[field] = hasField;
        if (hasField) teamResults.score += 2;
        else teamResults.missing.push(field);
      }
      
      // Calculate completion percentage
      const maxScore = basicFields.length * 1 + tier1Fields.length * 3 + 
                      tier2Fields.length * 2 + bettingFields.length * 2;
      const completionPct = Math.round((teamResults.score / maxScore) * 100);
      
      this.results.dataFields[team.team] = {
        ...teamResults,
        completionPercentage: completionPct,
        maxScore,
        totalFields: allRequiredFields.length
      };
      
      if (completionPct >= 90) {
        this.log(`${team.team}: Data quality ✅ (${completionPct}%)`, 'success');
      } else if (completionPct >= 70) {
        this.log(`${team.team}: Data quality ⚠️ (${completionPct}%)`, 'warning');
      } else {
        this.log(`${team.team}: Data quality ❌ (${completionPct}%) - Missing: ${teamResults.missing.join(', ')}`, 'error');
      }
    }
    
    // Overall data quality summary
    const avgCompletion = Object.values(this.results.dataFields)
      .reduce((sum, team) => sum + team.completionPercentage, 0) / data.length;
    
    this.log(`Overall data quality: ${Math.round(avgCompletion)}%`, 
      avgCompletion >= 85 ? 'success' : 'warning');
  }

  // Test 5: Critical Field Validation
  testCriticalFields(data) {
    this.log('Validating critical predictive fields...', 'test');
    
    const criticalTests = [
      {
        name: 'SP+ Overall Rating Range',
        test: (team) => team.spPlusOverall !== undefined && 
                       team.spPlusOverall >= -30 && team.spPlusOverall <= 30,
        critical: true
      },
      {
        name: 'Win-Loss Records Valid',
        test: (team) => team.wins >= 0 && team.losses >= 0 && 
                       team.wins + team.losses <= 15,
        critical: true
      },
      {
        name: 'PPA Values Realistic',
        test: (team) => team.ppaOverall !== undefined && 
                       team.ppaOverall >= -1 && team.ppaOverall <= 1,
        critical: false
      },
      {
        name: 'Logo URLs Valid',
        test: (team) => team.logo && team.logo.startsWith('https://'),
        critical: true
      }
    ];
    
    for (const test of criticalTests) {
      const passCount = data.filter(team => test.test(team)).length;
      const passRate = Math.round((passCount / data.length) * 100);
      
      if (passRate === 100) {
        this.log(`${test.name}: ✅ (${passCount}/${data.length})`, 'success');
      } else if (passRate >= 90 && !test.critical) {
        this.log(`${test.name}: ⚠️ (${passCount}/${data.length})`, 'warning');
      } else {
        this.log(`${test.name}: ❌ (${passCount}/${data.length})`, 'error');
      }
    }
  }

  // Test 6: Performance Benchmarks
  async testPerformance() {
    this.log('Running performance benchmarks...', 'test');
    
    const benchmarks = [
      {
        name: 'Full Data Load Time',
        target: 10000, // 10 seconds max
        test: async () => {
          const start = Date.now();
          await loadComprehensiveSECData();
          return Date.now() - start;
        }
      }
    ];
    
    for (const benchmark of benchmarks) {
      try {
        const duration = await benchmark.test();
        const passed = duration <= benchmark.target;
        
        this.log(`${benchmark.name}: ${duration}ms (target: <${benchmark.target}ms)`, 
          passed ? 'success' : 'warning');
          
      } catch (error) {
        this.log(`${benchmark.name}: Failed - ${error.message}`, 'error');
      }
    }
  }

  // Generate comprehensive test report
  generateReport() {
    const totalDuration = Date.now() - this.results.startTime;
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${totalDuration}ms`,
      summary: {
        apiEndpoints: Object.keys(this.results.apiEndpoints).length,
        apiSuccess: Object.values(this.results.apiEndpoints)
          .filter(ep => ep.status === 'success').length,
        teamLogos: Object.keys(this.results.teamLogos).length,
        logosWorking: Object.values(this.results.teamLogos)
          .filter(logo => logo.working).length,
        dataQuality: this.results.dataFields ? 
          Math.round(Object.values(this.results.dataFields)
            .reduce((sum, team) => sum + team.completionPercentage, 0) / 
            Object.keys(this.results.dataFields).length) : 0,
        errors: this.results.errors.length,
        warnings: this.results.warnings.length
      },
      results: this.results
    };
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'screenshots', 'sec-implementation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  // Main test runner
  async runAllTests() {
    this.log('🚀 Starting comprehensive SEC implementation test...', 'info');
    this.log(`Testing ${SEC_TEAMS.length} SEC teams with all MIT research fields`, 'info');
    
    try {
      // Run all tests in sequence
      await this.testAPIEndpoints();
      await this.testTeamLogos();
      const data = await this.testComprehensiveDataLoading();
      
      if (data) {
        this.testCriticalFields(data);
        await this.testPerformance();
      }
      
      // Generate final report
      const report = this.generateReport();
      
      // Summary
      this.log('📊 TEST SUMMARY:', 'info');
      this.log(`Total Duration: ${report.duration}`, 'info');
      this.log(`API Endpoints: ${report.summary.apiSuccess}/${report.summary.apiEndpoints} working`, 
        report.summary.apiSuccess === report.summary.apiEndpoints ? 'success' : 'warning');
      this.log(`Team Logos: ${report.summary.logosWorking}/${report.summary.teamLogos} working`,
        report.summary.logosWorking === report.summary.teamLogos ? 'success' : 'warning');
      this.log(`Data Quality: ${report.summary.dataQuality}%`,
        report.summary.dataQuality >= 85 ? 'success' : 'warning');
      this.log(`Errors: ${report.summary.errors}`, 
        report.summary.errors === 0 ? 'success' : 'error');
      this.log(`Warnings: ${report.summary.warnings}`, 
        report.summary.warnings === 0 ? 'success' : 'warning');
      
      // Final verdict
      const isReady = report.summary.errors === 0 && 
                      report.summary.apiSuccess >= 4 && 
                      report.summary.logosWorking >= 12 &&
                      report.summary.dataQuality >= 80;
      
      if (isReady) {
        this.log('🎉 SEC IMPLEMENTATION READY FOR PRODUCTION!', 'success');
      } else {
        this.log('⚠️ SEC Implementation needs attention before production', 'warning');
      }
      
      this.log(`📄 Detailed report saved: screenshots/sec-implementation-report.json`, 'info');
      
      return report;
      
    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'error');
      return null;
    }
  }
}

// Execute tests if run directly
if (require.main === module) {
  const test = new SECImplementationTest();
  test.runAllTests()
    .then(report => {
      if (report) {
        console.log('\n✅ Test completed successfully');
        process.exit(0);
      } else {
        console.log('\n❌ Test failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Test suite crashed:', error);
      process.exit(1);
    });
}

module.exports = SECImplementationTest;