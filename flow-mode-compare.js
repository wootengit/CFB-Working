// 🔄 FLOW MODE COMPARE SYSTEM
// Side-by-side Reference vs Current Work

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class FlowModeCompare {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotCount = 0;
    this.screenshotDir = 'X:/CFB-Core-Project/screenshots';
    this.referenceImage = 'file:///X:/CFB-Core-Project/screenshots/02-current-lava-card-2025-08-23T19-13-39.png';
  }

  async initialize() {
    try {
      console.log('🔄 Starting Split-Screen Compare Mode...');
      
      this.browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized', '--disable-dev-shm-usage', '--no-sandbox']
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      // Create split-screen HTML
      const splitScreenHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Flow Mode Compare</title>
          <style>
            body { margin: 0; padding: 20px; background: #f0f0f0; font-family: Arial, sans-serif; }
            .container { display: flex; gap: 20px; height: 90vh; }
            .panel { flex: 1; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .panel h2 { margin: 0 0 20px 0; color: #333; text-align: center; }
            .reference { border: 3px solid #e74c3c; }
            .current { border: 3px solid #3498db; }
            iframe { width: 100%; height: calc(100% - 60px); border: none; border-radius: 8px; }
            img { max-width: 100%; max-height: calc(100% - 60px); object-fit: contain; }
            .refresh-btn { 
              position: fixed; top: 20px; right: 20px; 
              padding: 10px 20px; background: #2ecc71; color: white; 
              border: none; border-radius: 6px; cursor: pointer; 
              font-weight: bold; font-size: 14px;
            }
            .refresh-btn:hover { background: #27ae60; }
          </style>
        </head>
        <body>
          <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
          <div class="container">
            <div class="panel reference">
              <h2>🎯 REFERENCE (Airbnb Style)</h2>
              <img src="${this.referenceImage}" alt="Reference Image" />
            </div>
            <div class="panel current">
              <h2>⚡ YOUR CURRENT WORK</h2>
              <iframe src="http://localhost:3000/lava"></iframe>
            </div>
          </div>
        </body>
        </html>
      `;

      // Set the split-screen HTML
      await this.page.setContent(splitScreenHTML);
      
      console.log('✅ SPLIT-SCREEN COMPARE MODE ACTIVE');
      console.log('📸 Reference on LEFT, Current work on RIGHT');
      console.log('🔄 Click refresh button to update after edits');
      
      return true;

    } catch (error) {
      console.error('❌ Compare Mode failed:', error.message);
      return false;
    }
  }

  async takeScreenshot(suffix = '') {
    if (!this.page) return null;
    
    try {
      this.screenshotCount++;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `compare-${this.screenshotCount}-${suffix}-${timestamp}.png`;
      const fullPath = path.join(this.screenshotDir, filename);

      await this.page.screenshot({ 
        path: fullPath,
        fullPage: true
      });

      console.log(`📸 Compare screenshot saved: ${filename}`);
      return fullPath;

    } catch (error) {
      console.error('❌ Screenshot failed:', error.message);
      return null;
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up Compare Mode...');
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Start Compare Mode
async function main() {
  const compareMode = new FlowModeCompare();
  
  const success = await compareMode.initialize();
  if (!success) {
    process.exit(1);
  }

  // Keep browser open
  console.log('Browser will remain open. Press Ctrl+C to exit.');
  
  process.on('SIGINT', async () => {
    await compareMode.cleanup();
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FlowModeCompare;