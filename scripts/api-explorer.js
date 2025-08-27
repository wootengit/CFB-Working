/**
 * CFBD API Explorer for Sports Betting Tool
 * Systematically analyzes all available endpoints for team pages
 */

// Use built-in fetch (Node.js 18+) or dynamic import
const fetch = globalThis.fetch;

const BASE_URL = 'https://api.collegefootballdata.com';
const API_KEY = process.env.CFBD_API_KEY || null;

const headers = {
    'Accept': 'application/json',
    'User-Agent': 'CFB-Betting-Tool/2.0'
};

if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
}

// Critical endpoints for sports betting tool (product manager perspective)
const BETTING_CRITICAL_ENDPOINTS = {
    // Team Performance & Rankings (HIGH PRIORITY)
    teamStats: '/stats/season/teams',
    teamRecords: '/records',
    rankings: '/rankings',
    spRatings: '/ratings/sp',
    srsRatings: '/ratings/srs',
    elo: '/ratings/elo',
    
    // Game Data & Betting Lines (HIGHEST PRIORITY)
    games: '/games',
    gameLines: '/lines',
    gameStats: '/games/teams',
    gameMedia: '/games/media',
    
    // Team Information (HIGH PRIORITY)
    teams: '/teams',
    conferences: '/conferences',
    venues: '/venues',
    
    // Advanced Analytics (HIGH PRIORITY)
    ppa: '/ppa/teams',
    advancedStats: '/stats/season/advanced',
    teamTalent: '/talent',
    
    // Player Data (MEDIUM PRIORITY - Phase 2)
    roster: '/roster',
    playerStats: '/stats/player/season',
    playerUsage: '/player/usage',
    
    // Recruiting (MEDIUM PRIORITY)
    recruiting: '/recruiting/teams',
    recruitingPlayers: '/recruiting/players',
    
    // Historical Data (MEDIUM PRIORITY)
    teamHistory: '/teams/matchup',
    polls: '/polls',
    
    // Coaching & Staff (LOW PRIORITY)
    coaches: '/coaches'
};

// Conference structure for systematic team collection
const CONFERENCES = {
    FBS: [
        'SEC', 'Big Ten', 'Big 12', 'ACC', 'Pac-12',
        'American Athletic', 'Mountain West', 'MAC', 'Sun Belt', 'Conference USA',
        'FBS Independents'
    ],
    FCS: [
        'Big Sky', 'Colonial Athletic Association', 'Missouri Valley Football',
        'Southland', 'Western Athletic Conference', 'Southern Conference',
        'Patriot League', 'Ivy League', 'Mid-Eastern Athletic',
        'Southwestern Athletic', 'Ohio Valley', 'Northeast',
        'Pioneer Football League', 'FCS Independents'
    ]
};

async function makeAPICall(endpoint, params = {}) {
    try {
        const queryParams = new URLSearchParams(params);
        const url = `${BASE_URL}${endpoint}?${queryParams}`;
        
        console.log(`🔍 Testing: ${endpoint}`);
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            if (response.status === 401) {
                console.log(`⚠️  ${endpoint}: Requires API key`);
                return { requiresAuth: true, status: response.status };
            }
            console.log(`❌ ${endpoint}: Error ${response.status}`);
            return { error: true, status: response.status };
        }
        
        const data = await response.json();
        console.log(`✅ ${endpoint}: Success (${Array.isArray(data) ? data.length : 'object'} items)`);
        
        return {
            success: true,
            data: Array.isArray(data) ? data.slice(0, 3) : data, // Sample data
            totalCount: Array.isArray(data) ? data.length : 1
        };
    } catch (error) {
        console.log(`💥 ${endpoint}: ${error.message}`);
        return { error: true, message: error.message };
    }
}

