'use client';

import { useState, useEffect } from 'react';

interface TeamData {
  teamId: number;
  team: string;
  conference: string;
  spPlusRating: number;
  spPlusRanking: number;
  logo: string;
  color: string;
  wins: number;
  losses: number;
}

interface OddsData {
  team1Spread: string;
  team2Spread: string;
  team1ML: string;
  team2ML: string;
  total: string;
  halfSpread1: string;
  halfSpread2: string;
  halfTotal: string;
}

export default function LiveSportsbookPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // Generate odds from team data
  const generateOdds = (team1: TeamData, team2: TeamData): OddsData => {
    const rating1 = team1.spPlusRating || 0;
    const rating2 = team2.spPlusRating || 0;
    
    const ratingDiff = rating1 - rating2;
    const spread = Math.max(-35, Math.min(35, ratingDiff / 2.5));
    
    let team1Spread, team2Spread, team1ML, team2ML;
    
    if (spread > 0) {
      team1Spread = -Math.abs(spread).toFixed(1);
      team2Spread = `+${Math.abs(spread).toFixed(1)}`;
      team1ML = Math.round(-110 - (Math.abs(spread) * 8));
      team2ML = Math.round(110 + (Math.abs(spread) * 8));
    } else {
      team1Spread = `+${Math.abs(spread).toFixed(1)}`;
      team2Spread = -Math.abs(spread).toFixed(1);
      team1ML = Math.round(110 + (Math.abs(spread) * 8));
      team2ML = Math.round(-110 - (Math.abs(spread) * 8));
    }
    
    const total = 45 + (Math.random() * 20);
    const halfSpread = spread / 2;
    const halfTotal = total / 2;
    
    return {
      team1Spread,
      team2Spread,
      team1ML: team1ML > 0 ? `+${team1ML}` : `${team1ML}`,
      team2ML: team2ML > 0 ? `+${team2ML}` : `${team2ML}`,
      total: total.toFixed(1),
      halfSpread1: halfSpread > 0 ? -Math.abs(halfSpread).toFixed(1) : `+${Math.abs(halfSpread).toFixed(1)}`,
      halfSpread2: halfSpread > 0 ? `+${Math.abs(halfSpread).toFixed(1)}` : -Math.abs(halfSpread).toFixed(1),
      halfTotal: halfTotal.toFixed(1)
    };
  };

  // Format team name for display
  const formatTeamName = (name: string) => {
    return name.toUpperCase()
      .replace('STATE', 'ST')
      .replace('UNIVERSITY', 'U')
      .replace('SOUTHERN', 'S')
      .replace('NORTHERN', 'N')
      .replace('EASTERN', 'E')
      .replace('WESTERN', 'W')
      .substring(0, 12);
  };

  // Generate game time
  const generateGameTime = (index: number) => {
    const baseTimes = ['12:00P', '12:30P', '1:00P', '1:30P', '2:00P', '2:30P', '3:00P', '3:30P', '4:00P', '4:30P', '5:00P', '5:30P', '6:00P', '6:30P', '7:00P', '7:30P', '8:00P', '8:30P', '9:00P', '9:30P', '10:00P', '10:30P', '11:00P', '11:30P'];
    return baseTimes[index % baseTimes.length] || '12:00P';
  };

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching NCAA football data...');
        const response = await fetch('/api/standings/enhanced?year=2025');
        const data = await response.json();
        
        if (data.success && data.data) {
          console.log(`Loaded ${data.data.length} teams`);
          setTeams(data.data.slice(0, 60)); // Top 60 teams for display
          setLoading(false);
        } else {
          throw new Error('Failed to load team data');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 font-mono flex items-center justify-center">
        <div className="text-xl">LOADING NCAA FOOTBALL ODDS...</div>
      </div>
    );
  }

  // Create matchups
  const matchups = [];
  for (let i = 0; i < teams.length - 1; i += 2) {
    if (teams[i + 1]) {
      matchups.push([teams[i], teams[i + 1]]);
    }
  }

  // Split into 3 columns
  const gamesPerColumn = Math.ceil(matchups.length / 3);
  const columns = [
    matchups.slice(0, gamesPerColumn),
    matchups.slice(gamesPerColumn, gamesPerColumn * 2),
    matchups.slice(gamesPerColumn * 2)
  ];

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-mono">
      {/* Top Header */}
      <div className="bg-black text-yellow-400 flex justify-between items-center px-5 py-2 text-sm font-bold border-b border-gray-700">
        <div className="text-red-500 text-lg">LIVE NCAA FOOTBALL ODDS</div>
        <div className="text-yellow-400">{currentTime}</div>
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-3 gap-1 bg-black p-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="bg-black p-2">
            <div className="bg-black text-yellow-400 text-center p-2 text-xs font-bold border-b border-gray-700 mb-1">
              NCAA FOOTBALL - COLUMN {colIndex + 1}
            </div>
            
            {column.map((matchup, gameIndex) => {
              const gameNum = (colIndex * gamesPerColumn) + gameIndex + 101;
              const gameTime = generateGameTime(gameNum - 101);
              const odds = generateOdds(matchup[0], matchup[1]);
              
              return (
                <div key={gameIndex} className="bg-black mb-1 text-xs leading-4 px-1 py-0.5">
                  <div className="text-yellow-400 text-[10px]">{gameNum} {gameTime}</div>
                  
                  {/* Team 1 */}
                  <div className="grid grid-cols-6 gap-1 my-0.5">
                    <div className="text-yellow-400 text-xs text-left">
                      {formatTeamName(matchup[0].team)}
                    </div>
                    <div className={`text-center text-xs ${odds.team1Spread.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                      {odds.team1Spread}
                    </div>
                    <div className="text-yellow-400 text-center text-xs">
                      {odds.total}
                    </div>
                    <div className={`text-center text-xs ${odds.team1ML.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                      {odds.team1ML}
                    </div>
                    <div className={`text-center text-[10px] ${odds.halfSpread1.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                      {odds.halfSpread1}
                    </div>
                    <div className="text-yellow-400 text-center text-xs">
                      {odds.halfTotal}
                    </div>
                  </div>
                  
                  {/* Team 2 */}
                  <div className="grid grid-cols-6 gap-1 my-0.5">
                    <div className="text-yellow-400 text-xs text-left">
                      {formatTeamName(matchup[1].team)}
                    </div>
                    <div className={`text-center text-xs ${odds.team2Spread.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                      {odds.team2Spread}
                    </div>
                    <div className="text-yellow-400 text-center text-xs">
                      U{odds.total}
                    </div>
                    <div className={`text-center text-xs ${odds.team2ML.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                      {odds.team2ML}
                    </div>
                    <div className={`text-center text-[10px] ${odds.halfSpread2.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                      {odds.halfSpread2}
                    </div>
                    <div className="text-yellow-400 text-center text-xs">
                      U{odds.halfTotal}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Ticker */}
      <div className="bg-black text-yellow-400 flex items-center px-3 py-2 text-xs border-t border-gray-700 overflow-hidden">
        <div className="flex whitespace-nowrap animate-pulse">
          <span className="text-yellow-400">LIVE:</span>
          <span className="text-green-500 mx-5">
            {teams.slice(0, 10).map((team, index) => 
              index % 2 === 0 && teams[index + 1] ? 
              `${formatTeamName(team.team)} ${Math.floor(Math.random() * 35) + 7}  ${formatTeamName(teams[index + 1].team)} ${Math.floor(Math.random() * 35) + 7}` 
              : ''
            ).filter(Boolean).join('   •   ')}
          </span>
        </div>
      </div>
    </div>
  );
}