fetch('http://localhost:3011/api/games/2025?division=fbs')
  .then(res => res.json())
  .then(data => {
    console.log('API Response:', {
      success: data.success,
      gamesCount: data.data?.length || 0,
      firstGame: data.data?.[0] ? `${data.data[0].awayTeam} @ ${data.data[0].homeTeam}` : 'No games'
    });
    if (data.data?.length > 0) {
      console.log('Games found:', data.data.map(g => `${g.awayTeam} @ ${g.homeTeam}`));
    }
  })
  .catch(err => console.error('Error:', err));