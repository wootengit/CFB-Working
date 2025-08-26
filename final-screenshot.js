const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 FINAL ATTEMPT - SCREENSHOT CALENDAR PAGE');
  
  const tempDir = path.join(__dirname, 'temp-browser');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('📡 Loading games-and-matches...');
  
  try {
    const response = await page.goto('http://localhost:3000/games-and-matches', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    console.log(`📊 Response status: ${response.status()}`);
    
    if (response.status() === 200) {
      console.log('⏱️ Page loaded, waiting...');
      await page.waitForTimeout(2000);
      
      console.log('📸 TAKING SCREENSHOT...');
      await page.screenshot({ 
        path: 'X:\\8-22v1\\8-22v1\\8-22v1\\CFB-Core-Project\\CALENDAR-FINAL-PROOF.png',
        fullPage: true 
      });
      
      console.log('✅ SCREENSHOT SAVED SUCCESSFULLY!');
    } else {
      console.log('❌ Page failed to load properly');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  await browser.close();
  console.log('🏁 Done');
})();