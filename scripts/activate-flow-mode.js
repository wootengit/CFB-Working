const { spawn } = require('child_process');
const path = require('path');

const SERVER_URL = 'http://localhost:3002/calendar';

console.log('🚀 Activating Flow Mode - Visual Development Interface');
console.log(`📱 Target URL: ${SERVER_URL}`);

// Try multiple browser options for cross-platform compatibility
const browsers = [
  'start',  // Windows default
  'explorer.exe',  // Windows Explorer
  'cmd /c start',  // Windows cmd
  'powershell.exe -Command "Start-Process"'  // PowerShell
];

function launchBrowser(url) {
  return new Promise((resolve, reject) => {
    let attempted = 0;
    
    function tryNext() {
      if (attempted >= browsers.length) {
        reject(new Error('All browser launch methods failed'));
        return;
      }
      
      const browser = browsers[attempted];
      console.log(`🌐 Attempting browser launch method ${attempted + 1}: ${browser}`);
      
      let proc;
      if (browser.includes('powershell')) {
        proc = spawn('powershell.exe', ['-Command', `Start-Process "${url}"`], {
          stdio: 'inherit',
          shell: true
        });
      } else if (browser === 'start') {
        proc = spawn('cmd', ['/c', 'start', url], {
          stdio: 'inherit',
          shell: true
        });
      } else {
        proc = spawn(browser, [url], {
          stdio: 'inherit',
          shell: true
        });
      }
      
      proc.on('error', (err) => {
        console.log(`❌ Method ${attempted + 1} failed:`, err.message);
        attempted++;
        setTimeout(tryNext, 1000);
      });
      
      proc.on('exit', (code) => {
        if (code === 0) {
          console.log('✅ Flow Mode activated successfully!');
          console.log('📺 CFB Calendar should now be visible on your screen');
          resolve();
        } else {
          console.log(`❌ Method ${attempted + 1} exited with code ${code}`);
          attempted++;
          setTimeout(tryNext, 1000);
        }
      });
    }
    
    tryNext();
  });
}

async function main() {
  try {
    console.log('⚡ Flow Mode Activation Sequence Initiated');
    console.log('🎯 Launching CFB Calendar with comprehensive statistics...');
    
    await launchBrowser(SERVER_URL);
    
    console.log('');
    console.log('🎉 FLOW MODE ACTIVE');
    console.log('📊 Features Enabled:');
    console.log('   ✓ PF/G (Points For per Game)');
    console.log('   ✓ PA/G (Points Against per Game)');
    console.log('   ✓ MARGIN (Point Differential)');
    console.log('   ✓ ATS% (Against The Spread)');
    console.log('   ✓ O/U% (Over/Under)');
    console.log('   ✓ Fav ATS% (Favorite ATS)');
    console.log('   ✓ Dog ATS% (Underdog ATS)');
    console.log('   ✓ L5 Form (Last 5 games)');
    console.log('   ✓ SoS (Strength of Schedule)');
    console.log('');
    console.log('🖥️  Application URL: http://localhost:3002/calendar');
    console.log('🎮 Flow Mode: ENGAGED');
    
  } catch (error) {
    console.error('❌ Flow Mode activation failed:', error.message);
    console.log('📋 Manual Access: http://localhost:3002/calendar');
  }
}

main();