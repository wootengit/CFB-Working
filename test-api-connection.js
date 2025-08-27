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
  console.log('🔌 API CONNECTION TEST - Vegas Sportsbook');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 600, height: 1000 });
  
  try {
    const htmlPath = 'file:///C:/CFB-WORKING/vegas-board-connected.html';
    console.log(`📂 Opening API-connected sportsbook: ${htmlPath}`);
    
    await page.goto(htmlPath, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for API connection and data load...');
    await page.waitForTimeout(12000); // Give more time for API
    
    // Check console logs for API activity
    page.on('console', msg => console.log('🖥️ Browser:', msg.text()));
    
    // Analyze API connection status
    const apiStatus = await page.evaluate(() => {
        const games = document.querySelectorAll('.game');
        const statusBar = document.querySelector('#status');
        const teamNames = Array.from(document.querySelectorAll('.team-name')).map(t => t.textContent);
        const errorDiv = document.querySelector('.error');
        
        // Check if API data loaded
        const hasAPIGames = games.length > 0;
        const statusText = statusBar ? statusBar.textContent : 'NO STATUS';
        const isConnected = statusText.includes('LIVE') && statusText.includes('API CONNECTED');
        const hasError = errorDiv !== null;
        const errorText = hasError ? errorDiv.textContent : null;
        
        // Look for Vegas formatting
        const hasSpreadsInTeamNames = teamNames.some(name => name.includes('-'));
        const hasRealTeams = teamNames.some(name => 
            name.includes('ALABAMA') || 
            name.includes('GEORGIA') || 
            name.includes('TEXAS') ||
            name.includes('OHIO')
        );
        
        return {
            totalGames: games.length,
            statusText,
            isConnected,
            hasError,
            errorText,
            hasSpreadsInTeamNames,
            hasRealTeams,
            sampleTeams: teamNames.slice(0, 6),
            spreadsFound: teamNames.filter(name => name.includes('-')).slice(0, 5)
        };
    });
    
    console.log('🔍 API CONNECTION ANALYSIS:');
    console.log(`   Total Games Loaded: ${apiStatus.totalGames}`);
    console.log(`   Status: ${apiStatus.statusText}`);
    console.log(`   API Connected: ${apiStatus.isConnected}`);
    console.log(`   Has Error: ${apiStatus.hasError}`);
    if (apiStatus.hasError) {
        console.log(`   Error Details: ${apiStatus.errorText}`);
    }
    console.log(`   Real Teams Found: ${apiStatus.hasRealTeams}`);
    console.log(`   Vegas Format (spreads): ${apiStatus.hasSpreadsInTeamNames}`);
    console.log('   Sample Teams:', apiStatus.sampleTeams.join(', '));
    console.log('   Spreads Found:', apiStatus.spreadsFound.join(', '));
    
    console.log('📸 Taking API connection screenshot...');
    const screenshotPath = 'C:\\CFB-WORKING\\API-CONNECTION-TEST.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ SCREENSHOT SAVED: ${screenshotPath}`);
    
    // API CONNECTION GRADING
    let connectionScore = 0.0;
    let connectionReason = '';
    
    if (apiStatus.totalGames >= 20 && 
        apiStatus.isConnected && 
        apiStatus.hasRealTeams &&
        apiStatus.hasSpreadsInTeamNames &&
        !apiStatus.hasError) {
        connectionScore = 1.0;
        connectionReason = 'PERFECT: API fully connected with 20+ real games in Vegas format';
    } else if (apiStatus.totalGames >= 15 && apiStatus.hasRealTeams && !apiStatus.hasError) {
        connectionScore = 0.8;
        connectionReason = 'EXCELLENT: API connected with real games';
    } else if (apiStatus.totalGames >= 5 && !apiStatus.hasError) {
        connectionScore = 0.6;
        connectionReason = 'GOOD: API partially working';
    } else if (!apiStatus.hasError) {
        connectionScore = 0.3;
        connectionReason = 'POOR: API responding but no games loaded';
    } else {
        connectionScore = 0.0;
        connectionReason = `FAILED: ${apiStatus.errorText || 'API connection failed'}`;
    }
    
    console.log(`\\n🔌 API CONNECTION GRADE:`);
    console.log(`   SCORE: ${connectionScore}/1.0`);
    console.log(`   REASON: ${connectionReason}`);
    
    if (connectionScore >= 0.8) {
        console.log(`🎰 API CONNECTION SUCCESS! Live data confirmed!`);
    } else {
        console.log(`❌ API connection issues detected. Score: ${connectionScore}`);
    }
    
  } catch (error) {
    console.log('❌ API CONNECTION TEST ERROR:', error.message);
    console.log('💥 CONNECTION TEST FAILED');
  }
  
  await browser.close();
})();