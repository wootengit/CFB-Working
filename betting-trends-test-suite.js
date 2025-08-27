/**
 * COMPREHENSIVE BETTING TRENDS CALCULATION TEST SUITE
 * 
 * This test suite validates the betting trends calculation system with specific
 * test scenarios to identify and fix issues causing all 0s in wins/losses display.
 * 
 * Test Coverage:
 * - Straight Up Trends (Home/Away, Favorite/Dog combinations)
 * - Against The Spread (ATS) calculations with spread application
 * - Over/Under calculations with overtime detection
 * - Edge cases (ties, pushes, missing data, zero spreads)
 */

// Test Data - Specific scenarios as requested
const TEST_GAMES = [
  {
    // Test Game 1: Home 28, Away 21, Spread -3 (home favored), O/U 45
    id: 1,
    homeTeam: "Georgia",
    awayTeam: "Alabama", 
    homeScore: 28,
    awayScore: 21,
    week: 1,
    completed: true,
    periods: 4,
    homeConference: "SEC",
    awayConference: "SEC"
  },
  {
    // Test Game 2: Home 14, Away 24, Spread +7 (away favored), O/U 42
    id: 2,
    homeTeam: "Vanderbilt",
    awayTeam: "Tennessee",
    homeScore: 14,
    awayScore: 24,
    week: 2,
    completed: true,
    periods: 4,
    homeConference: "SEC",
    awayConference: "SEC"
  },
  {
    // Test Game 3: Home 21, Away 21, Spread 0 (pick'em), O/U 38
    id: 3,
    homeTeam: "Auburn",
    awayTeam: "LSU",
    homeScore: 21,
    awayScore: 21,
    week: 3,
    completed: true,
    periods: 4,
    homeConference: "SEC",
    awayConference: "SEC"
  },
  {
    // Test Game 4: Home 35, Away 28, Spread -7 (exact push), O/U 58
    id: 4,
    homeTeam: "Florida",
    awayTeam: "Kentucky",
    homeScore: 35,
    awayScore: 28,
    week: 4,
    completed: true,
    periods: 5, // Overtime game
    homeConference: "SEC",
    awayConference: "SEC"
  },
  {
    // Additional Test Game 5: Missing betting line data
    id: 5,
    homeTeam: "Missouri",
    awayTeam: "Arkansas",
    homeScore: 31,
    awayScore: 17,
    week: 5,
    completed: true,
    periods: 4,
    homeConference: "SEC",
    awayConference: "SEC"
  }
];

const TEST_LINES = [
  {
    homeTeam: "Georgia",
    awayTeam: "Alabama",
    week: 1,
    lines: [{
      provider: "consensus",
      spread: -3,        // Home favored by 3
      overUnder: 45,
      homeMoneyline: -150,
      awayMoneyline: 130
    }]
  },
  {
    homeTeam: "Vanderbilt", 
    awayTeam: "Tennessee",
    week: 2,
    lines: [{
      provider: "consensus",
      spread: 7,         // Away favored by 7 (positive spread = away favored)
      overUnder: 42,
      homeMoneyline: 280,
      awayMoneyline: -350
    }]
  },
  {
    homeTeam: "Auburn",
    awayTeam: "LSU", 
    week: 3,
    lines: [{
      provider: "consensus",
      spread: 0,         // Pick'em game
      overUnder: 38,
      homeMoneyline: -105,
      awayMoneyline: -115
    }]
  },
  {
    homeTeam: "Florida",
    awayTeam: "Kentucky",
    week: 4,
    lines: [{
      provider: "consensus",
      spread: -7,        // Home favored by 7 (exact push scenario)
      overUnder: 58,
      homeMoneyline: -280,
      awayMoneyline: 240
    }]
  }
  // Note: Game 5 has no betting line (missing data test)
];

/**
 * CORRECTED BETTING TRENDS CALCULATION FUNCTION
 * This fixes the issues in the original calculateBettingTrends function
 */
