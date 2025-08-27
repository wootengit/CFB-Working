'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Team {
  name: string;
  slug: string;
  conference: string;
  dataQuality: string;
  lastUpdated: string;
}

interface TeamsByConference {
  [conference: string]: Team[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamsByConference>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();
        
        // Group teams by conference
        const teamsByConference: TeamsByConference = {};
        data.teams.forEach((team: Team) => {
          if (!teamsByConference[team.conference]) {
            teamsByConference[team.conference] = [];
          }
          teamsByConference[team.conference].push(team);
        });
        
        setTeams(teamsByConference);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadTeams();
  }, []);

  const conferences = Object.keys(teams).sort();
  const filteredConferences = filter === 'all' ? conferences : [filter];
  
  const priorityOrder = ['SEC', 'Big Ten', 'Big 12', 'ACC', 'American Athletic', 'Mountain West', 'MAC', 'Sun Belt', 'Conference USA', 'FBS Independents'];
  const sortedConferences = filteredConferences.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a);
    const bIndex = priorityOrder.indexOf(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00ff88] mx-auto mb-4"></div>
          <div className="text-[#00ff88] text-xl font-mono">Loading teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#00ff88] bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#00ff88] font-mono tracking-wider mb-4">
            NCAA Football Teams
          </h1>
          <p className="text-gray-400 font-mono">
            Complete betting analysis for 133+ Division I FBS teams
          </p>
          
          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-900 border border-[#00ff88] rounded px-4 py-2 font-mono text-sm"
            >
              <option value="all">All Conferences</option>
              {conferences.map(conf => (
                <option key={conf} value={conf}>{conf}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded px-4 py-2 font-mono text-sm flex-1 max-w-sm"
            />
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sortedConferences.map(conference => {
          const conferenceTeams = teams[conference]?.filter(team =>
            search === '' || team.name.toLowerCase().includes(search.toLowerCase())
          ) || [];
          
          if (conferenceTeams.length === 0) return null;
          
          return (
            <div key={conference} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#00ff88] font-mono">
                  {conference}
                </h2>
                <span className="text-gray-400 font-mono text-sm">
                  {conferenceTeams.length} teams
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {conferenceTeams.map(team => (
                  <Link
                    key={team.slug}
                    href={`/team/${team.slug}`}
                    className="block bg-gray-900 border border-gray-700 hover:border-[#00ff88] rounded-lg p-6 transition-all hover:transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 border border-[#00ff88] rounded bg-gray-800 p-1 flex items-center justify-center">
                        <Image
                          src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${team.name.toLowerCase().replace(/ /g, '').replace(/[^a-z]/g, '')}.png`}
                          alt={`${team.name} logo`}
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/default-team-logo.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">
                          {team.name}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">
                          {conference}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#00ff88] font-mono">
                        {team.dataQuality} Data
                      </span>
                      <span className="text-gray-500 font-mono">
                        Updated {new Date(team.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}