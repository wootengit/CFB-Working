// 🌊 FLOW MODE VISUAL SYSTEM
// Human-in-the-Loop Live Screenshot System for Surgical Precision Development

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class FlowModeVisual {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotCount = 0;
    this.screenshotDir = 'X:/CFB-Core-Project/screenshots';
    this.isActive = false;
  }

  async initialize() {
    try {
      // Use X: drive instead of temp folder
      const xDriveTemp = 'X:/playwright-temp';
      if (!fs.existsSync(xDriveTemp)) {
        fs.mkdirSync(xDriveTemp, { recursive: true });
        console.log('📁 Created X: drive temp directory for Playwright');
      }
      
      // Set environment variables to use X: drive
      process.env.TEMP = xDriveTemp;
      process.env.TMP = xDriveTemp;
      process.env.TMPDIR = xDriveTemp;
      
      // Ensure screenshots directory exists
      if (!fs.existsSync(this.screenshotDir)) {
        fs.mkdirSync(this.screenshotDir, { recursive: true });
        console.log('📁 Created screenshots directory');
      }

      // Launch browser in visible mode
      console.log('🚀 Launching browser for Flow Mode...');
      this.browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized', '--disable-dev-shm-usage', '--no-sandbox'],
        // executablePath: 'X:\\CFB-Core-Project\\.playwright\\chromium-1187\\chrome-win\\chrome.exe'
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      // Navigate directly to Games & Matches calendar
      console.log('🏈 Connecting to Games & Matches calendar...');
      await this.page.goto('http://localhost:3002/games-and-matches', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      // Take initial baseline screenshot
      await this.takeScreenshot('00-baseline');
      
      console.log('✅ HUMAN FLOW MODE ACTIVATED');
      console.log('👨‍⚕️ Ready for surgical precision development!');
      console.log('📸 Screenshots will be saved to:', this.screenshotDir);
      
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
        animations: 'disabled' // For consistent screenshots
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
      await this.page.reload({ waitUntil: 'networkidle' });
      
      // Small delay to ensure page is fully rendered
      await this.page.waitForTimeout(1000);
      
      return await this.takeScreenshot(suffix);

    } catch (error) {
      console.error('❌ Refresh and screenshot failed:', error.message);
      return null;
    }
  }

  async compareElement(selector, description = '') {
    if (!this.page) {
      console.error('❌ Flow Mode not initialized');
      return null;
    }

    try {
      const element = await this.page.locator(selector);
      if (await element.count() === 0) {
        console.log(`⚠️ Element not found: ${selector}`);
        return null;
      }

      const screenshotPath = await element.screenshot({ 
        path: path.join(this.screenshotDir, `element-${description || 'capture'}-${Date.now()}.png`)
      });

      console.log(`🎯 Element screenshot: ${selector} - ${description}`);
      return screenshotPath;

    } catch (error) {
      console.error('❌ Element screenshot failed:', error.message);
      return null;
    }
  }

  async startAutoScreenshots(intervalMinutes = 4) {
    if (!this.isActive) {
      console.error('❌ Flow Mode not active');
      return;
    }

    console.log(`⏰ Starting auto-screenshots every ${intervalMinutes} minutes`);
    
    const interval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(interval);
        return;
      }
      
      await this.takeScreenshot('auto');
    }, intervalMinutes * 60 * 1000);

    return interval;
  }

  async gradualScreenshots() {
    // Take screenshots at key development moments
    console.log('📊 Taking gradual development screenshots...');
    
    const stages = [
      'component-structure',
      'basic-styling', 
      'responsive-layout',
      'interactive-elements',
      'final-polish'
    ];

    for (let i = 0; i < stages.length; i++) {
      console.log(`📸 Stage ${i + 1}/5: ${stages[i]}`);
      await this.takeScreenshot(stages[i]);
      
      // Wait for user to make changes to this stage
      console.log(`⏳ Make your changes for ${stages[i]}, then press Enter to continue...`);
      
      // In actual implementation, this would wait for user input
      // For now, just a delay to simulate development time
      await new Promise(resolve => {
        process.stdin.once('data', () => {
          resolve();
        });
      });
    }
    
    console.log('🎉 All development stages captured!');
  }

  async cleanup() {
    console.log('🧹 Cleaning up Flow Mode...');
    
    this.isActive = false;
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log('✅ Flow Mode deactivated');
  }

  // Utility method for quick CFB component screenshots
  async captureGameCard() {
    return await this.compareElement('[data-testid="game-card"], .game-card', 'game-card');
  }

  async captureBettingSlip() {
    return await this.compareElement('[data-testid="betting-slip"], .betting-slip', 'betting-slip');
  }

  async captureOddsDisplay() {
    return await this.compareElement('[data-testid="odds-display"], .odds-display', 'odds-display');
  }
}

// CLI Interface
async function main() {
  const flowMode = new FlowModeVisual();
  
  const success = await flowMode.initialize();
  if (!success) {
    process.exit(1);
  }

  // Handle different command line arguments
  const command = process.argv[2];
  
  switch (command) {
    case 'auto':
      const intervalMinutes = parseInt(process.argv[3]) || 4;
      await flowMode.startAutoScreenshots(intervalMinutes);
      console.log('Press Ctrl+C to stop auto-screenshots');
      break;
      
    case 'gradual':
      await flowMode.gradualScreenshots();
      break;
      
    case 'gamecard':
      await flowMode.captureGameCard();
      break;
      
    case 'screenshot':
      const suffix = process.argv[3] || 'manual';
      await flowMode.takeScreenshot(suffix);
      break;
      
    default:
      console.log('🎯 Flow Mode Visual System Ready');
      console.log('Available commands:');
      console.log('  node flow-mode-visual.js screenshot [suffix]  - Take single screenshot');
      console.log('  node flow-mode-visual.js auto [minutes]       - Start auto-screenshots');
      console.log('  node flow-mode-visual.js gradual             - Gradual development mode');
      console.log('  node flow-mode-visual.js gamecard            - Capture game card component');
      console.log('');
      console.log('Browser will remain open. Press Ctrl+C to exit.');
      break;
  }

  // Keep process alive until user terminates
  process.on('SIGINT', async () => {
    await flowMode.cleanup();
    process.exit(0);
  });
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FlowModeVisual;