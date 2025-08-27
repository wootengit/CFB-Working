/**
 * FIXED BETTING TRENDS CALCULATION SYSTEM
 * 
 * This file contains the corrected calculateBettingTrends function that fixes
 * the issues identified by the comprehensive test suite.
 * 
 * Key Issues Fixed:
 * 1. Incorrect test data expectations vs actual game outcomes
 * 2. Proper favorite/dog identification and tracking
 * 3. Corrected ATS calculations with proper spread logic
 * 4. Fixed tie handling in straight up calculations
 * 5. Proper push detection and edge case handling
 */

/**
 * CORRECTED TEST DATA ANALYSIS
 * Let's properly analyze the test scenarios:
 */

// Test Game 1: Georgia 28, Alabama 21, Spread -3 (Georgia home favored)
// - Georgia wins by 7, covers -3 spread → Home favorite wins SU and ATS
// - Total: 49 vs O/U 45 → Over

// Test Game 2: Vanderbilt 14, Tennessee 24, Spread +7 (Tennessee away favored)  
// - Tennessee wins by 10, covers +7 spread → Away favorite wins SU and ATS
// - Total: 38 vs O/U 42 → Under

// Test Game 3: Auburn 21, LSU 21, Spread 0 (pick'em)
// - Tie game with 0 spread → Tie SU, Push ATS
// - Total: 42 vs O/U 38 → Over

// Test Game 4: Florida 35, Kentucky 28, Spread -7 (Florida home favored)
// - Florida wins by exactly 7 with -7 spread → Home favorite wins SU, Push ATS
// - Total: 63 vs O/U 58 → Over (Overtime)

// Test Game 5: Missouri 31, Arkansas 17 (no betting line)
// - Missouri wins SU, but no ATS or O/U data
// - Only contributes to straight up stats

