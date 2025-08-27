const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Mock Week 1 College Football data with 50+ teams
const week1Teams = [
    // SEC Teams
    { teamId: 333, team: "Alabama", conference: "SEC", spPlusRating: 25.5, spPlusRanking: 1 },
    { teamId: 61, team: "Georgia", conference: "SEC", spPlusRating: 24.2, spPlusRanking: 2 },
    { teamId: 251, team: "Texas", conference: "SEC", spPlusRating: 23.1, spPlusRanking: 3 },
    { teamId: 145, team: "Ole Miss", conference: "SEC", spPlusRating: 20.7, spPlusRanking: 4 },
    { teamId: 99, team: "LSU", conference: "SEC", spPlusRating: 20.1, spPlusRanking: 5 },
    { teamId: 2633, team: "Tennessee", conference: "SEC", spPlusRating: 19.4, spPlusRanking: 6 },
    { teamId: 245, team: "Texas A&M", conference: "SEC", spPlusRating: 18.3, spPlusRanking: 7 },
    { teamId: 201, team: "Oklahoma", conference: "SEC", spPlusRating: 17.5, spPlusRanking: 8 },
    { teamId: 57, team: "Florida", conference: "SEC", spPlusRating: 16.2, spPlusRanking: 9 },
    { teamId: 2567, team: "South Carolina", conference: "SEC", spPlusRating: 15.8, spPlusRanking: 10 },
    { teamId: 142, team: "Missouri", conference: "SEC", spPlusRating: 14.9, spPlusRanking: 11 },
    { teamId: 8, team: "Arkansas", conference: "SEC", spPlusRating: 13.2, spPlusRanking: 12 },
    { teamId: 344, team: "Auburn", conference: "SEC", spPlusRating: 12.5, spPlusRanking: 13 },
    { teamId: 2348, team: "Kentucky", conference: "SEC", spPlusRating: 11.8, spPlusRanking: 14 },
    { teamId: 2390, team: "Mississippi State", conference: "SEC", spPlusRating: 10.3, spPlusRanking: 15 },
    { teamId: 238, team: "Vanderbilt", conference: "SEC", spPlusRating: 8.9, spPlusRanking: 16 },

    // Big Ten
    { teamId: 194, team: "Ohio State", conference: "Big Ten", spPlusRating: 22.8, spPlusRanking: 4 },
    { teamId: 130, team: "Michigan", conference: "Big Ten", spPlusRating: 18.7, spPlusRanking: 8 },
    { teamId: 213, team: "Penn State", conference: "Big Ten", spPlusRanking: 9 },
    { teamId: 275, team: "Oregon", conference: "Big Ten", spPlusRating: 21.3, spPlusRanking: 6 },
    { teamId: 2633, team: "Wisconsin", conference: "Big Ten", spPlusRating: 15.2, spPlusRanking: 17 },
    { teamId: 2294, team: "Iowa", conference: "Big Ten", spPlusRating: 14.6, spPlusRanking: 18 },
    { teamId: 127, team: "Michigan State", conference: "Big Ten", spPlusRating: 13.8, spPlusRanking: 19 },
    { teamId: 356, team: "Minnesota", conference: "Big Ten", spPlusRating: 13.1, spPlusRanking: 20 },
    { teamId: 2633, team: "Nebraska", conference: "Big Ten", spPlusRating: 12.4, spPlusRanking: 21 },

    // Big 12
    { teamId: 2306, team: "Kansas State", conference: "Big 12", spPlusRating: 15.3, spPlusRanking: 18 },
    { teamId: 66, team: "Iowa State", conference: "Big 12", spPlusRating: 10.6, spPlusRanking: 31 },
    { teamId: 2305, team: "Kansas", conference: "Big 12", spPlusRating: 5.2, spPlusRanking: 48 },
    { teamId: 197, team: "Oklahoma State", conference: "Big 12", spPlusRating: 16.8, spPlusRanking: 14 },
    { teamId: 2440, team: "Utah", conference: "Big 12", spPlusRating: 17.2, spPlusRanking: 13 },

    // ACC
    { teamId: 52, team: "Clemson", conference: "ACC", spPlusRating: 19.8, spPlusRanking: 10 },
    { teamId: 120, team: "Miami", conference: "ACC", spPlusRating: 17.9, spPlusRanking: 12 },
    { teamId: 59, team: "Florida State", conference: "ACC", spPlusRating: 16.5, spPlusRanking: 15 },
    { teamId: 150, team: "North Carolina", conference: "ACC", spPlusRating: 15.7, spPlusRanking: 16 },
    { teamId: 24, team: "Stanford", conference: "ACC", spPlusRating: -5, spPlusRanking: 82 },

    // Pac-12 (remaining)
    { teamId: 30, team: "USC", conference: "Pac-12", spPlusRating: 18.1, spPlusRanking: 11 },
    { teamId: 26, team: "UCLA", conference: "Pac-12", spPlusRating: 14.3, spPlusRanking: 22 },
    { teamId: 2648, team: "Washington", conference: "Pac-12", spPlusRating: 16.9, spPlusRanking: 13 },
    { teamId: 2483, team: "Washington State", conference: "Pac-12", spPlusRating: 12.7, spPlusRanking: 23 },

    // Group of 5 and others
    { teamId: 2439, team: "UNLV", conference: "Mountain West", spPlusRating: -1.8, spPlusRanking: 73 },
    { teamId: 278, team: "Fresno State", conference: "Mountain West", spPlusRating: -6.5, spPlusRanking: 87 },
    { teamId: 98, team: "Western Kentucky", conference: "Conference USA", spPlusRating: -7, spPlusRanking: 89 },
    { teamId: 62, team: "Hawaii", conference: "Mountain West", spPlusRating: -11.6, spPlusRanking: 106 },
    { teamId: 2534, team: "Sam Houston", conference: "Conference USA", spPlusRating: -12.8, spPlusRanking: 109 },
    { teamId: 304, team: "Idaho State", conference: "Big Sky", spPlusRating: 0, spPlusRanking: 999 },
    { teamId: 2502, team: "Portland State", conference: "Big Sky", spPlusRating: 0, spPlusRanking: 999 },
    { teamId: 302, team: "UC Davis", conference: "Big Sky", spPlusRating: 0, spPlusRanking: 999 },

    // Additional major programs
    { teamId: 87, team: "Notre Dame", conference: "FBS Independents", spPlusRating: 19.1, spPlusRanking: 9 },
    { teamId: 2117, team: "Army", conference: "FBS Independents", spPlusRating: 8.3, spPlusRanking: 45 },
    { teamId: 2426, team: "Navy", conference: "American Athletic", spPlusRating: 6.7, spPlusRanking: 52 },

    // More teams to reach 60+
    { teamId: 9, team: "Arizona", conference: "Big 12", spPlusRating: 11.2, spPlusRanking: 28 },
    { teamId: 12, team: "Arizona State", conference: "Big 12", spPlusRating: 9.8, spPlusRanking: 35 },
    { teamId: 25, team: "Colorado", conference: "Big 12", spPlusRating: 8.9, spPlusRanking: 38 },
    { teamId: 154, team: "Duke", conference: "ACC", spPlusRating: 13.6, spPlusRanking: 24 },
    { teamId: 2, team: "Virginia Tech", conference: "ACC", spPlusRating: 12.1, spPlusRanking: 26 },
    { teamId: 259, team: "Virginia", conference: "ACC", spPlusRating: 10.8, spPlusRanking: 29 },

    // Conference USA, MAC, Sun Belt teams
    { teamId: 2006, team: "Akron", conference: "Mid-American", spPlusRating: -19.8, spPlusRanking: 131 },
    { teamId: 2050, team: "Ball State", conference: "Mid-American", spPlusRating: -21.9, spPlusRanking: 134 },
    { teamId: 113, team: "Massachusetts", conference: "Mid-American", spPlusRating: -24, spPlusRanking: 135 },
    { teamId: 2309, team: "Kent State", conference: "Mid-American", spPlusRating: -25.3, spPlusRanking: 136 },
    { teamId: 2429, team: "Charlotte", conference: "American Athletic", spPlusRating: -20.1, spPlusRanking: 132 },
    { teamId: 338, team: "Kennesaw State", conference: "Conference USA", spPlusRating: -20.1, spPlusRanking: 132 },
    { teamId: 167, team: "New Mexico", conference: "Mountain West", spPlusRating: -18.6, spPlusRanking: 130 },
];

// API endpoint
app.get('/api/standings/enhanced', (req, res) => {
    console.log(`📊 API called - returning ${week1Teams.length} teams`);
    
    res.json({
        success: true,
        data: week1Teams,
        metadata: {
            year: 2025,
            totalTeams: week1Teams.length,
            secTeams: week1Teams.filter(t => t.conference === 'SEC').length,
            lastUpdated: new Date().toISOString(),
            predictiveAccuracy: {
                spPlusCorrelation: 79,
                explosiveness: 86,
                efficiency: 74
            }
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Simple API server running' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Simple API server running on http://localhost:${port}`);
    console.log(`📊 API endpoint: http://localhost:${port}/api/standings/enhanced`);
    console.log(`❤️  Health check: http://localhost:${port}/health`);
});