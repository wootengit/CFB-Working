// Quick test to see what CFBD returns
async function test() {
  const API_KEY = 'cT9zCzXWeUB9UyRSlVmnQ4RWOaRoLkgIZhb831ueEkv+Wz8gvNSPa+OKonDW7Cqa';
  
  console.log('Fetching 2023 season stats...\n');
  
  const response = await fetch(
    'https://api.collegefootballdata.com/stats/season?year=2023&team=Alabama',
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );
  
  const data = await response.json();
  
  console.log('Alabama 2023 stats:');
  data.forEach(stat => {
    if (stat.statName.includes('yards') || 
        stat.statName.includes('Yards') ||
        stat.statName.includes('rush') ||
        stat.statName.includes('Rush') ||
        stat.statName.includes('pass') ||
        stat.statName.includes('Pass') ||
        stat.statName.includes('point') ||
        stat.statName.includes('Point') ||
        stat.statName.includes('third') ||
        stat.statName.includes('possession')) {
      console.log(`${stat.statName}: ${stat.statValue} (perGame: ${stat.perGameStat || 'N/A'})`);
    }
  });
}

test();