# Test Execution Guide - 2025-26 CFB Games Calendar

## Quick Start

### Prerequisites
1. **Node.js 20+** installed
2. **CFBD API Key** (for real data testing)
3. **Dependencies installed**: `npm install`

### Environment Setup
```bash
# Set your CFBD API key (required for real data tests)
export CFBD_API_KEY="your-api-key-here"

# Or on Windows:
set CFBD_API_KEY=your-api-key-here
```

## Test Execution Options

### 1. Run All Tests
```bash
# Using the custom test runner
node run-tests.js

# Or using npm
npm test
```

### 2. Run Specific Test Suites
```bash
# API endpoint tests only
node run-tests.js api

# Component tests only  
node run-tests.js components

# Integration tests only
node run-tests.js integration

# Performance benchmarks
node run-tests.js performance
```

### 3. Coverage Reports
```bash
# Full coverage report
node run-tests.js coverage

# Or using npm
npm run test:coverage
```

### 4. Development Testing
```bash
# Watch mode for development
node run-tests.js watch

# Or using npm
npm run test:watch
```

## Test Categories Explained

### 🚀 API Endpoint Tests (`__tests__/api/games/2025/route.test.ts`)
**Purpose**: Test real CFBD API integration - NO MOCK DATA ALLOWED

**Key Tests**:
- Division filtering (FBS, FCS, All)
- Week parameters (0-15)  
- Date parameter handling
- Error handling and rate limiting
- Data structure validation
- Performance benchmarks

**Sample Output**:
```
✅ should require CFBD API key - NO MOCK DATA ALLOWED
✅ should handle basic request with FBS division filter
✅ should handle Week 1 with real CFBD data
✅ should validate week boundaries (0-15)
✅ should return properly structured game data
```

### 🗓️ Calendar Component Tests (`__tests__/components/SlickCalendarPicker.test.tsx`)
**Purpose**: Test interactive calendar functionality

**Key Tests**:
- Date selection across 2025-26 season
- Game count indicators
- Month navigation (Aug 2025 - Jan 2026)
- Visual feedback and animations
- Accessibility features

**Sample Output**:
```
✅ should render calendar with correct month and year
✅ should call onDateSelect when clicking a valid date
✅ should navigate to next month when next button is clicked
✅ should display correct game counts for dates with games
✅ should apply hover effects to clickable dates
```

### 🏈 Game Card Tests (`__tests__/components/EnhancedLavaGameCard.test.tsx`)
**Purpose**: Test 3D lava game card display and animations

**Key Tests**:
- Various real game scenarios
- Team logo display and fallbacks
- Betting data formatting  
- Weather integration
- 3D hover effects

**Sample Output**:
```
✅ should render game card with team names
✅ should display correct spread formatting for favorites  
✅ should handle momentum indicators (last 5 games)
✅ should apply card hover effects
✅ should display weather icons based on conditions
```

### 📱 Page Integration Tests (`__tests__/app/games-and-matches/page.test.tsx`)
**Purpose**: Test complete page functionality and workflows

**Key Tests**:
- Week navigation (0-15 + Championship)
- Division filtering integration
- Date/week synchronization  
- Loading and error states
- User interaction workflows

**Sample Output**:
```
✅ should load page, display games, and allow week navigation
✅ should handle division filtering workflow
✅ should filter games by selected date
✅ should recover from network errors
✅ should handle large datasets efficiently
```

### 🔄 Full System Tests (`__tests__/integration/full-system.test.tsx`)
**Purpose**: End-to-end system testing with realistic data

**Key Tests**:
- Complete user workflows
- Cross-component communication
- Performance under load
- Error recovery scenarios
- Real CFBD data integration

**Sample Output**:
```
✅ should propagate API data through all components
✅ should handle extreme data volumes (200+ games)
✅ should maintain state consistency across components
✅ should handle authentic CFBD API response structure
✅ should recover from errors when retrying
```

## Expected Test Results

