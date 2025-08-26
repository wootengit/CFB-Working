const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 FORCING SCREENSHOT WITH CUSTOM TEMP...');
  
  // Create custom temp directory
  const customTempDir = path.join(__dirname, 'playwright-temp');
  if (!fs.existsSync(customTempDir)) {
    fs.mkdirSync(customTempDir, { recursive: true });
  }
  
  process.env.TMPDIR = customTempDir;
  process.env.TEMP = customTempDir;
  process.env.TMP = customTempDir;
  
  const browser = await chromium.launch({
    headless: true,
    userDataDir: path.join(customTempDir, 'browser-data'),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      `--user-data-dir=${path.join(customTempDir, 'browser-data')}`
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('📡 Loading http://localhost:3000/games-and-matches');
    
    await page.goto('http://localhost:3000/games-and-matches', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏱️ Waiting for content...');
    await page.waitForTimeout(3000);
    
    console.log('📸 TAKING SCREENSHOT NOW...');
    await page.screenshot({ 
      path: 'CALENDAR-WORKING-PROOF.png',
      fullPage: true 
    });
    
    console.log('✅ SUCCESS: CALENDAR SCREENSHOT SAVED!');
    
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    try {
      await page.screenshot({ path: 'FAILED-SCREENSHOT.png' });
      console.log('📸 Error screenshot saved');
    } catch (e) {
      console.log('Could not save error screenshot');
    }
  }
  
  await browser.close();
  console.log('🏁 Browser closed');
})().catch(err => {
  console.error('💥 SCRIPT FAILED:', err.message);
  process.exit(1);
});