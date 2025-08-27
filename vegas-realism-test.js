const { chromium } = require('playwright');
const fs = require('fs');

// Set temp directory
const tempDir = 'C:\\CFB-WORKING\\temp-playwright';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
process.env.TEMP = tempDir;
process.env.TMP = tempDir;

(async () => {
  console.log('📸 VEGAS REALISM TEST - Screenshot & Grade');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 600, height: 1000 });
  
  try {
    const htmlPath = 'file:///C:/CFB-WORKING/flow-mode-sportsbook.html';
    console.log(`📂 Opening: ${htmlPath}`);
    
    await page.goto(htmlPath, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for games to load...');
    await page.waitForTimeout(8000);
    
    // Analyze Vegas realism
    const vegasAnalysis = await page.evaluate(() => {
        const games = document.querySelectorAll('.game');
        const teamNames = Array.from(document.querySelectorAll('.team-name')).map(t => t.textContent);
        const statusBar = document.querySelector('#status');
        
        // Check for Vegas-style formatting
        const hasSpreadsInTeamNames = teamNames.some(name => name.includes('-'));
        const hasAlternatingColors = document.querySelectorAll('.game-green').length > 0 && document.querySelectorAll('.game-orange').length > 0;
        const hasThreeColumns = document.querySelectorAll('.column-headers .header-cell').length === 3;
        const hasOverUnder = teamNames.some(name => teamNames.includes('O') || teamNames.includes('U'));
        
        // Sample team displays
        const sampleTeams = teamNames.slice(0, 8);
        const spreadsFound = teamNames.filter(name => name.includes('-')).slice(0, 5);
        
        return {
            totalGames: games.length,
            statusText: statusBar ? statusBar.textContent : 'NO STATUS',
            hasSpreadsInTeamNames,
            hasAlternatingColors,
            hasThreeColumns,
            sampleTeams,
            spreadsFound,
            teamCount: teamNames.length
        };
    });
    
    console.log('🎰 VEGAS REALISM ANALYSIS:');
    console.log(`   Total Games: ${vegasAnalysis.totalGames}`);
    console.log(`   Total Teams: ${vegasAnalysis.teamCount}`);
    console.log(`   Status: ${vegasAnalysis.statusText}`);
    console.log(`   Spreads in Team Names: ${vegasAnalysis.hasSpreadsInTeamNames}`);
    console.log(`   Alternating Colors: ${vegasAnalysis.hasAlternatingColors}`);
    console.log(`   Three Columns: ${vegasAnalysis.hasThreeColumns}`);
    console.log('   Sample Teams:', vegasAnalysis.sampleTeams.slice(0, 4).join(', '));
    console.log('   Spreads Found:', vegasAnalysis.spreadsFound.join(', '));
    
    console.log('📸 Taking Vegas realism screenshot...');
    const screenshotPath = 'C:\\CFB-WORKING\\VEGAS-REALISM-TEST.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ SCREENSHOT SAVED: ${screenshotPath}`);
    
    // VEGAS REALISM GRADING
    let realismScore = 0.0;
    let gradeReason = '';
    
    // Perfect Vegas board criteria
    if (vegasAnalysis.totalGames >= 20 && 
        vegasAnalysis.hasSpreadsInTeamNames && 
        vegasAnalysis.hasAlternatingColors &&
        vegasAnalysis.hasThreeColumns &&
        vegasAnalysis.spreadsFound.length >= 3) {
        realismScore = 1.0;
        gradeReason = 'PERFECT: Vegas layout with spreads in team names, alternating colors, 3-column format';
    } else if (vegasAnalysis.totalGames >= 15 && vegasAnalysis.hasSpreadsInTeamNames && vegasAnalysis.hasThreeColumns) {
        realismScore = 0.8;
        gradeReason = 'EXCELLENT: Good Vegas format with spreads in team names';
    } else if (vegasAnalysis.totalGames >= 10 && vegasAnalysis.hasThreeColumns) {
        realismScore = 0.6;
        gradeReason = 'GOOD: Proper column layout but missing Vegas spread format';
    } else if (vegasAnalysis.totalGames >= 5) {
        realismScore = 0.4;
        gradeReason = 'FAIR: Some games displayed but not Vegas format';
    } else {
        realismScore = 0.0;
        gradeReason = 'FAILED: No games or wrong format';
    }
    
    console.log(`\\n🏆 VEGAS REALISM GRADE:`);
    console.log(`   SCORE: ${realismScore}/1.0`);
    console.log(`   REASON: ${gradeReason}`);
    
    if (realismScore >= 0.8) {
        console.log(`🎰 VEGAS REALISM ACHIEVED! Authentic sportsbook layout confirmed!`);
    } else {
        console.log(`❌ Vegas realism needs improvement. Score: ${realismScore}`);
    }
    
  } catch (error) {
    console.log('❌ VEGAS TEST ERROR:', error.message);
    console.log('💥 REALISM TEST FAILED');
  }
  
  await browser.close();
})();