async function exploreEndpoints() {
    console.log('🏈 CFBD API EXPLORATION FOR SPORTS BETTING TOOL');
    console.log('=' .repeat(60));
    
    const results = {};
    const currentYear = new Date().getFullYear();
    
    // Test each critical endpoint
    for (const [name, endpoint] of Object.entries(BETTING_CRITICAL_ENDPOINTS)) {
        const params = {};
        
        // Add year parameter for most endpoints
        if (endpoint !== '/teams' && endpoint !== '/conferences' && endpoint !== '/venues') {
            params.year = currentYear;
        }
        
        // Add season type for some endpoints
        if (endpoint.includes('games') || endpoint.includes('stats')) {
            params.seasonType = 'regular';
        }
        
        results[name] = await makeAPICall(endpoint, params);
        
        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
}

async function getTeamInventory() {
    console.log('\n🏫 COLLECTING TEAM INVENTORY');
    console.log('=' .repeat(40));
    
    // Get all teams
    const teamsResult = await makeAPICall('/teams', { year: new Date().getFullYear() });
    
    if (!teamsResult.success) {
        console.log('❌ Failed to get teams list');
        return null;
    }
    
    // Get all teams (not just sample)
    const fullTeamsResult = await makeAPICall('/teams', { year: new Date().getFullYear() });
    const allTeams = fullTeamsResult.data;
    
    // Organize by conference
    const teamsByConference = {};
    
    if (Array.isArray(allTeams)) {
        allTeams.forEach(team => {
            const conference = team.conference || 'Independent';
            if (!teamsByConference[conference]) {
                teamsByConference[conference] = [];
            }
            teamsByConference[conference].push({
                id: team.id,
                school: team.school,
                mascot: team.mascot,
                abbreviation: team.abbreviation,
                classification: team.classification,
                division: team.division
            });
        });
    }
    
    return teamsByConference;
}

async function validateConferenceCompleteness(teamsByConference) {
    console.log('\n📊 CONFERENCE COMPLETENESS VALIDATION');
    console.log('=' .repeat(50));
    
    const validationResults = {};
    
    // Known minimum team counts for major conferences (for validation)
    const expectedMinimumCounts = {
        'SEC': 14,
        'Big Ten': 14,
        'Big 12': 12,
        'ACC': 14,
        'Pac-12': 10, // Reduced due to recent changes
        'American Athletic': 12,
        'Mountain West': 11,
        'MAC': 12,
        'Sun Belt': 10,
        'Conference USA': 8
    };
    
    for (const [conference, teams] of Object.entries(teamsByConference)) {
        const teamCount = teams.length;
        const expectedMin = expectedMinimumCounts[conference] || 0;
        const isComplete = teamCount >= expectedMin;
        
        validationResults[conference] = {
            teamCount,
            expectedMinimum: expectedMin,
            isComplete: isComplete ? 1 : 0,
            teams: teams.map(t => t.school)
        };
        
        console.log(`${isComplete ? '✅' : '❌'} ${conference}: ${teamCount} teams (expected ≥${expectedMin})`);
    }
    
    return validationResults;
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting comprehensive CFBD API analysis...\n');
        
        // Phase 1: Explore API endpoints
        const apiResults = await exploreEndpoints();
        
        // Phase 2: Get team inventory
        const teamInventory = await getTeamInventory();
        
        // Phase 3: Validate completeness
        let validationResults = null;
        if (teamInventory) {
            validationResults = await validateConferenceCompleteness(teamInventory);
        }
        
        // Generate comprehensive report
        console.log('\n📋 COMPREHENSIVE ANALYSIS REPORT');
        console.log('=' .repeat(50));
        
        // API Endpoints Summary
        console.log('\n🔗 CRITICAL API ENDPOINTS FOR BETTING TOOL:');
        const workingEndpoints = Object.entries(apiResults)
            .filter(([name, result]) => result.success)
            .length;
        console.log(`✅ ${workingEndpoints}/${Object.keys(BETTING_CRITICAL_ENDPOINTS).length} endpoints working`);
        
        // Team Coverage Summary
        if (teamInventory) {
            const totalTeams = Object.values(teamInventory).reduce((sum, teams) => sum + teams.length, 0);
            const totalConferences = Object.keys(teamInventory).length;
            console.log(`\n🏫 TEAM COVERAGE:`);
            console.log(`📈 Total Teams: ${totalTeams}`);
            console.log(`🏆 Total Conferences: ${totalConferences}`);
        }
        
        // Conference Validation Summary
        if (validationResults) {
            const completeConferences = Object.values(validationResults)
                .filter(r => r.isComplete === 1).length;
            const totalConferences = Object.keys(validationResults).length;
            console.log(`\n🎯 CONFERENCE COMPLETENESS SCORE:`);
            console.log(`📊 Complete: ${completeConferences}/${totalConferences} conferences`);
        }
        
        // Save detailed results
        const fullReport = {
            timestamp: new Date().toISOString(),
            apiEndpoints: apiResults,
            teamInventory,
            validationResults,
            summary: {
                workingEndpoints,
                totalEndpoints: Object.keys(BETTING_CRITICAL_ENDPOINTS).length,
                totalTeams: teamInventory ? Object.values(teamInventory).reduce((sum, teams) => sum + teams.length, 0) : 0,
                totalConferences: teamInventory ? Object.keys(teamInventory).length : 0,
                completeConferences: validationResults ? Object.values(validationResults).filter(r => r.isComplete === 1).length : 0
            }
        };
        
        console.log('\n💾 Saving detailed report to cfbd-analysis-report.json');
        require('fs').writeFileSync(
            'cfbd-analysis-report.json', 
            JSON.stringify(fullReport, null, 2)
        );
        
        return fullReport;
        
    } catch (error) {
        console.error('💥 Analysis failed:', error);
        throw error;
    }
}

// Execute if run directly
if (require.main === module) {
    main()
        .then(report => {
            console.log('\n🎉 Analysis complete! Check cfbd-analysis-report.json for full details.');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Analysis failed:', error);
            process.exit(1);
        });
}

module.exports = { main, exploreEndpoints, getTeamInventory, validateConferenceCompleteness };