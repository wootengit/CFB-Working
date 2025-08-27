const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Set proper temp directory for Windows
const tempDir = 'C:\\CFB-WORKING\\temp-playwright';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
process.env.TEMP = tempDir;
process.env.TMP = tempDir;
process.env.TMPDIR = tempDir;

(async () => {
  console.log('🎯 Testing Vegas Sportsbook Board...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security'],
    executablePath: undefined
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1600 });
  
  try {
    const htmlPath = 'file:///C:/CFB-WORKING/vegas-sportsbook-fixed.html';
    console.log(`📂 Opening: ${htmlPath}`);
    
    await page.goto(htmlPath, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting for data to load...');
    await page.waitForTimeout(8000); // Give time for API calls
    
    // Check if games loaded
    const gamesCount = await page.evaluate(() => {
        const games = document.querySelectorAll('.game');
        const status = document.getElementById('status');
        const statusText = status ? status.textContent : 'NO STATUS';
        const gamesContainer = document.getElementById('games-container');
        const containerText = gamesContainer ? gamesContainer.textContent : 'NO CONTAINER';
        
        console.log('Status:', statusText);
        console.log('Games found:', games.length);
        console.log('Container text:', containerText.substring(0, 200));
        
        return {
            gamesCount: games.length,
            statusText: statusText,
            containerPreview: containerText.substring(0, 500)
        };
    });
    
    console.log('📊 ANALYSIS:');
    console.log(`   Games loaded: ${gamesCount.gamesCount}`);
    console.log(`   Status: ${gamesCount.statusText}`);
    console.log(`   Content preview: ${gamesCount.containerPreview}`);
    
    console.log('📸 Taking screenshot...');
    const screenshotPath = 'C:\\CFB-WORKING\\SPORTSBOOK-TEST.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ SCREENSHOT SAVED: ${screenshotPath}`);
    
    // Grade the result
    if (gamesCount.gamesCount > 50) {
        console.log('🎉 SUCCESS: Lots of games loaded - approaching grade 1.0');
    } else if (gamesCount.gamesCount > 10) {
        console.log('⚠️  PARTIAL: Some games loaded - grade ~0.5');  
    } else if (gamesCount.gamesCount > 0) {
        console.log('❌ MINIMAL: Few games loaded - grade ~0.2');
    } else {
        console.log('💥 FAILED: No games loaded - grade 0.0');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('💥 FAILED: Screenshot failed - grade 0.0');
  }
  
  await browser.close();
})();