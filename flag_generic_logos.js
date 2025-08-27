// Script to flag teams using generic logos
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/team-stats?year=2024',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.success) {
        console.log('🚩 TEAMS USING GENERIC LOGOS:');
        console.log('='.repeat(50));
        
        const genericLogoTeams = response.data.filter(team => 
          team.logo === 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png'
        );
        
        genericLogoTeams.forEach(team => {
          console.log(`❌ ${team.team}`);
          console.log(`   Team ID: ${team.teamId}`);
          console.log(`   Conference: ${team.conference}`);
          console.log(`   Division: ${team.division || 'Not specified'}`);
          console.log(`   Logo: ${team.logo}`);
          console.log('');
        });
        
        console.log(`\n📊 SUMMARY:`);
        console.log(`Total teams: ${response.data.length}`);
        console.log(`Teams with generic logos: ${genericLogoTeams.length}`);
        console.log(`Teams with valid logos: ${response.data.length - genericLogoTeams.length}`);
        
        // Also check for other potential mismatches
        console.log('\n🔍 CHECKING FOR OTHER LOGO ISSUES:');
        const suspiciousLogos = response.data.filter(team => {
          const teamName = team.team.toLowerCase();
          const logoUrl = team.logo.toLowerCase();
          
          // Check if logo URL contains generic indicators
          return logoUrl.includes('/1.png') || 
                 logoUrl.includes('/default') ||
                 logoUrl.includes('/generic') ||
                 (!logoUrl.includes(teamName.split(' ')[0]) && team.teamId > 0);
        });
        
        if (suspiciousLogos.length > 0) {
          console.log(`\n⚠️  POTENTIALLY MISMATCHED LOGOS:`);
          suspiciousLogos.forEach(team => {
            console.log(`   ${team.team} -> ${team.logo}`);
          });
        }
        
      } else {
        console.error('❌ API Error:', response.error);
      }
    } catch (error) {
      console.error('❌ Parse Error:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error);
});

req.end();