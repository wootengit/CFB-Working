const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Taking screenshot of games-and-matches calendar...');
  
  // Create temp directory
  const tempDir = 'C:\\temp\\playwright-temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Set environment variables
  process.env.TMPDIR = 'C:\\temp';
  process.env.TEMP = 'C:\\temp';
  process.env.TMP = 'C:\\temp';
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      `--user-data-dir=${tempDir}`
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    await page.goto('http://localhost:3000/games-and-matches', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('📡 Page loaded, waiting for content...');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'C:\\CFB-WORKING\\CALENDAR-SCREENSHOT.png',
      fullPage: true 
    });
    
    console.log('✅ SCREENSHOT SAVED: CALENDAR-SCREENSHOT.png');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  await browser.close();
})();