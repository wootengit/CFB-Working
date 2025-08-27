// 🐌 SLOW MODE LAUNCHER - FIXED VERSION
// Uses Windows-specific approach to open browser

const { exec } = require('child_process');
const fs = require('fs');

console.log('🐌 ACTIVATING SLOW MODE - LIVE NCAA SPORTSBOOK');

// Create a temporary HTML file that redirects to the server page
const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0;url=http://localhost:3000/sportsbook/live">
    <title>Opening NCAA Sportsbook...</title>
    <style>
        body { 
            background: black; 
            color: yellow; 
            font-family: monospace; 
            text-align: center; 
            padding: 50px; 
        }
    </style>
</head>
<body>
    <h1>🐌 SLOW MODE ACTIVATED</h1>
    <h2>Redirecting to Live NCAA Sportsbook...</h2>
    <p>If redirect fails, go to: http://localhost:3000/sportsbook/live</p>
    <script>
        setTimeout(() => {
            window.location.href = 'http://localhost:3000/sportsbook/live';
        }, 1000);
    </script>
</body>
</html>`;

fs.writeFileSync('C:/CFB-WORKING/slow-mode-redirect.html', redirectHtml);

// Open in default browser using Windows start command
exec('start "NCAA Sportsbook" "C:/CFB-WORKING/slow-mode-redirect.html"', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Failed to open browser:', error);
        console.log('💡 Manually navigate to: http://localhost:3000/sportsbook/live');
    } else {
        console.log('✅ SLOW MODE BROWSER OPENED');
        console.log('📺 NCAA Sportsbook should now be on your screen');
        console.log('🔄 Live data with auto-refresh every 5 minutes');
    }
});

console.log('🎯 SLOW MODE URL: http://localhost:3000/sportsbook/live');