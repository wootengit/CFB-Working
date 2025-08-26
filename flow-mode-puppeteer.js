// 🌊 FLOW MODE - PUPPETEER VERSION
// Bypassing Playwright temp directory issues

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class FlowModePuppeteer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotCount = 0;
    this.screenshotDir = 'X:/CFB-Core-Project/screenshots';
    this.isActive = false;
  }

  async initialize() {
    try {
      // Ensure screenshots directory exists
      if (!fs.existsSync(this.screenshotDir)) {
        fs.mkdirSync(this.screenshotDir, { recursive: true });
        console.log('📁 Created screenshots directory');
      }

      // Launch browser
      console.log('🚀 Launching Puppeteer browser for Flow Mode...');
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: [
          '--start-maximized',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1920, height: 1080 });

      // Navigate to CFB dev server
      console.log('🏈 Connecting to CFB development server...');
      await this.page.goto('http://localhost:3000/standings', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Take initial baseline screenshot
      await this.takeScreenshot('baseline-standings');
      
      console.log('✅ FLOW MODE ACTIVATED WITH PUPPETEER');
      console.log('👨‍⚕️ Ready for surgical precision development!');
      console.log('📸 Screenshots saved to:', this.screenshotDir);
      
      this.isActive = true;
      return true;

    } catch (error) {
      console.error('❌ Flow Mode initialization failed:', error.message);
      if (error.message.includes('ECONNREFUSED')) {
        console.log('💡 Make sure dev server is running: npm run dev');
      }
      return false;
    }
  }

  async takeScreenshot(suffix = '') {
    if (!this.page) {
      console.error('❌ Flow Mode not initialized');
      return null;
    }

    try {
      this.screenshotCount++;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = suffix 
        ? `${String(this.screenshotCount).padStart(2, '0')}-${suffix}-${timestamp}.png`
        : `${String(this.screenshotCount).padStart(2, '0')}-${timestamp}.png`;
      
      const fullPath = path.join(this.screenshotDir, filename);

      await this.page.screenshot({ 
        path: fullPath,
        fullPage: true,
        type: 'png'
      });

      console.log(`📸 Screenshot saved: ${filename}`);
      return fullPath;

    } catch (error) {
      console.error('❌ Screenshot failed:', error.message);
      return null;
    }
  }

  async refreshAndScreenshot(suffix = 'after-change') {
    if (!this.page) {
      console.error('❌ Flow Mode not initialized');
      return null;
    }

    try {
      console.log('🔄 Refreshing page to capture changes...');
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      // Small delay to ensure page is fully rendered
      await this.page.waitForTimeout(1000);
      
      return await this.takeScreenshot(suffix);

    } catch (error) {
      console.error('❌ Refresh and screenshot failed:', error.message);
      return null;
    }
  }

  async navigateToStandings() {
    if (!this.page) {
      console.error('❌ Flow Mode not initialized');
      return false;
    }

    try {
      console.log('🏈 Navigating to standings page...');
      await this.page.goto('http://localhost:3000/standings', { 
        waitUntil: 'networkidle2' 
      });
      await this.takeScreenshot('standings-loaded');
      return true;
    } catch (error) {
      console.error('❌ Navigation failed:', error.message);
      return false;
    }
  }

  async captureElement(selector, description = '') {
    if (!this.page) {
      console.error('❌ Flow Mode not initialized');
      return null;
    }

    try {
      const element = await this.page.$(selector);
      if (!element) {
        console.log(`⚠️ Element not found: ${selector}`);
        return null;
      }

      const filename = `element-${description || 'capture'}-${Date.now()}.png`;
      const screenshotPath = path.join(this.screenshotDir, filename);
      
      await element.screenshot({ 
        path: screenshotPath,
        type: 'png'
      });

      console.log(`🎯 Element screenshot: ${selector} - ${description}`);
      return screenshotPath;

    } catch (error) {
      console.error('❌ Element screenshot failed:', error.message);
      return null;
    }
  }

  async waitForStandingsData() {
    try {
      console.log('⏳ Waiting for standings data to load...');
      
      // Wait for the standings table to appear
      await this.page.waitForSelector('[data-standings-table="true"]', { 
        timeout: 10000 
      });
      
      // Wait for team rows to appear
      await this.page.waitForSelector('[data-standings-row="true"]', { 
        timeout: 10000 
      });
      
      console.log('✅ Standings data loaded');
      await this.takeScreenshot('standings-data-loaded');
      return true;
      
    } catch (error) {
      console.log('⚠️ Standings data taking longer to load, continuing anyway...');
      await this.takeScreenshot('standings-loading-timeout');
      return false;
    }
  }

  async testAdvancedToggle() {
    try {
      console.log('🎯 Testing advanced toggle...');
      
      // Click the Advanced button
      const advancedButton = await this.page.$('button:contains("Advanced")');
      if (advancedButton) {
        await advancedButton.click();
        await this.page.waitForTimeout(500);
        await this.takeScreenshot('advanced-mode-enabled');
        console.log('✅ Advanced mode enabled');
        return true;
      } else {
        console.log('⚠️ Advanced button not found');
        return false;
      }
    } catch (error) {
      console.error('❌ Advanced toggle test failed:', error.message);
      return false;
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up Flow Mode...');
    
    this.isActive = false;
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log('✅ Flow Mode deactivated');
  }
}

// CLI Interface
async function main() {
  const flowMode = new FlowModePuppeteer();
  
  const success = await flowMode.initialize();
  if (!success) {
    process.exit(1);
  }

  // Handle different command line arguments
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'wait-data':
        await flowMode.waitForStandingsData();
        break;
        
      case 'test-advanced':
        await flowMode.testAdvancedToggle();
        break;
        
      case 'refresh':
        await flowMode.refreshAndScreenshot('manual-refresh');
        break;
        
      case 'screenshot':
        const suffix = process.argv[3] || 'manual';
        await flowMode.takeScreenshot(suffix);
        break;
        
      default:
        console.log('🎯 Flow Mode Ready - Puppeteer Version');
        console.log('Available commands:');
        console.log('  node flow-mode-puppeteer.js screenshot [suffix]  - Take screenshot');
        console.log('  node flow-mode-puppeteer.js refresh             - Refresh and screenshot');
        console.log('  node flow-mode-puppeteer.js wait-data           - Wait for data load');
        console.log('  node flow-mode-puppeteer.js test-advanced       - Test advanced toggle');
        console.log('');
        console.log('🏈 Standings page loaded at: http://localhost:3000/standings');
        console.log('Browser will remain open. Press Ctrl+C to exit.');
        break;
    }
    
    // Keep process alive until user terminates (for default case)
    if (!command || command === 'default') {
      await new Promise(() => {}); // Keep alive indefinitely
    }
    
  } catch (error) {
    console.error('❌ Command execution failed:', error.message);
  } finally {
    if (command && command !== 'default') {
      await flowMode.cleanup();
    }
  }
}

// Handle cleanup on exit
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Flow Mode...');
  process.exit(0);
});

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FlowModePuppeteer;