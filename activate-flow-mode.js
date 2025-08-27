const { chromium } = require('playwright');

async function activateFlowMode() {
  console.log('🌊 ACTIVATING FLOW MODE - HUMAN-IN-THE-LOOP');
  console.log('👨‍⚕️ Starting surgical precision visual feedback...\n');
  
  try {
    // Launch browser in non-headless mode so you can see it
    const browser = await chromium.launch({ 
      headless: false,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });
    
    // First check if server is running
    console.log('🔍 Checking server status...');
    const baseUrl = 'http://localhost:3007';
    try {
      await page.goto(baseUrl, { timeout: 10000 });
      console.log('✅ Server is running on port 3007');
    } catch (error) {
      console.log('❌ Server not responding on port 3007');
      throw new Error('Server not running. Please start with: npm run dev');
    }
    
    // Navigate to stats page
    console.log('📊 Navigating to Stats page...');
    await page.goto(`${baseUrl}/stats`);
    
    // Wait for content to load
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(5000);
    
    // Take screenshot
    const timestamp = Date.now();
    const screenshotPath = `C:/CFB-WORKING/screenshots/stats-page-${timestamp}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log('\n✅ FLOW MODE SUCCESSFULLY ACTIVATED!');
    console.log('📸 Screenshot saved:', screenshotPath);
    console.log('🎯 Stats page is now open in your browser');
    console.log('👁️ You should see the page on your screen\n');
    
    console.log('📌 IMPORTANT: The browser window will stay open');
    console.log('📌 You can interact with the page directly');
    console.log('📌 Use Ctrl+C to close when done\n');
    
    // Keep browser open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Flow Mode activation failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Make sure Next.js server is running: npm run dev');
    console.log('2. Check that port 3000, 3005, or 3006 is available');
    console.log('3. Ensure Playwright is installed: npm install playwright');
  }
}

// Run immediately
activateFlowMode();