function calculateBettingTrendsFixed(games, linesMap) {
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
    },
    spreadRanges: {
      small: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 },
      medium: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 },
      large: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 },
      huge: { games: 0, favWins: 0, dogWins: 0, favPercentage: 0, dogPercentage: 0 }
    },
    situational: {
      ranked: { games: 0, favWins: 0, atsWins: 0, percentage: 0 },
      primetime: { games: 0, homeWins: 0, awayWins: 0, homePercentage: 0 },
      rivalry: { games: 0, homeWins: 0, awayWins: 0, homePercentage: 0 },
      blowouts: { games: 0, overs: 0, unders: 0, overPercentage: 0 }
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
    const margin = Math.abs(homeScore - awayScore);
    
    // CORRECTED: Process ALL games for straight up trends (not just games with lines)
    if (homeWin) {
      trends.straightUp.homeTeams.wins++;
      trends.straightUp.awayTeams.losses++;
    } else if (awayWin) {
      trends.straightUp.awayTeams.wins++;
      trends.straightUp.homeTeams.losses++;
    } else {
      trends.straightUp.homeTeams.ties++;
      trends.straightUp.awayTeams.ties++;
    }

    // Process betting lines if available
    if (line && line.spread !== undefined && line.spread !== null) {
      const spread = parseFloat(line.spread);
      const overUnder = line.overUnder ? parseFloat(line.overUnder) : null;
      
      // Validate data integrity
      if (isNaN(spread) || homeScore === null || awayScore === null) {
        return; // Skip invalid data
      }
      
      // CORRECTED: Proper spread interpretation
      // Negative spread = home team favored by that amount
      // Positive spread = away team favored by that amount
      const homeFavorite = spread < 0;
      const awayFavorite = spread > 0;
      const pickEm = spread === 0;
      
      // CORRECTED: ATS calculations with proper spread application
      // If home team is favored by 3 (-3 spread), they need to win by MORE than 3 to cover
      // If away team is favored by 7 (+7 spread), they need to win by MORE than 7 to cover
      let homeATS = false;
      let awayATS = false;
      let push = false;
      
      if (homeFavorite) {
        // Home team favored - they need to win by MORE than the spread
        const coverMargin = homeScore - awayScore + spread; // spread is negative
        if (Math.abs(coverMargin) < 0.01) {
          push = true;
        } else if (coverMargin > 0) {
          homeATS = true;
        } else {
          awayATS = true;
        }
      } else if (awayFavorite) {
        // Away team favored - they need to win by MORE than the spread  
        const coverMargin = awayScore - homeScore - spread; // spread is positive
        if (Math.abs(coverMargin) < 0.01) {
          push = true;
        } else if (coverMargin > 0) {
          awayATS = true;
        } else {
          homeATS = true;
        }
      } else {
        // Pick'em game - straight up winner covers
        if (tie) {
          push = true;
        } else if (homeWin) {
          homeATS = true;
        } else {
          awayATS = true;
        }
      }

      // CORRECTED: Complete straight up favorites/dogs tracking
      if (homeFavorite) {
        // Home team is favored
        if (homeWin) {
          trends.straightUp.favorites.wins++;
          trends.straightUp.dogs.losses++;
          trends.straightUp.homeFavorites.wins++;
          trends.straightUp.awayDogs.losses++;
        } else if (awayWin) {
          trends.straightUp.favorites.losses++;
          trends.straightUp.dogs.wins++;
          trends.straightUp.homeFavorites.losses++;
          trends.straightUp.awayDogs.wins++;
        } else if (tie) {
          trends.straightUp.favorites.ties++;
          trends.straightUp.dogs.ties++;
          trends.straightUp.homeFavorites.ties++;
          trends.straightUp.awayDogs.ties++;
        }
      } else if (awayFavorite) {
        // Away team is favored
        if (awayWin) {
          trends.straightUp.favorites.wins++;
          trends.straightUp.dogs.losses++;
          trends.straightUp.awayFavorites.wins++;
          trends.straightUp.homeDogs.losses++;
        } else if (homeWin) {
          trends.straightUp.favorites.losses++;
          trends.straightUp.dogs.wins++;
          trends.straightUp.awayFavorites.losses++;
          trends.straightUp.homeDogs.wins++;
        } else if (tie) {
          trends.straightUp.favorites.ties++;
          trends.straightUp.dogs.ties++;
          trends.straightUp.awayFavorites.ties++;
          trends.straightUp.homeDogs.ties++;
        }
      }
      // Pick'em games don't contribute to favorite/dog stats

      // CORRECTED: Complete ATS trends tracking
      if (push) {
        trends.againstTheSpread.homeTeams.pushes++;
        trends.againstTheSpread.awayTeams.pushes++;
        if (homeFavorite) {
          trends.againstTheSpread.favorites.pushes++;
          trends.againstTheSpread.dogs.pushes++;
          trends.againstTheSpread.homeFavorites.pushes++;
          trends.againstTheSpread.awayDogs.pushes++;
        } else if (awayFavorite) {
          trends.againstTheSpread.favorites.pushes++;
          trends.againstTheSpread.dogs.pushes++;
          trends.againstTheSpread.awayFavorites.pushes++;
          trends.againstTheSpread.homeDogs.pushes++;
        }
      } else if (homeATS) {
        trends.againstTheSpread.homeTeams.wins++;
        trends.againstTheSpread.awayTeams.losses++;
        if (homeFavorite) {
          trends.againstTheSpread.favorites.wins++;
          trends.againstTheSpread.dogs.losses++;
          trends.againstTheSpread.homeFavorites.wins++;
          trends.againstTheSpread.awayDogs.losses++;
        } else if (awayFavorite) {
          trends.againstTheSpread.favorites.losses++;
          trends.againstTheSpread.dogs.wins++;
          trends.againstTheSpread.awayFavorites.losses++;
          trends.againstTheSpread.homeDogs.wins++;
        }
      } else if (awayATS) {
        trends.againstTheSpread.awayTeams.wins++;
        trends.againstTheSpread.homeTeams.losses++;
        if (homeFavorite) {
          trends.againstTheSpread.favorites.losses++;
          trends.againstTheSpread.dogs.wins++;
          trends.againstTheSpread.homeFavorites.losses++;
          trends.againstTheSpread.awayDogs.wins++;
        } else if (awayFavorite) {
          trends.againstTheSpread.favorites.wins++;
          trends.againstTheSpread.dogs.losses++;
          trends.againstTheSpread.awayFavorites.wins++;
          trends.againstTheSpread.homeDogs.losses++;
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

      // Spread range analysis
      const absSpread = Math.abs(spread);
      let spreadCategory;
      
      if (absSpread <= 3) spreadCategory = 'small';
      else if (absSpread <= 7) spreadCategory = 'medium';
      else if (absSpread <= 14) spreadCategory = 'large';
      else spreadCategory = 'huge';

      trends.spreadRanges[spreadCategory].games++;
      if ((homeFavorite && homeWin) || (awayFavorite && awayWin)) {
        trends.spreadRanges[spreadCategory].favWins++;
      } else if (!pickEm) {
        trends.spreadRanges[spreadCategory].dogWins++;
      }

      // Situational analysis
      if (margin >= 21) {
        trends.situational.blowouts.games++;
        if (overUnder && totalScore > overUnder) {
          trends.situational.blowouts.overs++;
        } else if (overUnder) {
          trends.situational.blowouts.unders++;
        }
      }
    }
  });

  // Calculate percentages
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

  // Spread ranges percentages
  Object.keys(trends.spreadRanges).forEach(key => {
    const category = trends.spreadRanges[key];
    if (category.games > 0) {
      category.favPercentage = Math.round((category.favWins / category.games) * 100);
      category.dogPercentage = Math.round((category.dogWins / category.games) * 100);
    }
  });

  return trends;
}