const CORRECTED_TEST_GAMES = [
  {
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
    id: 4,
    homeTeam: "Florida",
    awayTeam: "Kentucky", 
    homeScore: 35,
    awayScore: 28,
    week: 4,
    completed: true,
    periods: 5, // Overtime
    homeConference: "SEC",
    awayConference: "SEC"
  },
  {
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

const CORRECTED_TEST_LINES = [
  {
    homeTeam: "Georgia",
    awayTeam: "Alabama",
    week: 1,
    lines: [{
      provider: "consensus",
      spread: -3,        // Georgia favored by 3
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
      spread: 7,         // Tennessee favored by 7 (positive = away favored)
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
      spread: 0,         // Pick'em
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
      spread: -7,        // Florida favored by 7
      overUnder: 58,
      homeMoneyline: -280,
      awayMoneyline: 240
    }]
  }
  // Game 5 intentionally has no line
];

/**
 * COMPLETELY REWRITTEN BETTING TRENDS CALCULATION
 * This version fixes all the logical errors identified in testing
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
    
    // ALWAYS process straight up trends for ALL games
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

    // Process betting lines if available
    if (line && line.spread !== undefined && line.spread !== null) {
      const spread = parseFloat(line.spread);
      const overUnder = line.overUnder ? parseFloat(line.overUnder) : null;
      
      // Skip invalid data
      if (isNaN(spread) || homeScore === null || awayScore === null) {
        return;
      }
      
      // Determine favorite/dog status
      // Negative spread = home team favored
      // Positive spread = away team favored  
      // Zero spread = pick'em (no favorite/dog)
      const homeFavorite = spread < 0;
      const awayFavorite = spread > 0;
      const pickEm = spread === 0;
      
      // Calculate ATS results with corrected logic
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
        // For home favored (-spread): home needs to win by MORE than |spread|
        // For away favored (+spread): away needs to win by MORE than spread
        
        if (homeFavorite) {
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

      // Track straight up favorite/dog results (only for non-pick'em games)
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
      // Pick'em games don't contribute to favorite/dog stats

      // Track ATS results
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
          trends.againstTheSpread.favorites.wins++;
          trends.againstTheSpread.homeFavorites.wins++;
          trends.againstTheSpread.dogs.losses++;
          trends.againstTheSpread.awayDogs.losses++;
        } else if (awayFavorite) {
          trends.againstTheSpread.dogs.wins++;
          trends.againstTheSpread.homeDogs.wins++;
          trends.againstTheSpread.favorites.losses++;
          trends.againstTheSpread.awayFavorites.losses++;
        }
      } else if (awayATS) {
        trends.againstTheSpread.awayTeams.wins++;
        trends.againstTheSpread.homeTeams.losses++;
        
        if (awayFavorite) {
          trends.againstTheSpread.favorites.wins++;
          trends.againstTheSpread.awayFavorites.wins++;
          trends.againstTheSpread.dogs.losses++;
          trends.againstTheSpread.homeDogs.losses++;
        } else if (homeFavorite) {
          trends.againstTheSpread.dogs.wins++;
          trends.againstTheSpread.awayDogs.wins++;
          trends.againstTheSpread.favorites.losses++;
          trends.againstTheSpread.homeFavorites.losses++;
        }
      }

      // Over/Under calculations
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
      
      if (!pickEm) {
        if ((homeFavorite && homeWin) || (awayFavorite && awayWin)) {
          trends.spreadRanges[spreadCategory].favWins++;
        } else if ((homeFavorite && awayWin) || (awayFavorite && homeWin)) {
          trends.spreadRanges[spreadCategory].dogWins++;
        }
        // Ties don't count for spread range analysis
      }

      // Situational analysis
      if (margin >= 21) {
        trends.situational.blowouts.games++;
        if (overUnder) {
          if (totalScore > overUnder) {
            trends.situational.blowouts.overs++;
          } else {
            trends.situational.blowouts.unders++;
          }
        }
      }
    }
  });

  // Calculate all percentages
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

  // Situational percentages
  if (trends.situational.blowouts.games > 0) {
    const blowoutTotal = trends.situational.blowouts.overs + trends.situational.blowouts.unders;
    trends.situational.blowouts.overPercentage = blowoutTotal > 0 ? 
      Math.round((trends.situational.blowouts.overs / blowoutTotal) * 100) : 0;
  }

  return trends;
}

/**
 * CORRECTED TEST RUNNER WITH PROPER EXPECTATIONS
 */
function runCorrectedBettingTrendsTests() {
  console.log("🧪 CORRECTED BETTING TRENDS TEST SUITE");
  console.log("=" .repeat(80));
  
  // Create lines lookup map
  const linesMap = new Map();
  CORRECTED_TEST_LINES.forEach((line) => {
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
  console.log(`Total Games: ${CORRECTED_TEST_GAMES.length}`);
  console.log(`Games with Betting Lines: ${linesMap.size}`);
  
  // Analyze expected results
  console.log("\n📋 Expected Results Analysis:");
  console.log("Game 1: Georgia 28, Alabama 21, Spread -3 → Home favorite wins SU+ATS, Over 45");
  console.log("Game 2: Vanderbilt 14, Tennessee 24, Spread +7 → Away favorite wins SU+ATS, Under 42");  
  console.log("Game 3: Auburn 21, LSU 21, Spread 0 → Tie SU, Push ATS, Over 38");
  console.log("Game 4: Florida 35, Kentucky 28, Spread -7 → Home favorite wins SU, Push ATS, Over 58 (OT)");
  console.log("Game 5: Missouri 31, Arkansas 17 → Home wins SU only (no betting line)");
  
  const results = calculateBettingTrendsFixed(CORRECTED_TEST_GAMES, linesMap);
  
  let totalTests = 0;
  let passedTests = 0;
  
  function test(description, expected, actual) {
    totalTests++;
    const passed = expected === actual;
    
    if (passed) {
      passedTests++;
      console.log(`✅ ${description}: ${actual}`);
      return 1;
    } else {
      console.log(`❌ ${description}: ${actual} (Expected: ${expected})`);
      return 0;
    }
  }

  console.log("\n🏆 CORRECTED STRAIGHT UP TRENDS TESTS");
  console.log("-" .repeat(50));
  
  let suScore = 0;
  // Expected: 3 home wins (Games 1,4,5), 1 away win (Game 2), 1 tie (Game 3)
  suScore += test("Home Team Wins", 3, results.straightUp.homeTeams.wins);
  suScore += test("Home Team Losses", 1, results.straightUp.homeTeams.losses);
  suScore += test("Home Team Ties", 1, results.straightUp.homeTeams.ties);
  suScore += test("Away Team Wins", 1, results.straightUp.awayTeams.wins);
  suScore += test("Away Team Losses", 3, results.straightUp.awayTeams.losses);
  suScore += test("Away Team Ties", 1, results.straightUp.awayTeams.ties);
  
  // Favorites: Games 1,4 (home fav), Game 2 (away fav) → 3 fav wins, 0 losses
  // Dogs: Games 1,4 (away dog), Game 2 (home dog) → 0 dog wins, 3 losses
  suScore += test("Favorites Wins", 3, results.straightUp.favorites.wins);
  suScore += test("Favorites Losses", 0, results.straightUp.favorites.losses);
  suScore += test("Dogs Wins", 0, results.straightUp.dogs.wins);
  suScore += test("Dogs Losses", 3, results.straightUp.dogs.losses);
  
  suScore += test("Home Favorites Wins", 2, results.straightUp.homeFavorites.wins); // Games 1,4
  suScore += test("Away Favorites Wins", 1, results.straightUp.awayFavorites.wins); // Game 2
  suScore += test("Home Dogs Wins", 0, results.straightUp.homeDogs.wins); // Game 2 loss
  suScore += test("Away Dogs Wins", 0, results.straightUp.awayDogs.wins); // Games 1,4 losses

  console.log(`\n🎯 Straight Up Score: ${suScore}/12 (${Math.round(suScore/12*100)}%)`);

  console.log("\n📈 CORRECTED AGAINST THE SPREAD TESTS");
  console.log("-" .repeat(50));
  
  let atsScore = 0;
  
  // Expected ATS: Game 1 home wins, Game 2 away wins, Games 3&4 push
  atsScore += test("Home Teams ATS Wins", 1, results.againstTheSpread.homeTeams.wins);
  atsScore += test("Home Teams ATS Losses", 1, results.againstTheSpread.homeTeams.losses);
  atsScore += test("Home Teams ATS Pushes", 2, results.againstTheSpread.homeTeams.pushes);
  
  atsScore += test("Away Teams ATS Wins", 1, results.againstTheSpread.awayTeams.wins);
  atsScore += test("Away Teams ATS Losses", 1, results.againstTheSpread.awayTeams.losses);
  atsScore += test("Away Teams ATS Pushes", 2, results.againstTheSpread.awayTeams.pushes);
  
  atsScore += test("Favorites ATS Wins", 1, results.againstTheSpread.favorites.wins); // Game 2
  atsScore += test("Favorites ATS Losses", 0, results.againstTheSpread.favorites.losses);
  atsScore += test("Dogs ATS Wins", 1, results.againstTheSpread.dogs.wins); // Game 1  
  atsScore += test("Dogs ATS Losses", 0, results.againstTheSpread.dogs.losses);

  console.log(`\n🎯 ATS Score: ${atsScore}/10 (${Math.round(atsScore/10*100)}%)`);

  console.log("\n🎰 OVER/UNDER TESTS");
  console.log("-" .repeat(50));
  
  let ouScore = 0;
  
  // Expected: Games 1,3,4 over, Game 2 under
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
  
  edgeScore += test("Regulation Ties Handled", 1, results.straightUp.homeTeams.ties);
  
  const totalSUGames = results.straightUp.homeTeams.wins + results.straightUp.homeTeams.losses + results.straightUp.homeTeams.ties;
  edgeScore += test("All Games Processed", 5, totalSUGames);
  
  const totalATSGames = results.againstTheSpread.homeTeams.wins + results.againstTheSpread.homeTeams.losses + results.againstTheSpread.homeTeams.pushes;
  edgeScore += test("Games with Lines Processed", 4, totalATSGames);
  
  edgeScore += test("Push Detection", 2, results.againstTheSpread.homeTeams.pushes);

  console.log(`\n🎯 Edge Case Score: ${edgeScore}/4 (${Math.round(edgeScore/4*100)}%)`);

  console.log("\n📊 PERCENTAGE CALCULATION TESTS");
  console.log("-" .repeat(50));
  
  let percScore = 0;
  
  const homeWinPct = results.straightUp.homeTeams.percentage;
  const expectedHomeWinPct = Math.round((3/5) * 100); // 3 wins out of 5 games = 60%
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
  console.log("🏁 FINAL CORRECTED TEST RESULTS");
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
  } else {
    console.log("❌ NEEDS WORK - Issues still present");
  }

  return {
    totalTests: maxScore,
    passedTests: totalScore,
    percentage: finalPercentage,
    results: results
  };
}

// Export the corrected function for use in the main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    calculateBettingTrendsFixed,
    runCorrectedBettingTrendsTests,
    CORRECTED_TEST_GAMES,
    CORRECTED_TEST_LINES
  };
}

// Run tests when executed directly
if (require.main === module) {
  runCorrectedBettingTrendsTests();
}