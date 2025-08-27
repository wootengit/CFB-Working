// 🐌 SLOW MODE ACTIVATION SCRIPT
// Opens the live sportsbook page on the working Next.js server

const { chromium } = require('playwright');

async function activateSlowMode() {
  console.log('🐌 ACTIVATING SLOW MODE - LIVE NCAA SPORTSBOOK');
  console.log('🏈 Opening sportsbook on working server...');
  
  try {
    // Launch browser in full screen
    const browser = await chromium.launch({ 
      headless: false,
      args: ['--start-maximized', '--kiosk', '--disable-dev-shm-usage'],
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to the live sportsbook page on the working server
    console.log('🚀 Connecting to http://localhost:3000/sportsbook/live');
    await page.goto('http://localhost:3000/sportsbook/live', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ SLOW MODE ACTIVATED');
    console.log('📺 Live NCAA Sportsbook is now on your screen');
    console.log('🔄 Auto-refreshes every 5 minutes with real data');
    console.log('💾 Press Ctrl+C to exit');
    
    // Keep the browser open
    process.on('SIGINT', async () => {
      console.log('\n🛑 Closing browser...');
      await browser.close();
      process.exit(0);
    });
    
    // Auto-refresh every 5 minutes to get new data
    setInterval(async () => {
      console.log('🔄 Auto-refreshing for new odds...');
      await page.reload({ waitUntil: 'networkidle' });
    }, 300000); // 5 minutes
    
  } catch (error) {
    console.error('❌ Slow Mode activation failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure the Next.js server is running: npm run dev');
    }
    process.exit(1);
  }
}

// Execute
activateSlowMode().catch(console.error);