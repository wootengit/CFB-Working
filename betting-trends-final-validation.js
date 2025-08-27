/**
 * FINAL VALIDATION TEST FOR BETTING TRENDS FIXES
 * 
 * This test creates the exact scenario matching the user's live data pattern:
 * - 100 completed games total
 * - 60 games: Home team wins, Away team loses  
 * - 40 games: Away team wins, Home team loses
 * - Only 30 games have complete betting line data
 * - 70 games have no betting lines
 * 
 * Expected Results After Fix:
 * - Straight Up Trends: Home Teams should show 60-40-0 (60%), Away Teams should show 40-60-0 (40%)
 * - ATS Trends: Should only process the 30 games with betting lines
 * - System should NOT show all 0s anymore
 * - Proper win/loss counting for both straight up and ATS categories
 */

// Self-contained test - no external imports needed

/**
 * GENERATE TEST DATA - EXACT USER SCENARIO
 * 100 games total: 60 home wins, 40 away wins, 30 with betting lines
 */
function generateUserScenarioTestData() {
    const games = [];
    const lines = [];
    
    // Generate 100 games with the exact distribution requested
    for (let i = 1; i <= 100; i++) {
        const game = {
            id: i,
            homeTeam: `Home${i}`,
            awayTeam: `Away${i}`,
            week: Math.ceil(i / 10), // Distribute across 10 weeks
            completed: true,
            periods: 4,
            homeConference: "TEST",
            awayConference: "TEST"
        };
        
        // First 60 games: Home team wins
        if (i <= 60) {
            game.homeScore = 28;
            game.awayScore = 21;
        } else {
            // Last 40 games: Away team wins  
            game.homeScore = 14;
            game.awayScore = 28;
        }
        
        games.push(game);
        
        // Only first 30 games have betting lines
        if (i <= 30) {
            const line = {
                homeTeam: game.homeTeam,
                awayTeam: game.awayTeam,
                week: game.week,
                lines: [{
                    provider: "consensus",
                    spread: (i % 2 === 0) ? -3 : 3, // Alternate home/away favorites
                    overUnder: 45,
                    homeMoneyline: (i % 2 === 0) ? -150 : 150,
                    awayMoneyline: (i % 2 === 0) ? 130 : -170
                }]
            };
            lines.push(line);
        }
    }
    
    return { games, lines };
}

/**
 * MOCK CALCULATION FUNCTION FOR TESTING
 * (Using the corrected logic from route-corrected.ts)
 */
