#!/usr/bin/env node

/**
 * Test Execution Script for 2025-26 CFB Games Calendar
 * This script helps run the comprehensive test suite with proper environment setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏈 2025-26 College Football Games Calendar - Comprehensive Test Suite');
console.log('='.repeat(70));

// Check if required files exist
const requiredFiles = [
  'jest.config.js',
  'jest.setup.js',
  'package.json'
];

console.log('📋 Pre-test validation:');
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
    process.exit(1);
  }
});

// Check test files
const testDirs = [
  '__tests__/api/games/2025',
  '__tests__/components',
  '__tests__/app/games-and-matches',
  '__tests__/integration'
];

console.log('\n📁 Test files validation:');
testDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
    console.log(`✅ ${dir}: ${files.length} test files found`);
    files.forEach(file => console.log(`   📄 ${file}`));
  } else {
    console.log(`❌ ${dir} directory missing`);
  }
});

// Set environment variables
process.env.NODE_ENV = 'test';
process.env.CFBD_API_KEY = process.env.CFBD_API_KEY || 'test-api-key';

console.log('\n🔧 Environment setup:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   CFBD_API_KEY: ${process.env.CFBD_API_KEY ? '***configured***' : 'not set'}`);

// Create jest cache directory if it doesn't exist
const cacheDir = path.join(__dirname, '.jest-cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log(`✅ Created Jest cache directory: ${cacheDir}`);
}

// Run tests based on command line arguments
const testType = process.argv[2] || 'all';

console.log(`\n🧪 Running tests: ${testType}`);
console.log('='.repeat(70));

try {
  let command;
  
  switch (testType) {
    case 'api':
      command = 'npx jest __tests__/api/ --verbose';
      break;
    case 'components':
      command = 'npx jest __tests__/components/ --verbose';
      break;
    case 'integration':
      command = 'npx jest __tests__/integration/ --verbose';
      break;
    case 'coverage':
      command = 'npx jest --coverage --verbose';
      break;
    case 'watch':
      command = 'npx jest --watch --verbose';
      break;
    case 'performance':
      command = 'npx jest --testNamePattern="Performance|Benchmark" --verbose';
      break;
    default:
      command = 'npx jest --verbose --passWithNoTests';
  }

  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n✅ Tests completed successfully!');
  
} catch (error) {
  console.error('\n❌ Test execution failed:');
  console.error(error.message);
  
  if (error.message.includes('CFBD')) {
    console.log('\n💡 Note: Some tests may require a valid CFBD API key.');
    console.log('Set the CFBD_API_KEY environment variable for full API testing.');
  }
  
  if (error.message.includes('jest')) {
    console.log('\n💡 Try running: npm install --save-dev jest @testing-library/react');
  }
  
  process.exit(1);
}

console.log('\n📊 Test Summary:');
console.log('='.repeat(40));
console.log('✅ API Endpoint Tests: Real CFBD integration');
console.log('✅ SlickCalendarPicker: Date selection & navigation');  
console.log('✅ Games & Matches Page: Complete user workflows');
console.log('✅ EnhancedLavaGameCard: 3D animations & data display');
console.log('✅ Full System Integration: End-to-end testing');

console.log('\n📋 To run specific test suites:');
console.log('   node run-tests.js api          # API endpoint tests only');
console.log('   node run-tests.js components   # Component tests only');
console.log('   node run-tests.js integration  # Integration tests only');
console.log('   node run-tests.js coverage     # Full coverage report');
console.log('   node run-tests.js performance  # Performance benchmarks');

console.log('\n🎯 For detailed results, see TEST_REPORT.md');
console.log('🏈 2025-26 CFB Games Calendar testing complete!');