/**
 * TEST RUNNER AND VALIDATION
 */
function runBettingTrendsTests() {
  console.log("🧪 COMPREHENSIVE BETTING TRENDS TEST SUITE");
  console.log("=" .repeat(80));
  
  // Create lines lookup map
  const linesMap = new Map();
  TEST_LINES.forEach((line) => {
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

  console.log("📊 Test Data Summary:");
  console.log(`Total Games: ${TEST_GAMES.length}`);
  console.log(`Games with Betting Lines: ${linesMap.size}`);
  
  // Run the corrected calculation
  const results = calculateBettingTrendsFixed(TEST_GAMES, linesMap);
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Test helper function
  function test(description, expected, actual, testType = "exact") {
    totalTests++;
    let passed = false;
    
    if (testType === "exact") {
      passed = expected === actual;
    } else if (testType === "range") {
      passed = actual >= expected.min && actual <= expected.max;
    }
    
    if (passed) {
      passedTests++;
      console.log(`✅ ${description}: ${actual} (Expected: ${expected})`);
      return 1;
    } else {
      console.log(`❌ ${description}: ${actual} (Expected: ${expected})`);
      return 0;
    }
  }

  console.log("\n🏆 STRAIGHT UP TRENDS TESTS");
  console.log("-" .repeat(50));
  
  // Straight Up Home/Away Tests
  let suScore = 0;
  suScore += test("Home Team Wins", 2, results.straightUp.homeTeams.wins);
  suScore += test("Home Team Losses", 2, results.straightUp.homeTeams.losses);
  suScore += test("Home Team Ties", 1, results.straightUp.homeTeams.ties);
  suScore += test("Away Team Wins", 2, results.straightUp.awayTeams.wins);
  suScore += test("Away Team Losses", 2, results.straightUp.awayTeams.losses);
  suScore += test("Away Team Ties", 1, results.straightUp.awayTeams.ties);
  
  // Straight Up Favorite/Dog Tests (only for games with spreads)
  suScore += test("Favorites Wins", 2, results.straightUp.favorites.wins);
  suScore += test("Favorites Losses", 1, results.straightUp.favorites.losses);
  suScore += test("Dogs Wins", 1, results.straightUp.dogs.wins);
  suScore += test("Dogs Losses", 2, results.straightUp.dogs.losses);
  
  // Combined category tests
  suScore += test("Home Favorites Wins", 1, results.straightUp.homeFavorites.wins);
  suScore += test("Away Favorites Wins", 1, results.straightUp.awayFavorites.wins);
  suScore += test("Home Dogs Wins", 1, results.straightUp.homeDogs.wins);
  suScore += test("Away Dogs Wins", 0, results.straightUp.awayDogs.wins);

  console.log(`\n🎯 Straight Up Score: ${suScore}/12 (${Math.round(suScore/12*100)}%)`);

  console.log("\n📈 AGAINST THE SPREAD (ATS) TESTS");
  console.log("-" .repeat(50));
  
  let atsScore = 0;
  
  // Expected ATS results based on test scenarios:
  // Game 1: Home 28, Away 21, Spread -3 → Home wins by 7, covers -3 → Home ATS Win
  // Game 2: Home 14, Away 24, Spread +7 → Away wins by 10, covers +7 → Away ATS Win  
  // Game 3: Home 21, Away 21, Spread 0 → Tie with 0 spread → Push
  // Game 4: Home 35, Away 28, Spread -7 → Home wins by 7, exact spread → Push
  
  atsScore += test("Home Teams ATS Wins", 1, results.againstTheSpread.homeTeams.wins);
  atsScore += test("Home Teams ATS Losses", 1, results.againstTheSpread.homeTeams.losses);
  atsScore += test("Home Teams ATS Pushes", 2, results.againstTheSpread.homeTeams.pushes);
  
  atsScore += test("Away Teams ATS Wins", 1, results.againstTheSpread.awayTeams.wins);
  atsScore += test("Away Teams ATS Losses", 1, results.againstTheSpread.awayTeams.losses);
  atsScore += test("Away Teams ATS Pushes", 2, results.againstTheSpread.awayTeams.pushes);
  
  atsScore += test("Favorites ATS Wins", 1, results.againstTheSpread.favorites.wins);
  atsScore += test("Favorites ATS Losses", 1, results.againstTheSpread.favorites.losses);
  atsScore += test("Dogs ATS Wins", 1, results.againstTheSpread.dogs.wins);
  atsScore += test("Dogs ATS Losses", 1, results.againstTheSpread.dogs.losses);

  console.log(`\n🎯 ATS Score: ${atsScore}/10 (${Math.round(atsScore/10*100)}%)`);

  console.log("\n🎰 OVER/UNDER TESTS");
  console.log("-" .repeat(50));
  
  let ouScore = 0;
  
  // Expected O/U results:
  // Game 1: 28+21=49 vs 45 → Over
  // Game 2: 14+24=38 vs 42 → Under
  // Game 3: 21+21=42 vs 38 → Over  
  // Game 4: 35+28=63 vs 58 → Over (Overtime game)
  
  ouScore += test("All Games Overs", 3, results.overUnder.allGames.overs);
  ouScore += test("All Games Unders", 1, results.overUnder.allGames.unders);
  ouScore += test("All Games Pushes", 0, results.overUnder.allGames.pushes);
  
  ouScore += test("Overtime Games Overs", 1, results.overUnder.overtimeGames.overs);
  ouScore += test("Overtime Games Unders", 0, results.overUnder.overtimeGames.unders);
  
  ouScore += test("Non-Overtime Games Overs", 2, results.overUnder.nonOvertimeGames.overs);
  ouScore += test("Non-Overtime Games Unders", 1, results.overUnder.nonOvertimeGames.unders);

  console.log(`\n🎯 Over/Under Score: ${ouScore}/7 (${Math.round(ouScore/7*100)}%)`);

  console.log("\n⚡ EDGE CASE TESTS");
  console.log("-" .repeat(50));
  
  let edgeScore = 0;
  
  // Test tie handling
  edgeScore += test("Regulation Ties Handled", 1, results.straightUp.homeTeams.ties);
  
  // Test missing data handling (Game 5 has no betting line)
  const totalSUGames = results.straightUp.homeTeams.wins + results.straightUp.homeTeams.losses + results.straightUp.homeTeams.ties;
  edgeScore += test("All Games Processed (Including Missing Lines)", 5, totalSUGames);
  
  // Test pick'em game handling (Game 3)
  const totalATSGames = results.againstTheSpread.homeTeams.wins + results.againstTheSpread.homeTeams.losses + results.againstTheSpread.homeTeams.pushes;
  edgeScore += test("Games with Betting Lines Processed", 4, totalATSGames);
  
  // Test exact push detection (Game 4: Home wins by exactly 7 with -7 spread)
  const totalPushes = results.againstTheSpread.homeTeams.pushes;
  edgeScore += test("Push Detection", 2, totalPushes);

  console.log(`\n🎯 Edge Case Score: ${edgeScore}/4 (${Math.round(edgeScore/4*100)}%)`);

  console.log("\n📊 PERCENTAGE CALCULATION TESTS");
  console.log("-" .repeat(50));
  
  let percScore = 0;
  
  // Test percentage calculations
  const homeWinPct = results.straightUp.homeTeams.percentage;
  const expectedHomeWinPct = Math.round((2/5) * 100); // 2 wins out of 5 games = 40%
  percScore += test("Home Win Percentage", expectedHomeWinPct, homeWinPct);
  
  const atsHomePct = results.againstTheSpread.homeTeams.percentage;
  const expectedATSHomePct = Math.round((1/4) * 100); // 1 win out of 4 ATS games = 25%
  percScore += test("Home ATS Percentage", expectedATSHomePct, atsHomePct);
  
  const overPct = results.overUnder.allGames.overPercentage;
  const expectedOverPct = Math.round((3/4) * 100); // 3 overs out of 4 O/U games = 75%
  percScore += test("Over Percentage", expectedOverPct, overPct);

  console.log(`\n🎯 Percentage Score: ${percScore}/3 (${Math.round(percScore/3*100)}%)`);

  // FINAL RESULTS
  console.log("\n" + "=" .repeat(80));
  console.log("🏁 FINAL TEST RESULTS");
  console.log("=" .repeat(80));
  
  const totalScore = suScore + atsScore + ouScore + edgeScore + percScore;
  const maxScore = 36;
  const finalPercentage = Math.round((totalScore / maxScore) * 100);
  
  console.log(`Total Tests Passed: ${totalScore}/${maxScore}`);
  console.log(`Overall Accuracy: ${finalPercentage}%`);
  
  if (finalPercentage >= 90) {
    console.log("🎉 EXCELLENT - System working correctly!");
  } else if (finalPercentage >= 75) {
    console.log("✅ GOOD - Minor issues detected");  
  } else if (finalPercentage >= 50) {
    console.log("⚠️  FAIR - Significant issues need fixing");
  } else {
    console.log("❌ POOR - Major issues detected, system needs repair");
  }

  console.log("\n📋 DETAILED RESULTS OUTPUT:");
  console.log("=" .repeat(50));
  console.log(JSON.stringify(results, null, 2));

  return {
    totalTests: maxScore,
    passedTests: totalScore,
    percentage: finalPercentage,
    results: results
  };
}

/**
 * VALIDATION HELPER FUNCTIONS
 */
function validateSpreadCalculation(homeScore, awayScore, spread) {
  // Test helper to validate spread calculation logic
  console.log(`\nSpread Validation:`);
  console.log(`Home: ${homeScore}, Away: ${awayScore}, Spread: ${spread}`);
  
  if (spread < 0) {
    // Home favored
    const coverMargin = homeScore - awayScore + spread;
    console.log(`Home favored by ${Math.abs(spread)}, needs to win by more than ${Math.abs(spread)}`);
    console.log(`Actual margin: ${homeScore - awayScore}, Cover margin: ${coverMargin}`);
    
    if (Math.abs(coverMargin) < 0.01) {
      console.log(`Result: PUSH`);
      return 'push';
    } else if (coverMargin > 0) {
      console.log(`Result: HOME COVERS`);
      return 'home';
    } else {
      console.log(`Result: AWAY COVERS`);
      return 'away';
    }
  } else if (spread > 0) {
    // Away favored
    const coverMargin = awayScore - homeScore - spread;
    console.log(`Away favored by ${spread}, needs to win by more than ${spread}`);
    console.log(`Actual margin: ${awayScore - homeScore}, Cover margin: ${coverMargin}`);
    
    if (Math.abs(coverMargin) < 0.01) {
      console.log(`Result: PUSH`);
      return 'push';
    } else if (coverMargin > 0) {
      console.log(`Result: AWAY COVERS`);
      return 'away';
    } else {
      console.log(`Result: HOME COVERS`);
      return 'home';
    }
  } else {
    // Pick'em
    console.log(`Pick'em game - straight up winner covers`);
    if (homeScore > awayScore) {
      console.log(`Result: HOME COVERS`);
      return 'home';
    } else if (awayScore > homeScore) {
      console.log(`Result: AWAY COVERS`);
      return 'away';
    } else {
      console.log(`Result: PUSH`);
      return 'push';
    }
  }
}

// Run manual spread validations for test scenarios
console.log("🔍 MANUAL SPREAD VALIDATIONS");
console.log("=" .repeat(50));

console.log("\nTest Game 1: Home 28, Away 21, Spread -3 (home favored)");
validateSpreadCalculation(28, 21, -3);

console.log("\nTest Game 2: Home 14, Away 24, Spread +7 (away favored)"); 
validateSpreadCalculation(14, 24, 7);

console.log("\nTest Game 3: Home 21, Away 21, Spread 0 (pick'em)");
validateSpreadCalculation(21, 21, 0);

console.log("\nTest Game 4: Home 35, Away 28, Spread -7 (exact push)");
validateSpreadCalculation(35, 28, -7);

// Execute the main test suite
runBettingTrendsTests();