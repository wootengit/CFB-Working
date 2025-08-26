// NUCLEAR OPTION - SCREENSHOT THE FUCKING CALENDAR

const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 NUCLEAR SCREENSHOT ATTEMPT');
  
  // Import playwright from project node_modules
  const { chromium } = require('./node_modules/playwright');
  
  console.log('📦 Playwright imported successfully');
  
  // Force create temp directories
  const tempDirs = [
    'C:\\temp',
    'C:\\temp\\playwright', 
    path.join(__dirname, 'temp-playwright')
  ];
  
  tempDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created: ${dir}`);
    }
  });
  
  // Override environment variables
  process.env.TMPDIR = 'C:\\temp';
  process.env.TEMP = 'C:\\temp';
  process.env.TMP = 'C:\\temp';
  process.env.PLAYWRIGHT_BROWSERS_PATH = 'C:\\temp\\playwright-browsers';
  
  console.log('🌍 Environment variables set');
  
  try {
    console.log('🚀 Launching browser...');
    
    const context = await chromium.launchPersistentContext('C:\\temp\\playwright-context', {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    console.log('✅ Browser launched successfully');
    
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('📡 Navigating to games-and-matches...');
    
    const response = await page.goto('http://localhost:3000/games-and-matches', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log(`📊 Response: ${response.status()}`);
    
    if (response.status() !== 200) {
      throw new Error(`Page failed with status ${response.status()}`);
    }
    
    console.log('⏱️ Waiting for content...');
    await page.waitForTimeout(5000);
    
    console.log('📸 TAKING SCREENSHOT NOW...');
    
    await page.screenshot({
      path: path.join(__dirname, 'CALENDAR-NUCLEAR-PROOF.png'),
      fullPage: true
    });
    
    console.log('✅ SUCCESS! SCREENSHOT SAVED AS CALENDAR-NUCLEAR-PROOF.png');
    
    await context.close();
    console.log('🏁 Browser closed successfully');
    
  } catch (error) {
    console.log('💥 NUCLEAR SCREENSHOT FAILED:', error.message);
    console.log('💥 Stack:', error.stack);
    process.exit(1);
  }
  
})().catch(err => {
  console.error('💥 CATASTROPHIC FAILURE:', err.message);
  process.exit(1);
});