'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamContentProps {
  teamData: {
    teamInfo: {
      id: number;
      school: string;
      mascot: string;
      abbreviation: string;
      conference: string;
      division: string;
      primaryColor: string;
      logoUrl: string;
    };
    currentRecord: {
      wins: number;
      losses: number;
      winPct: number;
    };
    currentRanking: {
      ap?: number;
      coaches?: number;
      playoff?: number;
    };
    spPlusRating: {
      overall: number;
      offense: number;
      defense: number;
      rank: number;
    };
    advancedStats: {
      ppa: {
        offense: number;
        defense: number;
        total: number;
      };
      explosiveness: number;
      efficiency: {
        offense: number;
        defense: number;
      };
    };
    recentGames: Array<{
      opponent: string;
      result: 'W' | 'L';
      score: string;
      spread: number;
      total: number;
      date: string;
    }>;
    upcomingGames: Array<{
      opponent: string;
      date: string;
      spread?: number;
      total?: number;
      homeGame: boolean;
    }>;
    bettingMetrics: {
      atsRecord: string;
      overUnderRecord: string;
      averageSpread: number;
      averageTotal: number;
    };
    lastUpdated: string;
  };
}

export default function TeamPageContent({ teamData }: TeamContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { teamInfo, currentRecord, spPlusRating, advancedStats, recentGames, upcomingGames, bettingMetrics } = teamData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'schedule', label: 'Schedule', icon: '🗓️' },
    { id: 'betting', label: 'Betting', icon: '💰' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Team Header - Sportsbook LED Style */}
      <div className="border-b border-[#00ff88] bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-[#00ff88] rounded-lg overflow-hidden bg-gray-900 p-2">
                <Image
                  src={teamInfo.logoUrl}
                  alt={`${teamInfo.school} logo`}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full filter drop-shadow-lg"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#00ff88] text-black text-xs font-bold px-1 rounded">
                {teamInfo.abbreviation}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold text-[#00ff88] font-mono tracking-wider">
                  {teamInfo.school}
                </h1>
                <span className="text-2xl text-gray-300 font-mono">{teamInfo.mascot}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-gray-800 border border-[#00ff88] rounded font-mono">
                  {teamInfo.conference}
                </span>
                <span className="text-gray-400 font-mono">
                  Record: {currentRecord.wins}-{currentRecord.losses} ({(currentRecord.winPct * 100).toFixed(1)}%)
                </span>
                {teamData.currentRanking.ap && (
                  <span className="text-[#00ff88] font-mono">
                    AP #{teamData.currentRanking.ap}
                  </span>
                )}
              </div>
            </div>

            {/* Key Metrics - Casino Display Style */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-900 border border-[#00ff88] rounded p-3">
                <div className="text-[#00ff88] text-2xl font-mono font-bold">
                  {spPlusRating.rank}
                </div>
                <div className="text-gray-400 text-xs font-mono">SP+ RANK</div>
              </div>
              <div className="bg-gray-900 border border-[#00ff88] rounded p-3">
                <div className="text-[#00ff88] text-2xl font-mono font-bold">
                  {spPlusRating.overall.toFixed(1)}
                </div>
                <div className="text-gray-400 text-xs font-mono">SP+ RATING</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 font-mono text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Season Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-mono text-[#00ff88] mb-4">🏈 Season Performance</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{currentRecord.wins}</div>
                    <div className="text-sm text-gray-400">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{currentRecord.losses}</div>
                    <div className="text-sm text-gray-400">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{(currentRecord.winPct * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00ff88]">#{spPlusRating.rank}</div>
                    <div className="text-sm text-gray-400">SP+ Rank</div>
                  </div>
                </div>
              </div>

              {/* Recent Games */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-mono text-[#00ff88] mb-4">📊 Recent Games</h2>
                <div className="space-y-3">
                  {recentGames.slice(0, 5).map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded text-sm font-bold ${
                          game.result === 'W' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {game.result}
                        </span>
                        <span className="font-mono">vs {game.opponent}</span>
                        <span className="text-[#00ff88]">{game.score}</span>
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        {game.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Key Metrics */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-mono text-[#00ff88] mb-4">⚡ SP+ Ratings</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Overall</span>
                    <span className="font-bold text-[#00ff88]">{spPlusRating.overall.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Offense</span>
                    <span className="font-bold">{spPlusRating.offense.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense</span>
                    <span className="font-bold">{spPlusRating.defense.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">National Rank</span>
                    <span className="font-bold text-[#00ff88]">#{spPlusRating.rank}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-mono text-[#00ff88] mb-4">💰 Betting Metrics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ATS Record</span>
                    <span className="font-bold">{bettingMetrics.atsRecord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">O/U Record</span>
                    <span className="font-bold">{bettingMetrics.overUnderRecord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Spread</span>
                    <span className="font-bold">{bettingMetrics.averageSpread.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Total</span>
                    <span className="font-bold">{bettingMetrics.averageTotal.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-mono text-[#00ff88] mb-4">🎯 Advanced Analytics</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Offensive PPA</span>
                  <span className="font-bold">{advancedStats.ppa.offense.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Defensive PPA</span>
                  <span className="font-bold">{advancedStats.ppa.defense.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total PPA</span>
                  <span className="font-bold text-[#00ff88]">{advancedStats.ppa.total.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Explosiveness</span>
                  <span className="font-bold">{advancedStats.explosiveness.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-mono text-[#00ff88] mb-4">⚡ Efficiency Metrics</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Offensive Efficiency</span>
                  <span className="font-bold">{advancedStats.efficiency.offense.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Defensive Efficiency</span>
                  <span className="font-bold">{advancedStats.efficiency.defense.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-mono text-[#00ff88] mb-4">📅 Upcoming Games</h2>
              <div className="space-y-3">
                {upcomingGames.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center space-x-4">
                      <span className="font-mono">vs {game.opponent}</span>
                      <span className="text-sm text-gray-400">{game.homeGame ? 'Home' : 'Away'}</span>
                      {game.spread && (
                        <span className="text-[#00ff88] text-sm">{game.spread > 0 ? '+' : ''}{game.spread.toFixed(1)}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      {game.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-mono text-[#00ff88] mb-4">🏈 Recent Results</h2>
              <div className="space-y-3">
                {recentGames.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-sm font-bold ${
                        game.result === 'W' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {game.result}
                      </span>
                      <span className="font-mono">vs {game.opponent}</span>
                      <span className="text-[#00ff88]">{game.score}</span>
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      {game.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'betting' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-mono text-[#00ff88] mb-4">💰 Betting Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Against The Spread</span>
                  <span className="font-bold text-lg">{bettingMetrics.atsRecord}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Over/Under Record</span>
                  <span className="font-bold text-lg">{bettingMetrics.overUnderRecord}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Spread</span>
                  <span className="font-bold text-lg">{bettingMetrics.averageSpread.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Total</span>
                  <span className="font-bold text-lg">{bettingMetrics.averageTotal.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-mono text-[#00ff88] mb-4">📊 Betting Trends</h2>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-gray-800 rounded">
                  <div className="font-bold mb-2">Recent ATS Performance:</div>
                  <div className="grid grid-cols-5 gap-1">
                    {recentGames.slice(0, 5).map((game, index) => {
                      const covered = game.result === 'W' ? (game.spread < 0) : (game.spread > 0);
                      return (
                        <div key={index} className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                          covered ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {covered ? 'W' : 'L'}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="text-gray-400">
                  <div>💡 This team averages {bettingMetrics.averageTotal.toFixed(0)} total points per game</div>
                  <div>📈 Current betting value: {bettingMetrics.averageSpread > 0 ? 'Underdog' : 'Favorite'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-gray-800 bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="font-mono">
            Last updated: {new Date(teamData.lastUpdated).toLocaleDateString()} | 
            Data source: {teamData.lastUpdated.includes('2025') ? 'MOCK_DATA' : 'CFBD_API'}
          </p>
          <p className="mt-2">
            <Link href="/teams" className="text-[#00ff88] hover:text-white transition-colors">
              ← Back to All Teams
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}