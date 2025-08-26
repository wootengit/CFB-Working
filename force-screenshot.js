const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 FORCING SCREENSHOT...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: 'X:\\8-22v1\\8-22v1\\8-22v1\\CFB-Core-Project\\temp-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('📡 Navigating to http://localhost:3000/sportsbook');
  await page.goto('http://localhost:3000/sportsbook', { 
    waitUntil: 'domcontentloaded',
    timeout: 15000 
  });
  
  console.log('⏱️ Waiting for content...');
  await page.waitForTimeout(5000);
  
  console.log('📸 TAKING SCREENSHOT NOW...');
  await page.screenshot({ 
    path: 'X:\\8-22v1\\8-22v1\\8-22v1\\CFB-Core-Project\\SPORTSBOOK-PROOF.png',
    fullPage: true 
  });
  
  console.log('✅ SCREENSHOT SAVED TO SPORTSBOOK-PROOF.png');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ SCREENSHOT FAILED:', err);
  process.exit(1);
});