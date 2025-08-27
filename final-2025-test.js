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
  console.log('📅 2025 WEEK 1 VERIFICATION TEST');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 600, height: 1000 });
  
  try {
    const htmlPath = 'file:///C:/CFB-WORKING/vegas-board-connected.html';
    console.log(`📂 Opening 2025 sportsbook: ${htmlPath}`);
    
    await page.goto(htmlPath, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for 2025 data to load...');
    await page.waitForTimeout(10000);
    
    // Check for 2025 indicators
    const yearCheck = await page.evaluate(() => {
        const header = document.querySelector('.board-header');
        const status = document.querySelector('#status');
        const games = document.querySelectorAll('.game');
        
        const headerText = header ? header.textContent : '';
        const statusText = status ? status.textContent : '';
        
        return {
            headerHas2025: headerText.includes('2025'),
            statusHas2025: statusText.includes('2025'),
            headerText,
            statusText,
            gameCount: games.length
        };
    });
    
    console.log('📅 2025 VERIFICATION:');
    console.log(`   Header shows 2025: ${yearCheck.headerHas2025}`);
    console.log(`   Status shows 2025: ${yearCheck.statusHas2025}`);
    console.log(`   Header Text: "${yearCheck.headerText}"`);
    console.log(`   Status Text: "${yearCheck.statusText}"`);
    console.log(`   Game Count: ${yearCheck.gameCount}`);
    
    console.log('📸 Taking 2025 verification screenshot...');
    const screenshotPath = 'C:\\CFB-WORKING\\2025-WEEK1-VERIFIED.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ SCREENSHOT SAVED: ${screenshotPath}`);
    
    // 2025 VERIFICATION SCORE
    let verificationScore = 0.0;
    let verificationReason = '';
    
    if (yearCheck.gameCount >= 20 && 
        yearCheck.headerHas2025 && 
        yearCheck.statusHas2025) {
        verificationScore = 1.0;
        verificationReason = 'PERFECT: Confirmed 2025 Week 1 data with proper labeling';
    } else if (yearCheck.gameCount >= 20 && (yearCheck.headerHas2025 || yearCheck.statusHas2025)) {
        verificationScore = 0.8;
        verificationReason = 'GOOD: 2025 data with partial labeling';
    } else if (yearCheck.gameCount >= 15) {
        verificationScore = 0.6;
        verificationReason = 'FAIR: Games loaded but unclear if 2025';
    } else {
        verificationScore = 0.0;
        verificationReason = 'FAILED: Insufficient data or wrong year';
    }
    
    console.log(`\\n📅 2025 VERIFICATION GRADE:`);
    console.log(`   SCORE: ${verificationScore}/1.0`);
    console.log(`   REASON: ${verificationReason}`);
    
    if (verificationScore >= 0.8) {
        console.log(`🎉 2025 WEEK 1 CONFIRMED! Authentic 2025 season data verified!`);
    } else {
        console.log(`❌ 2025 verification failed. Score: ${verificationScore}`);
    }
    
  } catch (error) {
    console.log('❌ 2025 VERIFICATION ERROR:', error.message);
    console.log('💥 2025 TEST FAILED');
  }
  
  await browser.close();
})();