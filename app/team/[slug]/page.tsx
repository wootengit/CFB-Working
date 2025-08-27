'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import TeamPageContent from './TeamPageContent';

interface TeamPageProps {
  params: {
    slug: string;
  };
}

export default function TeamPage({ params }: TeamPageProps) {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTeamData() {
      try {
        setLoading(true);
        
        // Load team data from our generated data files
        const response = await fetch(`/api/teams/${params.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(`Failed to load team data: ${response.status}`);
        }
        
        const data = await response.json();
        setTeamData(data);
      } catch (err) {
        console.error('Error loading team data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      loadTeamData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00ff88] mx-auto mb-4"></div>
          <div className="text-[#00ff88] text-xl font-mono">Loading team data...</div>
          <div className="text-gray-400 text-sm font-mono mt-2">Fetching betting analytics</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl font-mono mb-4">⚠️ Data Load Error</div>
          <div className="text-gray-400 text-lg font-mono">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[#00ff88] text-black font-mono rounded hover:bg-[#00cc6a] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!teamData) {
    notFound();
  }

  return <TeamPageContent teamData={teamData} />;
}

// Generate static params for all teams (for build optimization)
export async function generateStaticParams() {
  try {
    // Read team index to get all available slugs
    const indexPath = path.join(process.cwd(), 'data', 'teams', 'team-data-index.json');
    
    if (!fs.existsSync(indexPath)) {
      console.warn('Team data index not found, generating empty params');
      return [];
    }
    
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    
    return indexData.teams.map((team) => ({
      slug: team.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Metadata generation for SEO and betting tool optimization
export async function generateMetadata({ params }: TeamPageProps) {
  try {
    const teamSlug = params.slug;
    const dataPath = path.join(process.cwd(), 'data', 'teams', `${teamSlug}.json`);
    
    if (!fs.existsSync(dataPath)) {
      return {
        title: 'Team Not Found - CFB Betting Tool',
        description: 'The requested team page was not found.'
      };
    }
    
    const teamData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const team = teamData.teamInfo;
    
    return {
      title: `${team.school} ${team.mascot} - NCAA Football Betting Tool`,
      description: `Complete betting analysis for ${team.school} ${team.mascot}. SP+ ratings, advanced stats, recent games, and live betting odds for NCAA Football.`,
      keywords: [
        team.school,
        team.mascot,
        team.conference,
        'NCAA Football',
        'College Football Betting',
        'SP+ Ratings',
        'Betting Lines',
        'Football Analytics',
        'Sports Betting'
      ].join(', '),
      openGraph: {
        title: `${team.school} ${team.mascot} - Betting Analytics`,
        description: `Professional betting analysis and live odds for ${team.school} football`,
        images: [team.logoUrl],
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${team.school} ${team.mascot} - CFB Betting`,
        description: `SP+ ratings, betting lines, and advanced analytics for ${team.school} football`,
        images: [team.logoUrl]
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'CFB Betting Tool',
      description: 'College Football Betting Analysis and Live Odds'
    };
  }
}