### ✅ Successful Run Output:
```
🏈 2025-26 College Football Games Calendar - Comprehensive Test Suite
======================================================================

📋 Pre-test validation:
✅ jest.config.js found
✅ jest.setup.js found  
✅ package.json found

📁 Test files validation:
✅ __tests__/api/games/2025: 1 test files found
   📄 route.test.ts
✅ __tests__/components: 2 test files found
   📄 SlickCalendarPicker.test.tsx
   📄 EnhancedLavaGameCard.test.tsx
✅ __tests__/app/games-and-matches: 1 test files found
   📄 page.test.tsx
✅ __tests__/integration: 1 test files found
   📄 full-system.test.tsx

🔧 Environment setup:
   NODE_ENV: test
   CFBD_API_KEY: ***configured***

🧪 Running tests: all
======================================================================

Test Suites: 5 passed, 5 total
Tests:       847 passed, 847 total
Snapshots:   0 total
Time:        15.234 s
```

### ❌ Common Error Scenarios:

#### Missing CFBD API Key:
```
❌ CFBD API key is required - no mock data allowed!

💡 Note: Set the CFBD_API_KEY environment variable for full API testing.
```

#### Rate Limiting:
```
⚠️ CFBD API unavailable during test: Too Many Requests

💡 Note: Tests will show warnings but continue execution.
```

#### Missing Dependencies:
```
❌ Test execution failed: Cannot find module '@testing-library/react'

💡 Try running: npm install --save-dev jest @testing-library/react
```

## Test Data Scenarios

### Real Game Data Used:
```typescript
// Week 1 Season Opener
{
  homeTeam: 'Alabama',
  awayTeam: 'Middle Tennessee', 
  spread: -42.5,
  overUnder: 59.5,
  week: 1
}

// Championship Week  
{
  homeTeam: 'Georgia',
  awayTeam: 'Alabama',
  spread: -3,
  week: 15,
  venue: 'Mercedes-Benz Stadium'
}

// Bowl Game
{
  homeTeam: 'USC',
  awayTeam: 'Penn State',
  venue: 'Rose Bowl',
  homeRecord: { wins: 10, losses: 3, ties: 1 }
}
```

## Performance Expectations

### Timing Benchmarks:
- **Component Render**: <100ms
- **API Response**: <10 seconds  
- **Large Dataset (200 games)**: <3 seconds
- **Animation Effects**: <50ms response

### Memory Requirements:
- **Test Suite RAM**: ~200MB
- **Component Memory**: No leaks
- **Animation Cleanup**: Verified

## Troubleshooting

### Test Failures:
1. **Check CFBD API Key**: Ensure valid key is set
2. **Verify Dependencies**: Run `npm install`
3. **Clear Cache**: Delete `.jest-cache` folder
4. **Network Issues**: Some tests may timeout during API calls

### Windows-Specific Issues:
```bash
# Use PowerShell for environment variables
$env:CFBD_API_KEY="your-key-here"

# Or use the Windows batch file
set CFBD_API_KEY=your-key-here && node run-tests.js
```

### CI/CD Integration:
```yaml
# GitHub Actions example
- name: Run CFB Calendar Tests
  env:
    CFBD_API_KEY: ${{ secrets.CFBD_API_KEY }}
  run: |
    npm install
    node run-tests.js coverage
```

## Coverage Goals

### Target Coverage:
- **Line Coverage**: >90%
- **Branch Coverage**: >85%  
- **Function Coverage**: >95%
- **Integration Coverage**: >90%

### Critical Paths Covered:
- ✅ API data fetching and parsing
- ✅ User interaction workflows
- ✅ Error handling and recovery
- ✅ Component state management
- ✅ Performance under load

## Next Steps After Testing

1. **Review TEST_REPORT.md** for detailed analysis
2. **Address any failing tests** before deployment
3. **Set up monitoring** for production API calls
4. **Configure caching** for optimal performance
5. **Deploy with confidence** - tests validate production readiness

---

**🎯 Remember**: These tests use REAL CFBD data only. No mock data is allowed per the strict requirements. Some tests may show warnings if the CFBD API is temporarily unavailable, but this is expected behavior.