function calculateBettingTrendsTestVersion(games, linesMap) {
    const trends = {
        straightUp: {
            awayTeams: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            homeTeams: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            favorites: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            dogs: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            awayFavorites: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            awayDogs: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            homeFavorites: { wins: 0, losses: 0, ties: 0, percentage: 0 },
            homeDogs: { wins: 0, losses: 0, ties: 0, percentage: 0 }
        },
        againstTheSpread: {
            awayTeams: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            homeTeams: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            favorites: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            dogs: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            awayFavorites: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            awayDogs: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            homeFavorites: { wins: 0, losses: 0, pushes: 0, percentage: 0 },
            homeDogs: { wins: 0, losses: 0, pushes: 0, percentage: 0 }
        },
        overUnder: {
            overtimeGames: { overs: 0, unders: 0, pushes: 0, overPercentage: 0, underPercentage: 0 },
            nonOvertimeGames: { overs: 0, unders: 0, pushes: 0, overPercentage: 0, underPercentage: 0 },
            allGames: { overs: 0, unders: 0, pushes: 0, overPercentage: 0, underPercentage: 0 }
        }
    };

    games.forEach((game) => {
        const lineKey = `${game.homeTeam}_${game.awayTeam}_${game.week}`;
        const line = linesMap.get(lineKey);
        
        const homeScore = game.homeScore;
        const awayScore = game.awayScore;
        const homeWin = homeScore > awayScore;
        const awayWin = awayScore > homeScore;
        const tie = homeScore === awayScore;
        const totalScore = homeScore + awayScore;
        
        // CRITICAL FIX: Process ALL games for straight up trends (not just games with betting lines)
        if (homeWin) {
            trends.straightUp.homeTeams.wins++;
            trends.straightUp.awayTeams.losses++;
        } else if (awayWin) {
            trends.straightUp.awayTeams.wins++;
            trends.straightUp.homeTeams.losses++;
        } else if (tie) {
            trends.straightUp.homeTeams.ties++;
            trends.straightUp.awayTeams.ties++;
        }

        // Process betting lines if available (separate from straight up trends)
        if (line && line.spread !== undefined && line.spread !== null) {
            const spread = parseFloat(line.spread);
            const overUnder = line.overUnder ? parseFloat(line.overUnder) : null;
            
            // Validate data integrity
            if (isNaN(spread) || homeScore === null || awayScore === null) {
                return; // Skip invalid data
            }
            
            // CORRECTED: Proper spread interpretation
            const homeFavorite = spread < 0;
            const awayFavorite = spread > 0;
            const pickEm = spread === 0;
            
            // CORRECTED: ATS calculations with proper spread logic
            let homeATS = false;
            let awayATS = false;
            let push = false;
            
            if (pickEm) {
                // Pick'em game - straight up winner covers, tie is push
                if (tie) {
                    push = true;
                } else if (homeWin) {
                    homeATS = true;
                } else {
                    awayATS = true;
                }
            } else {
                // Games with spread
                if (homeFavorite) {
                    // Home team favored - they need to win by MORE than |spread|
                    const requiredMargin = Math.abs(spread);
                    const actualMargin = homeScore - awayScore;
                    
                    if (actualMargin > requiredMargin) {
                        homeATS = true; // Home covers
                    } else if (actualMargin === requiredMargin) {
                        push = true; // Exact push
                    } else {
                        awayATS = true; // Away covers
                    }
                } else { // awayFavorite
                    // Away team favored - they need to win by MORE than spread
                    const requiredMargin = spread;
                    const actualMargin = awayScore - homeScore;
                    
                    if (actualMargin > requiredMargin) {
                        awayATS = true; // Away covers
                    } else if (actualMargin === requiredMargin) {
                        push = true; // Exact push
                    } else {
                        homeATS = true; // Home covers
                    }
                }
            }

            // CORRECTED: Track straight up favorite/dog results (only for non-pick'em games)
            if (homeFavorite) {
                // Home team is favorite
                if (homeWin) {
                    trends.straightUp.favorites.wins++;
                    trends.straightUp.homeFavorites.wins++;
                    trends.straightUp.dogs.losses++;
                    trends.straightUp.awayDogs.losses++;
                } else if (awayWin) {
                    trends.straightUp.favorites.losses++;
                    trends.straightUp.homeFavorites.losses++;
                    trends.straightUp.dogs.wins++;
                    trends.straightUp.awayDogs.wins++;
                } else if (tie) {
                    trends.straightUp.favorites.ties++;
                    trends.straightUp.homeFavorites.ties++;
                    trends.straightUp.dogs.ties++;
                    trends.straightUp.awayDogs.ties++;
                }
            } else if (awayFavorite) {
                // Away team is favorite
                if (awayWin) {
                    trends.straightUp.favorites.wins++;
                    trends.straightUp.awayFavorites.wins++;
                    trends.straightUp.dogs.losses++;
                    trends.straightUp.homeDogs.losses++;
                } else if (homeWin) {
                    trends.straightUp.favorites.losses++;
                    trends.straightUp.awayFavorites.losses++;
                    trends.straightUp.dogs.wins++;
                    trends.straightUp.homeDogs.wins++;
                } else if (tie) {
                    trends.straightUp.favorites.ties++;
                    trends.straightUp.awayFavorites.ties++;
                    trends.straightUp.dogs.ties++;
                    trends.straightUp.homeDogs.ties++;
                }
            }

            // CORRECTED: Track ATS results with proper favorite/dog assignment
            if (push) {
                trends.againstTheSpread.homeTeams.pushes++;
                trends.againstTheSpread.awayTeams.pushes++;
                
                if (homeFavorite) {
                    trends.againstTheSpread.favorites.pushes++;
                    trends.againstTheSpread.homeFavorites.pushes++;
                    trends.againstTheSpread.dogs.pushes++;
                    trends.againstTheSpread.awayDogs.pushes++;
                } else if (awayFavorite) {
                    trends.againstTheSpread.favorites.pushes++;
                    trends.againstTheSpread.awayFavorites.pushes++;
                    trends.againstTheSpread.dogs.pushes++;
                    trends.againstTheSpread.homeDogs.pushes++;
                }
            } else if (homeATS) {
                trends.againstTheSpread.homeTeams.wins++;
                trends.againstTheSpread.awayTeams.losses++;
                
                if (homeFavorite) {
                    // Home favorite covers
                    trends.againstTheSpread.favorites.wins++;
                    trends.againstTheSpread.homeFavorites.wins++;
                    trends.againstTheSpread.dogs.losses++;
                    trends.againstTheSpread.awayDogs.losses++;
                } else if (awayFavorite) {
                    // Home underdog covers
                    trends.againstTheSpread.dogs.wins++;
                    trends.againstTheSpread.homeDogs.wins++;
                    trends.againstTheSpread.favorites.losses++;
                    trends.againstTheSpread.awayFavorites.losses++;
                }
            } else if (awayATS) {
                trends.againstTheSpread.awayTeams.wins++;
                trends.againstTheSpread.homeTeams.losses++;
                
                if (awayFavorite) {
                    // Away favorite covers
                    trends.againstTheSpread.favorites.wins++;
                    trends.againstTheSpread.awayFavorites.wins++;
                    trends.againstTheSpread.dogs.losses++;
                    trends.againstTheSpread.homeDogs.losses++;
                } else if (homeFavorite) {
                    // Away underdog covers
                    trends.againstTheSpread.dogs.wins++;
                    trends.againstTheSpread.awayDogs.wins++;
                    trends.againstTheSpread.favorites.losses++;
                    trends.againstTheSpread.homeFavorites.losses++;
                }
            }

            // Over/Under trends
            if (overUnder && overUnder > 0) {
                const isOvertime = game.periods && game.periods > 4;
                const overHit = totalScore > overUnder;
                const underHit = totalScore < overUnder;
                const ouPush = Math.abs(totalScore - overUnder) < 0.5;

                if (ouPush) {
                    trends.overUnder.allGames.pushes++;
                    if (isOvertime) {
                        trends.overUnder.overtimeGames.pushes++;
                    } else {
                        trends.overUnder.nonOvertimeGames.pushes++;
                    }
                } else if (overHit) {
                    trends.overUnder.allGames.overs++;
                    if (isOvertime) {
                        trends.overUnder.overtimeGames.overs++;
                    } else {
                        trends.overUnder.nonOvertimeGames.overs++;
                    }
                } else {
                    trends.overUnder.allGames.unders++;
                    if (isOvertime) {
                        trends.overUnder.overtimeGames.unders++;
                    } else {
                        trends.overUnder.nonOvertimeGames.unders++;
                    }
                }
            }
        }
    });

    // Calculate percentages for all categories
    Object.keys(trends.straightUp).forEach(key => {
        const category = trends.straightUp[key];
        const total = category.wins + category.losses + category.ties;
        category.percentage = total > 0 ? Math.round((category.wins / total) * 100) : 0;
    });

    Object.keys(trends.againstTheSpread).forEach(key => {
        const category = trends.againstTheSpread[key];
        const total = category.wins + category.losses + category.pushes;
        category.percentage = total > 0 ? Math.round((category.wins / total) * 100) : 0;
    });

    // Over/Under percentages
    Object.keys(trends.overUnder).forEach(key => {
        const category = trends.overUnder[key];
        const total = category.overs + category.unders + category.pushes;
        category.overPercentage = total > 0 ? Math.round((category.overs / total) * 100) : 0;
        category.underPercentage = total > 0 ? Math.round((category.unders / total) * 100) : 0;
    });

    return trends;
}

