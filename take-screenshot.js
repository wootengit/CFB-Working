const { chromium } = require('playwright');
const os = require('os');

// Set proper temp directory
process.env.TEMP = os.tmpdir();
process.env.TMP = os.tmpdir();

(async () => {
  console.log('🚀 Taking screenshot of standings page...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    await page.goto('http://localhost:3002/standings', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('📡 Page loaded, waiting for content...');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'C:\\CFB-WORKING\\STANDINGS-SCREENSHOT.png',
      fullPage: true 
    });
    
    console.log('✅ SCREENSHOT SAVED: STANDINGS-SCREENSHOT.png');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  await browser.close();
})();