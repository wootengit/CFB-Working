const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting screenshot...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('Navigating to sportsbook page...');
    await page.goto('http://localhost:3000/sportsbook', { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: 'SPORTSBOOK-PROOF.png',
      fullPage: true 
    });
    
    console.log('✅ SCREENSHOT SAVED AS SPORTSBOOK-PROOF.png');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  }
  
  await browser.close();
})();