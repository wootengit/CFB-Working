const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting Playwright screenshot...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('📡 Navigating to games-and-matches page...');
    await page.goto('http://localhost:3000/games-and-matches', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('⏱️ Waiting for page to fully load...');
    await page.waitForTimeout(5000);
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'CALENDAR-PROOF.png',
      fullPage: true 
    });
    
    console.log('✅ SUCCESS: Screenshot saved as CALENDAR-PROOF.png');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('📸 Taking error screenshot...');
    await page.screenshot({ path: 'ERROR-SCREENSHOT.png' });
  }
  
  await browser.close();
})();