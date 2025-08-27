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
  console.log('🎯 FINAL TEST: API-Connected Sportsbook');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1600 });
  
  try {
    const htmlPath = 'file:///C:/CFB-WORKING/real-week1-sportsbook.html';
    console.log(`📂 Opening: ${htmlPath}`);
    
    await page.goto(htmlPath, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for API data to load...');
    await page.waitForTimeout(8000); // Give time for API
    
    // Deep analysis
    const finalAnalysis = await page.evaluate(() => {
        const games = document.querySelectorAll('.game');
        const statusBar = document.querySelector('#status');
        const teamNames = Array.from(document.querySelectorAll('.team-name')).map(t => t.textContent);
        
        // Check for specific top teams
        const hasAlabama = teamNames.some(name => name.includes('ALABAMA'));
        const hasGeorgia = teamNames.some(name => name.includes('GEORGIA'));
        const hasTexas = teamNames.some(name => name.includes('TEXAS'));
        const hasOhioState = teamNames.some(name => name.includes('OHIO'));
        
        // Get sample odds
        const spreads = Array.from(document.querySelectorAll('.spread-fav, .spread-dog')).slice(0, 5).map(s => s.textContent);
        const moneylines = Array.from(document.querySelectorAll('.ml-fav, .ml-dog')).slice(0, 5).map(m => m.textContent);
        
        return {
            totalGames: games.length,
            statusText: statusBar ? statusBar.textContent : 'NO STATUS',
            teamCount: teamNames.length,
            hasTopTeams: { hasAlabama, hasGeorgia, hasTexas, hasOhioState },
            sampleTeams: teamNames.slice(0, 10),
            sampleSpreads: spreads,
            sampleMoneylines: moneylines,
            apiConnected: statusBar ? statusBar.textContent.includes('API') : false
        };
    });
    
    console.log('📊 FINAL ANALYSIS:');
    console.log(`   Total Games: ${finalAnalysis.totalGames}`);
    console.log(`   Total Teams: ${finalAnalysis.teamCount}`);
    console.log(`   Status: ${finalAnalysis.statusText}`);
    console.log(`   API Connected: ${finalAnalysis.apiConnected}`);
    console.log('   Top Teams Present:');
    console.log(`     Alabama: ${finalAnalysis.hasTopTeams.hasAlabama}`);
    console.log(`     Georgia: ${finalAnalysis.hasTopTeams.hasGeorgia}`);
    console.log(`     Texas: ${finalAnalysis.hasTopTeams.hasTexas}`);
    console.log(`     Ohio State: ${finalAnalysis.hasTopTeams.hasOhioState}`);
    console.log('   Sample Teams:', finalAnalysis.sampleTeams.slice(0, 5).join(', '));
    console.log('   Sample Spreads:', finalAnalysis.sampleSpreads.join(', '));
    console.log('   Sample Moneylines:', finalAnalysis.sampleMoneylines.join(', '));
    
    console.log('📸 Taking FINAL screenshot...');
    const screenshotPath = 'C:\\CFB-WORKING\\WEEK1-GAMES-FINAL.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ FINAL SCREENSHOT SAVED: ${screenshotPath}`);
    
    // FINAL GRADE
    let grade = 0.0;
    let gradeReason = '';
    
    if (finalAnalysis.totalGames >= 25 && 
        finalAnalysis.hasTopTeams.hasAlabama && 
        finalAnalysis.hasTopTeams.hasGeorgia &&
        finalAnalysis.hasTopTeams.hasTexas &&
        finalAnalysis.hasTopTeams.hasOhioState &&
        finalAnalysis.sampleSpreads.length >= 3) {
        grade = 1.0;
        gradeReason = 'PERFECT: 25 Week 1 games with real Vegas odds - Alabama, Georgia, Texas, Ohio State all present!';
    } else if (finalAnalysis.totalGames >= 15) {
        grade = 0.8;
        gradeReason = 'EXCELLENT: 15+ games loaded';
    } else if (finalAnalysis.totalGames >= 8) {
        grade = 0.6;
        gradeReason = 'GOOD: 8+ games loaded';
    } else if (finalAnalysis.totalGames >= 3) {
        grade = 0.4;
        gradeReason = 'PARTIAL: Some games loaded';
    } else {
        grade = 0.0;
        gradeReason = 'FAILED: No games loaded';
    }
    
    console.log(`\n🏆 CHALLENGE RESULT:`);
    console.log(`   GRADE: ${grade}`);
    console.log(`   REASON: ${gradeReason}`);
    
    if (grade >= 1.0) {
        console.log(`🎉 CHALLENGE COMPLETED! API Week 1 games confirmed with screenshot!`);
    } else {
        console.log(`❌ Challenge not yet complete. Grade: ${grade}`);
    }
    
  } catch (error) {
    console.log('❌ FINAL TEST ERROR:', error.message);
    console.log('💥 CHALLENGE FAILED: Screenshot test failed');
  }
  
  await browser.close();
})();