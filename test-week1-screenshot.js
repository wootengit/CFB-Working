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
  console.log('🎯 Testing Week 1 Sportsbook Board...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1600 });
  
  try {
    const htmlPath = 'file:///C:/CFB-WORKING/week1-sportsbook-working.html';
    console.log(`📂 Opening: ${htmlPath}`);
    
    await page.goto(htmlPath, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for content to render...');
    await page.waitForTimeout(2000);
    
    // Count games and analyze content
    const analysis = await page.evaluate(() => {
        const games = document.querySelectorAll('.game');
        const statusBar = document.querySelector('.status-bar');
        const boardHeader = document.querySelector('.board-header');
        
        // Get some game details
        const gameDetails = [];
        games.forEach((game, index) => {
            const gameInfo = game.querySelector('.game-info');
            const teamNames = Array.from(game.querySelectorAll('.team-name')).map(t => t.textContent);
            if (index < 5) { // First 5 games
                gameDetails.push({
                    info: gameInfo ? gameInfo.textContent : 'NO INFO',
                    teams: teamNames
                });
            }
        });
        
        return {
            totalGames: games.length,
            statusText: statusBar ? statusBar.textContent : 'NO STATUS',
            headerText: boardHeader ? boardHeader.textContent : 'NO HEADER',
            sampleGames: gameDetails
        };
    });
    
    console.log('📊 SPORTSBOOK ANALYSIS:');
    console.log(`   Total Games: ${analysis.totalGames}`);
    console.log(`   Status: ${analysis.statusText}`);
    console.log(`   Header: ${analysis.headerText}`);
    console.log('   Sample Games:');
    analysis.sampleGames.forEach((game, i) => {
        console.log(`     Game ${i+1}: ${game.info} - ${game.teams.join(' vs ')}`);
    });
    
    console.log('📸 Taking screenshot...');
    const screenshotPath = 'C:\\CFB-WORKING\\WEEK1-SPORTSBOOK-TEST.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ SCREENSHOT SAVED: ${screenshotPath}`);
    
    // Grade the implementation
    let grade = 0.0;
    
    if (analysis.totalGames >= 12) {
        grade = 1.0;
        console.log('🎉 SUCCESS: 12+ games loaded - GRADE 1.0');
    } else if (analysis.totalGames >= 8) {
        grade = 0.8;
        console.log('⚠️  GOOD: 8+ games loaded - GRADE 0.8');  
    } else if (analysis.totalGames >= 5) {
        grade = 0.6;
        console.log('⚠️  OKAY: 5+ games loaded - GRADE 0.6');
    } else if (analysis.totalGames >= 1) {
        grade = 0.3;
        console.log('❌ MINIMAL: Some games loaded - GRADE 0.3');
    } else {
        grade = 0.0;
        console.log('💥 FAILED: No games loaded - GRADE 0.0');
    }
    
    console.log(`\n🏆 FINAL GRADE: ${grade}`);
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('💥 FAILED: Test failed - GRADE 0.0');
  }
  
  await browser.close();
})();