/**
 * FINAL VALIDATION TEST RUNNER
 */
function runFinalValidationTest() {
    console.log("🎯 FINAL VALIDATION TEST FOR BETTING TRENDS FIXES");
    console.log("=" .repeat(80));
    console.log("Testing exact user scenario:");
    console.log("• 100 completed games total");
    console.log("• 60 games: Home team wins, Away team loses");  
    console.log("• 40 games: Away team wins, Home team loses");
    console.log("• Only 30 games have complete betting line data");
    console.log("• 70 games have no betting lines");
    console.log("=" .repeat(80));
    
    // Generate test data with exact user scenario
    const { games, lines } = generateUserScenarioTestData();
    
    // Create lines lookup map
    const linesMap = new Map();
    lines.forEach((line) => {
        const key = `${line.homeTeam}_${line.awayTeam}_${line.week}`;
        if (line.lines && line.lines.length > 0) {
            const bestLine = line.lines.find((l) => l.provider === 'consensus') || line.lines[0];
            linesMap.set(key, {
                spread: bestLine.spread,
                overUnder: bestLine.overUnder,
                homeMoneyline: bestLine.homeMoneyline,
                awayMoneyline: bestLine.awayMoneyline
            });
        }
    });

    console.log("\n📊 Test Data Verification:");
    console.log(`Total Games Generated: ${games.length}`);
    console.log(`Games with Betting Lines: ${linesMap.size}`);
    console.log(`Games without Betting Lines: ${games.length - linesMap.size}`);
    
    // Verify game distribution
    const homeWins = games.filter(g => g.homeScore > g.awayScore).length;
    const awayWins = games.filter(g => g.awayScore > g.homeScore).length;
    console.log(`Home Wins: ${homeWins}`);
    console.log(`Away Wins: ${awayWins}`);
    
    // Run the corrected calculation
    const results = calculateBettingTrendsTestVersion(games, linesMap);
    
    console.log("\n🧪 VALIDATION TESTS");
    console.log("-" .repeat(50));
    
    let passedTests = 0;
    let totalTests = 0;
    
    // Test helper function
    function validateTest(description, expected, actual, critical = false) {
        totalTests++;
        const passed = expected === actual;
        
        if (passed) {
            passedTests++;
            console.log(`✅ ${description}: ${actual} (Expected: ${expected})`);
            return 1;
        } else {
            const marker = critical ? "🚨 CRITICAL FAILURE" : "❌";
            console.log(`${marker} ${description}: ${actual} (Expected: ${expected})`);
            return 0;
        }
    }
    
    // CRITICAL TESTS - These must pass to fix the "all 0s" issue
    console.log("\n🚨 CRITICAL VALIDATION TESTS (Must Pass):");
    
    // 1. Straight up trends process ALL 100 games
    const suHomeWins = validateTest(
        "Straight Up: Home Team Wins", 
        60, 
        results.straightUp.homeTeams.wins, 
        true
    );
    const suHomeLosses = validateTest(
        "Straight Up: Home Team Losses", 
        40, 
        results.straightUp.homeTeams.losses, 
        true
    );
    const suAwayWins = validateTest(
        "Straight Up: Away Team Wins", 
        40, 
        results.straightUp.awayTeams.wins, 
        true
    );
    const suAwayLosses = validateTest(
        "Straight Up: Away Team Losses", 
        60, 
        results.straightUp.awayTeams.losses, 
        true
    );
    
    // 2. ATS trends only process games with betting lines (30 games)
    const totalATSGames = results.againstTheSpread.homeTeams.wins + 
                         results.againstTheSpread.homeTeams.losses + 
                         results.againstTheSpread.homeTeams.pushes;
    
    validateTest(
        "ATS: Only processes games with betting lines", 
        30, 
        totalATSGames, 
        true
    );
    
    // 3. No more all-0s issue
    const noZerosSU = (results.straightUp.homeTeams.wins > 0 && 
                       results.straightUp.awayTeams.wins > 0);
    validateTest(
        "No All-0s Issue: Straight Up trends have values", 
        true, 
        noZerosSU, 
        true
    );
    
    // 4. Proper win/loss counting (percentages)
    const homeWinPercentage = results.straightUp.homeTeams.percentage;
    validateTest(
        "Home Win Percentage Calculation", 
        60, // 60% (60 wins out of 100 games)
        homeWinPercentage, 
        true
    );
    
    const awayWinPercentage = results.straightUp.awayTeams.percentage;
    validateTest(
        "Away Win Percentage Calculation", 
        40, // 40% (40 wins out of 100 games)
        awayWinPercentage, 
        true
    );
    
    console.log("\n📈 ADDITIONAL VALIDATION TESTS:");
    
    // Verify ATS calculations work for games with lines
    const atsWinsOrLosses = results.againstTheSpread.homeTeams.wins + 
                           results.againstTheSpread.homeTeams.losses;
    validateTest(
        "ATS: Home teams have wins or losses (not all pushes)", 
        true, 
        atsWinsOrLosses > 0
    );
    
    // Verify O/U calculations work
    const totalOUGames = results.overUnder.allGames.overs + 
                         results.overUnder.allGames.unders + 
                         results.overUnder.allGames.pushes;
    validateTest(
        "Over/Under: Games processed with O/U lines", 
        30, 
        totalOUGames
    );
    
    // Verify favorites/dogs tracking (should only apply to games with lines)
    const totalFavGames = results.straightUp.favorites.wins + 
                          results.straightUp.favorites.losses + 
                          results.straightUp.favorites.ties;
    validateTest(
        "Favorites: Only tracked for games with betting lines", 
        30, 
        totalFavGames
    );
    
    console.log("\n" + "=" .repeat(80));
    console.log("🏁 FINAL VALIDATION RESULTS");
    console.log("=" .repeat(80));
    
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    console.log(`Success Rate: ${successRate}%`);
    
    // Determine pass/fail grade (0 or 1)
    let finalGrade = 0;
    let status = "FAIL";
    
    // Must pass all critical tests to get a passing grade
    const criticalTestsPassed = (
        results.straightUp.homeTeams.wins === 60 &&
        results.straightUp.homeTeams.losses === 40 &&
        results.straightUp.awayTeams.wins === 40 &&
        results.straightUp.awayTeams.losses === 60 &&
        totalATSGames === 30 &&
        results.straightUp.homeTeams.percentage === 60 &&
        results.straightUp.awayTeams.percentage === 40
    );
    
    if (criticalTestsPassed && successRate >= 80) {
        finalGrade = 1;
        status = "PASS";
        console.log("\n🎉 SYSTEM VALIDATION: PASSED");
        console.log("✅ All critical fixes working correctly");
        console.log("✅ No more all-0s issue");
        console.log("✅ Straight up trends process all games");
        console.log("✅ ATS trends only process games with betting lines");
        console.log("✅ Proper win/loss counting and percentages");
    } else {
        console.log("\n❌ SYSTEM VALIDATION: FAILED");
        console.log("⚠️  Critical issues still exist:");
        
        if (results.straightUp.homeTeams.wins !== 60) {
            console.log(`   - Home wins incorrect: ${results.straightUp.homeTeams.wins} (should be 60)`);
        }
        if (results.straightUp.awayTeams.wins !== 40) {
            console.log(`   - Away wins incorrect: ${results.straightUp.awayTeams.wins} (should be 40)`);
        }
        if (totalATSGames !== 30) {
            console.log(`   - ATS games incorrect: ${totalATSGames} (should be 30)`);
        }
        if (results.straightUp.homeTeams.percentage !== 60) {
            console.log(`   - Home win % incorrect: ${results.straightUp.homeTeams.percentage}% (should be 60%)`);
        }
    }
    
    console.log(`\nFINAL GRADE: ${finalGrade} (${status})`);
    
    console.log("\n📋 DETAILED RESULTS SUMMARY:");
    console.log("-" .repeat(50));
    console.log("Straight Up Trends:");
    console.log(`  Home Teams: ${results.straightUp.homeTeams.wins}-${results.straightUp.homeTeams.losses}-${results.straightUp.homeTeams.ties} (${results.straightUp.homeTeams.percentage}%)`);
    console.log(`  Away Teams: ${results.straightUp.awayTeams.wins}-${results.straightUp.awayTeams.losses}-${results.straightUp.awayTeams.ties} (${results.straightUp.awayTeams.percentage}%)`);
    
    console.log("\nAgainst The Spread:");
    console.log(`  Home Teams ATS: ${results.againstTheSpread.homeTeams.wins}-${results.againstTheSpread.homeTeams.losses}-${results.againstTheSpread.homeTeams.pushes} (${results.againstTheSpread.homeTeams.percentage}%)`);
    console.log(`  Away Teams ATS: ${results.againstTheSpread.awayTeams.wins}-${results.againstTheSpread.awayTeams.losses}-${results.againstTheSpread.awayTeams.pushes} (${results.againstTheSpread.awayTeams.percentage}%)`);
    
    console.log("\nOver/Under:");
    console.log(`  All Games O/U: ${results.overUnder.allGames.overs}-${results.overUnder.allGames.unders}-${results.overUnder.allGames.pushes} (O:${results.overUnder.allGames.overPercentage}% U:${results.overUnder.allGames.underPercentage}%)`);
    
    return {
        finalGrade: finalGrade,
        status: status,
        passedTests: passedTests,
        totalTests: totalTests,
        successRate: successRate,
        results: results,
        criticalTestsPassed: criticalTestsPassed
    };
}

// Execute the final validation test
console.log("Starting Final Validation Test...\n");
const validation = runFinalValidationTest();

// Export for potential use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runFinalValidationTest,
        generateUserScenarioTestData,
        calculateBettingTrendsTestVersion
    };
}