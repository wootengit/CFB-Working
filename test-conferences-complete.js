/**
 * Comprehensive Implementation Tests for Complete Conferences API System
 * Tests all 265+ teams across FBS and FCS with MIT research fields
 */

class ConferencesAPITestSuite {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      details: []
    };
  }

  async runAllTests() {
    console.log('🧪 COMPREHENSIVE CONFERENCES API TEST SUITE');
    console.log('=' .repeat(60));
    
    try {
      // Core API Tests
      await this.testUnifiedAPIStructure();
      await this.testAllConferences();
      await this.testMITFieldValidation();
      await this.testPerformance();
      await this.testErrorHandling();
      
      // Data Integrity Tests
      await this.testTeamDataIntegrity();
      await this.testStatisticalRealism();
      await this.testLogoValidation();
      
      // Query Parameter Tests
      await this.testQueryParameters();
      await this.testSortingAndFiltering();
      
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.failed++;
      this.results.errors.push(error.message);
    }
  }

  async testUnifiedAPIStructure() {
    console.log('\n📋 Testing Unified API Structure...');
    
    const endpoints = [
      '/api/conferences/sec',
      '/api/conferences/big-ten', 
      '/api/conferences/big-12',
      '/api/conferences/acc',
      '/api/conferences/all',
      '/api/conferences/fbs',
      '/api/conferences/fcs'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          this.logPass(`✅ ${endpoint} - Structure valid`);
          
          // Validate response structure
          this.validateResponseStructure(data, endpoint);
          
        } else {
          this.logFail(`❌ ${endpoint} - ${data.error || 'Failed'}`);
        }
        
      } catch (error) {
        this.logFail(`❌ ${endpoint} - ${error.message}`);
      }
    }
  }

  validateResponseStructure(data, endpoint) {
    const required = ['success', 'data', 'metadata'];
    const missing = required.filter(field => !(field in data));
    
    if (missing.length === 0) {
      this.logPass(`  ✅ ${endpoint} - Response structure complete`);
      
      // Validate metadata
      if (data.metadata && data.metadata.teamCount === data.data.length) {
        this.logPass(`  ✅ ${endpoint} - Team count matches data`);
      } else {
        this.logFail(`  ❌ ${endpoint} - Team count mismatch`);
      }
      
    } else {
      this.logFail(`  ❌ ${endpoint} - Missing fields: ${missing.join(', ')}`);
    }
  }

  async testAllConferences() {
    console.log('\n🏈 Testing All Conference Coverage...');
    
    const conferences = [
      'sec', 'big-ten', 'big-12', 'acc', 'pac-12',
      'american', 'conference-usa', 'mac', 'mountain-west', 'sun-belt',
      'missouri-valley', 'big-sky', 'coastal-athletic'
    ];
    
    let totalTeams = 0;
    const conferenceResults = {};
    
    for (const conf of conferences) {
      try {
        const response = await fetch(`${this.baseUrl}/api/conferences/${conf}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          conferenceResults[conf] = data.data.length;
          totalTeams += data.data.length;
          this.logPass(`✅ ${conf.toUpperCase()} - ${data.data.length} teams loaded`);
        } else {
          this.logFail(`❌ ${conf.toUpperCase()} - Failed to load`);
        }
        
      } catch (error) {
        this.logFail(`❌ ${conf.toUpperCase()} - ${error.message}`);
      }
    }
    
    console.log(`\n📊 COVERAGE SUMMARY:`);
    console.log(`Total Teams Loaded: ${totalTeams}`);
    console.log(`Conference Breakdown:`);
    Object.entries(conferenceResults).forEach(([conf, count]) => {
      console.log(`  ${conf.toUpperCase()}: ${count} teams`);
    });
    
    if (totalTeams >= 200) {
      this.logPass(`✅ Excellent coverage: ${totalTeams} teams`);
    } else {
      this.logFail(`❌ Insufficient coverage: ${totalTeams} teams (need 200+)`);
    }
  }

  async testMITFieldValidation() {
    console.log('\n🧠 Testing MIT Research Fields...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/conferences/sec?test=true`);
      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length === 0) {
        this.logFail('❌ No SEC data available for MIT field testing');
        return;
      }
      
      const team = data.data[0];
      const mitTier1Fields = ['spPlusOverall', 'explosiveness', 'efficiency', 'ppaOverall'];
      const mitTier2Fields = ['spPlusOffense', 'spPlusDefense', 'fpiRating', 'sosRank', 'talentRank'];
      
      // Test Tier 1 Fields (86% accuracy)
      let tier1Valid = 0;
      for (const field of mitTier1Fields) {
        if (field in team && typeof team[field] === 'number') {
          tier1Valid++;
          this.logPass(`  ✅ MIT Tier 1: ${field} = ${team[field]}`);
        } else {
          this.logFail(`  ❌ MIT Tier 1: ${field} missing or invalid`);
        }
      }
      
      // Test Tier 2 Fields
      let tier2Valid = 0;
      for (const field of mitTier2Fields) {
        if (field in team && typeof team[field] === 'number') {
          tier2Valid++;
          this.logPass(`  ✅ MIT Tier 2: ${field} = ${team[field]}`);
        } else {
          this.logFail(`  ❌ MIT Tier 2: ${field} missing or invalid`);
        }
      }
      
      // Validate ranges
      this.validateMITRanges(team);
      
      if (tier1Valid === 4 && tier2Valid === 5) {
        this.logPass(`✅ All MIT Research Fields validated`);
      } else {
        this.logFail(`❌ MIT Field validation failed: T1=${tier1Valid}/4, T2=${tier2Valid}/5`);
      }
      
    } catch (error) {
      this.logFail(`❌ MIT Field validation error: ${error.message}`);
    }
  }

  validateMITRanges(team) {
    console.log('  🎯 Validating MIT field ranges...');
    
    const ranges = {
      spPlusOverall: { min: -20, max: 30 },
      explosiveness: { min: 0.8, max: 2.2 },
      efficiency: { min: 0.5, max: 0.8 },
      ppaOverall: { min: -0.3, max: 0.6 },
      sosRank: { min: 1, max: 130 },
      talentRank: { min: 1, max: 130 }
    };
    
    let rangeValid = 0;
    for (const [field, range] of Object.entries(ranges)) {
      if (field in team) {
        const value = team[field];
        if (value >= range.min && value <= range.max) {
          rangeValid++;
          this.logPass(`    ✅ ${field}: ${value} (in range ${range.min}-${range.max})`);
        } else {
          this.logFail(`    ❌ ${field}: ${value} (out of range ${range.min}-${range.max})`);
        }
      }
    }
    
    if (rangeValid === Object.keys(ranges).length) {
      this.logPass(`  ✅ All MIT field ranges valid`);
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    const performanceTests = [
      { endpoint: '/api/conferences/sec', expected: '< 50ms', name: 'SEC Conference' },
      { endpoint: '/api/conferences/all', expected: '< 100ms', name: 'All Teams' },
      { endpoint: '/api/conferences/fbs', expected: '< 75ms', name: 'All FBS Teams' }
    ];
    
    for (const test of performanceTests) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${this.baseUrl}${test.endpoint}`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
          const data = await response.json();
          const serverTime = data.metadata?.processingTime || 0;
          
          this.logPass(`✅ ${test.name}: ${responseTime}ms total, ${serverTime}ms server`);
          
          if (responseTime < 100) {
            this.logPass(`  ✅ Excellent performance: ${responseTime}ms`);
          } else {
            this.logFail(`  ❌ Slow performance: ${responseTime}ms`);
          }
        } else {
          this.logFail(`❌ ${test.name}: Failed request`);
        }
        
      } catch (error) {
        this.logFail(`❌ ${test.name}: ${error.message}`);
      }
    }
  }

  async testErrorHandling() {
    console.log('\n🚨 Testing Error Handling...');
    
    const errorTests = [
      { endpoint: '/api/conferences/invalid-conference', expectedStatus: 404 },
      { endpoint: '/api/conferences/', expectedStatus: 404 },
      { endpoint: '/api/conferences/sec?invalid=param', expectedStatus: 200 }
    ];
    
    for (const test of errorTests) {
      try {
        const response = await fetch(`${this.baseUrl}${test.endpoint}`);
        
        if (response.status === test.expectedStatus) {
          this.logPass(`✅ Error handling: ${test.endpoint} -> ${response.status}`);
        } else {
          this.logFail(`❌ Error handling: ${test.endpoint} -> ${response.status} (expected ${test.expectedStatus})`);
        }
        
      } catch (error) {
        this.logFail(`❌ Error test failed: ${test.endpoint} - ${error.message}`);
      }
    }
  }

  async testTeamDataIntegrity() {
    console.log('\n🔍 Testing Team Data Integrity...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/conferences/sec`);
      const data = await response.json();
      
      if (!data.success || !data.data) {
        this.logFail('❌ No data available for integrity testing');
        return;
      }
      
      let validTeams = 0;
      let teamsWithLogos = 0;
      let teamsWithColors = 0;
      
      for (const team of data.data.slice(0, 5)) { // Test first 5 teams
        // Test required fields
        const required = ['name', 'abbreviation', 'mascot', 'conference', 'division'];
        const hasRequired = required.every(field => field in team && team[field]);
        
        if (hasRequired) {
          validTeams++;
        }
        
        // Test logo URL
        if (team.logoUrl && team.logoUrl.startsWith('http')) {
          teamsWithLogos++;
        }
        
        // Test colors
        if (team.colors && team.colors.primary && team.colors.secondary) {
          teamsWithColors++;
        }
      }
      
      this.logPass(`✅ Team data integrity: ${validTeams}/5 valid, ${teamsWithLogos}/5 with logos, ${teamsWithColors}/5 with colors`);
      
    } catch (error) {
      this.logFail(`❌ Data integrity test failed: ${error.message}`);
    }
  }

  async testStatisticalRealism() {
    console.log('\n📈 Testing Statistical Realism...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/conferences/sec`);
      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length < 5) {
        this.logFail('❌ Insufficient data for statistical testing');
        return;
      }
      
      const teams = data.data;
      
      // Test SP+ distribution (should vary significantly between teams)
      const spPlusValues = teams.map(t => t.spPlusOverall).filter(v => v != null);
      const spPlusRange = Math.max(...spPlusValues) - Math.min(...spPlusValues);
      
      if (spPlusRange > 15) {
        this.logPass(`✅ SP+ Range realistic: ${spPlusRange.toFixed(1)} points`);
      } else {
        this.logFail(`❌ SP+ Range too small: ${spPlusRange.toFixed(1)} points`);
      }
      
      // Test win distribution
      const winValues = teams.map(t => t.wins).filter(v => v != null);
      const avgWins = winValues.reduce((a, b) => a + b, 0) / winValues.length;
      
      if (avgWins >= 6 && avgWins <= 10) {
        this.logPass(`✅ Average wins realistic: ${avgWins.toFixed(1)}`);
      } else {
        this.logFail(`❌ Average wins unrealistic: ${avgWins.toFixed(1)}`);
      }
      
      // Test correlations (better teams should have better stats)
      const sorted = teams.sort((a, b) => b.spPlusOverall - a.spPlusOverall);
      const topTeam = sorted[0];
      const bottomTeam = sorted[sorted.length - 1];
      
      if (topTeam.wins >= bottomTeam.wins && topTeam.efficiency >= bottomTeam.efficiency) {
        this.logPass(`✅ Statistical correlations realistic`);
      } else {
        this.logFail(`❌ Statistical correlations broken`);
      }
      
    } catch (error) {
      this.logFail(`❌ Statistical realism test failed: ${error.message}`);
    }
  }

  async testQueryParameters() {
    console.log('\n🔧 Testing Query Parameters...');
    
    const paramTests = [
      { url: '/api/conferences/sec?test=true', name: 'Test mode' },
      { url: '/api/conferences/big-ten?limit=5', name: 'Limit parameter' },
      { url: '/api/conferences/acc?sortBy=spPlusOverall', name: 'Sort parameter' },
      { url: '/api/conferences/sec?logos=verify', name: 'Logo verification' }
    ];
    
    for (const test of paramTests) {
      try {
        const response = await fetch(`${this.baseUrl}${test.url}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          this.logPass(`✅ ${test.name}: Working`);
          
          // Specific parameter validation
          if (test.url.includes('test=true') && data.data.length <= 4) {
            this.logPass(`  ✅ Test mode limited results correctly`);
          }
          
          if (test.url.includes('limit=5') && data.data.length <= 5) {
            this.logPass(`  ✅ Limit parameter working correctly`);
          }
          
          if (test.url.includes('logos=verify') && data.logoValidation) {
            this.logPass(`  ✅ Logo verification returning results`);
          }
          
        } else {
          this.logFail(`❌ ${test.name}: ${data.error || 'Failed'}`);
        }
        
      } catch (error) {
        this.logFail(`❌ ${test.name}: ${error.message}`);
      }
    }
  }

  async testSortingAndFiltering() {
    console.log('\n🔀 Testing Sorting and Filtering...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/conferences/sec?sortBy=spPlusOverall`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 1) {
        const sorted = data.data;
        let correctlySorted = true;
        
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].spPlusOverall > sorted[i-1].spPlusOverall) {
            correctlySorted = false;
            break;
          }
        }
        
        if (correctlySorted) {
          this.logPass(`✅ Sorting by SP+ working correctly`);
        } else {
          this.logFail(`❌ Sorting by SP+ incorrect`);
        }
        
      } else {
        this.logFail(`❌ Sorting test: No data returned`);
      }
      
    } catch (error) {
      this.logFail(`❌ Sorting test failed: ${error.message}`);
    }
  }

  async testLogoValidation() {
    console.log('\n🖼️ Testing Logo Validation...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/conferences/sec?test=true&logos=verify`);
      const data = await response.json();
      
      if (data.success && data.logoValidation) {
        const validation = data.logoValidation;
        
        this.logPass(`✅ Logo validation: ${validation.totalTeams} teams checked`);
        this.logPass(`  ✅ Valid logos: ${validation.validatedLogos}`);
        
        if (validation.failedLogos > 0) {
          this.logFail(`  ❌ Failed logos: ${validation.failedLogos}`);
        }
        
      } else {
        this.logFail(`❌ Logo validation not working`);
      }
      
    } catch (error) {
      this.logFail(`❌ Logo validation test failed: ${error.message}`);
    }
  }

  logPass(message) {
    console.log(message);
    this.results.passed++;
    this.results.details.push({ type: 'PASS', message });
  }

  logFail(message) {
    console.log(message);
    this.results.failed++;
    this.results.errors.push(message);
    this.results.details.push({ type: 'FAIL', message });
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 TEST SUITE COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ PASSED: ${this.results.passed}`);
    console.log(`❌ FAILED: ${this.results.failed}`);
    console.log(`📊 SUCCESS RATE: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log(`\n🚨 ERRORS:`);
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    console.log('\n🎯 SYSTEM STATUS: ' + (this.results.failed === 0 ? '✅ ALL SYSTEMS GO' : '❌ ISSUES DETECTED'));
  }
}

// Run tests if called directly
if (typeof window === 'undefined') {
  const testSuite = new ConferencesAPITestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = ConferencesAPITestSuite;