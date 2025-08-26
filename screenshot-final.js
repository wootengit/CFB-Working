const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🚀 Taking screenshot of games-and-matches calendar...');
  
  // Create temp directory
  const tempDir = 'C:\\temp\\playwright-context';
  if (!fs.existsSync('C:\\temp')) {
    fs.mkdirSync('C:\\temp', { recursive: true });
  }
  
  const context = await chromium.launchPersistentContext(tempDir, {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('📡 Navigating to games-and-matches...');
    await page.goto('http://localhost:3000/games-and-matches', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('📡 Page loaded, waiting for content...');
    await page.waitForTimeout(5000);
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'C:\\CFB-WORKING\\CALENDAR-SCREENSHOT.png',
      fullPage: true 
    });
    
    console.log('✅ SCREENSHOT SAVED: CALENDAR-SCREENSHOT.png');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  await context.close();
})();