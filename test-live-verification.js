/**
 * Live Verification Test - Playwright
 * Verifies that MIT research fields and Wikipedia logos are actually showing
 */

const { chromium } = require('playwright');

async function verifyLiveChanges() {
  console.log('🧪 Starting live verification test...\n');
  
  const browser = await chromium.launch({ headless: false }); // Show browser
  const page = await browser.newPage();
  
  try {
    console.log('📍 Navigating to standings page...');
    await page.goto('http://localhost:3000/standings');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ Page loaded');
    
    // Check if Advanced button exists and click it
    console.log('🔍 Looking for Advanced button...');
    const advancedButton = await page.locator('text=Advanced').first();
    
    if (await advancedButton.isVisible()) {
      console.log('✅ Advanced button found - clicking...');
      await advancedButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Advanced button not found');
    }
    
    // Check for MIT research fields in table headers
    console.log('🔍 Checking for MIT research field headers...');
    
    const mitFields = [
      'Exp Wins',
      'Havoc %', 
      'Finishing %',
      'Field Pos',
      'FPI'
    ];
    
    const foundFields = [];
    const missingFields = [];
    
    for (const field of mitFields) {
      const headerExists = await page.locator(`th:has-text("${field}")`).isVisible();
      if (headerExists) {
        foundFields.push(field);
        console.log(`✅ Found: ${field}`);
      } else {
        missingFields.push(field);
        console.log(`❌ Missing: ${field}`);
      }
    }
    
    // Check for Wikipedia logos (look for wikimedia.org URLs)
    console.log('🔍 Checking for Wikipedia logos...');
    const logoImages = await page.locator('img[src*="wikimedia"]').count();
    console.log(`Found ${logoImages} Wikipedia logos`);
    
    // Check for Mountain West abbreviation fix
    console.log('🔍 Checking Mountain West abbreviation...');
    const mwcButton = await page.locator('text=MWC').isVisible();
    if (mwcButton) {
      console.log('✅ Mountain West shows as MWC (correct)');
    } else {
      const mouButton = await page.locator('text=MOU').isVisible();
      if (mouButton) {
        console.log('❌ Mountain West still shows as MOU (incorrect)');
      } else {
        console.log('⚠️ Mountain West button not found');
      }
    }
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'live-verification-screenshot.png',
      fullPage: true 
    });
    
    // Summary
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log(`✅ MIT Research Fields Found: ${foundFields.length}/${mitFields.length}`);
    if (foundFields.length > 0) {
      console.log(`   Working: ${foundFields.join(', ')}`);
    }
    if (missingFields.length > 0) {
      console.log(`❌ Missing: ${missingFields.join(', ')}`);
    }
    console.log(`📷 Wikipedia Logos: ${logoImages} found`);
    console.log(`🏔️ Mountain West Fix: ${mwcButton ? 'Working' : 'Not Working'}`);
    
    // Keep browser open for 10 seconds so you can see
    console.log('\n👀 Keeping browser open for 10 seconds for manual verification...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
    console.log('✅ Verification test complete');
  }
}

// Run verification
verifyLiveChanges().catch(console.error);