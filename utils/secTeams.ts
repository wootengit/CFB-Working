// SEC Team Configuration with Enhanced Logo Support
// Optimized for MIT Research Predictive Fields Display

export interface SECTeamConfig {
  name: string;
  shortName: string;
  conference: 'SEC';
  division: 'East' | 'West' | 'Unified'; // 2025 unified structure
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  fallbackLogo: string;
  espnId: number;
  cfbdId: number;
  mascot: string;
  location: string;
  established: number;
  stadiumCapacity: number;
}

export const SEC_TEAM_CONFIGS: Record<string, SECTeamConfig> = {
  'Alabama': {
    name: 'Alabama',
    shortName: 'ALA',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#9E1B32',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Alabama-Crimson-Tide-Logo.png',
    espnId: 333,
    cfbdId: 333,
    mascot: 'Crimson Tide',
    location: 'Tuscaloosa, AL',
    established: 1831,
    stadiumCapacity: 101821
  },

  'Georgia': {
    name: 'Georgia',
    shortName: 'UGA',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#BA0C2F',
    secondaryColor: '#000000',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Georgia-Bulldogs-Logo.png',
    espnId: 61,
    cfbdId: 257,
    mascot: 'Bulldogs',
    location: 'Athens, GA',
    established: 1785,
    stadiumCapacity: 92746
  },

  'Tennessee': {
    name: 'Tennessee',
    shortName: 'TENN',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#FF8200',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Tennessee-Volunteers-Logo.png',
    espnId: 2633,
    cfbdId: 2633,
    mascot: 'Volunteers',
    location: 'Knoxville, TN',
    established: 1794,
    stadiumCapacity: 102455
  },

  'LSU': {
    name: 'LSU',
    shortName: 'LSU',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#461D7C',
    secondaryColor: '#FDD023',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/LSU-Tigers-Logo.png',
    espnId: 99,
    cfbdId: 365,
    mascot: 'Tigers',
    location: 'Baton Rouge, LA',
    established: 1860,
    stadiumCapacity: 102321
  },

  'Auburn': {
    name: 'Auburn',
    shortName: 'AUB',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#0C2340',
    secondaryColor: '#F26522',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Auburn-Tigers-Logo.png',
    espnId: 2,
    cfbdId: 8,
    mascot: 'Tigers',
    location: 'Auburn, AL',
    established: 1856,
    stadiumCapacity: 87451
  },

  'Florida': {
    name: 'Florida',
    shortName: 'FLA',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#0021A5',
    secondaryColor: '#FA4616',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Florida-Gators-Logo.png',
    espnId: 57,
    cfbdId: 235,
    mascot: 'Gators',
    location: 'Gainesville, FL',
    established: 1853,
    stadiumCapacity: 88548
  },

  'Kentucky': {
    name: 'Kentucky',
    shortName: 'UK',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#0033A0',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Kentucky-Wildcats-Logo.png',
    espnId: 96,
    cfbdId: 96,
    mascot: 'Wildcats',
    location: 'Lexington, KY',
    established: 1865,
    stadiumCapacity: 61000
  },

  'Mississippi State': {
    name: 'Mississippi State',
    shortName: 'MSST',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#5D1725',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/344.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Mississippi-State-Bulldogs-Logo.png',
    espnId: 344,
    cfbdId: 344,
    mascot: 'Bulldogs',
    location: 'Starkville, MS',
    established: 1878,
    stadiumCapacity: 60311
  },

  'Missouri': {
    name: 'Missouri',
    shortName: 'MIZZ',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#F1B82D',
    secondaryColor: '#000000',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Missouri-Tigers-Logo.png',
    espnId: 142,
    cfbdId: 142,
    mascot: 'Tigers',
    location: 'Columbia, MO',
    established: 1839,
    stadiumCapacity: 71168
  },

  'Ole Miss': {
    name: 'Ole Miss',
    shortName: 'MISS',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#CE1126',
    secondaryColor: '#13294B',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Ole-Miss-Rebels-Logo.png',
    espnId: 145,
    cfbdId: 145,
    mascot: 'Rebels',
    location: 'Oxford, MS',
    established: 1848,
    stadiumCapacity: 64038
  },

  'South Carolina': {
    name: 'South Carolina',
    shortName: 'SC',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#73000A',
    secondaryColor: '#000000',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/South-Carolina-Gamecocks-Logo.png',
    espnId: 2579,
    cfbdId: 2579,
    mascot: 'Gamecocks',
    location: 'Columbia, SC',
    established: 1801,
    stadiumCapacity: 80250
  },

  'Texas A&M': {
    name: 'Texas A&M',
    shortName: 'TAMU',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#500000',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Texas-AM-Aggies-Logo.png',
    espnId: 245,
    cfbdId: 245,
    mascot: 'Aggies',
    location: 'College Station, TX',
    established: 1876,
    stadiumCapacity: 102733
  },

  'Arkansas': {
    name: 'Arkansas',
    shortName: 'ARK',
    conference: 'SEC',
    division: 'West',
    primaryColor: '#9D2235',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Arkansas-Razorbacks-Logo.png',
    espnId: 8,
    cfbdId: 8,
    mascot: 'Razorbacks',
    location: 'Fayetteville, AR',
    established: 1871,
    stadiumCapacity: 76212
  },

  'Vanderbilt': {
    name: 'Vanderbilt',
    shortName: 'VANDY',
    conference: 'SEC',
    division: 'East',
    primaryColor: '#866D4B',
    secondaryColor: '#000000',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png',
    fallbackLogo: 'https://logos-world.net/wp-content/uploads/2022/12/Vanderbilt-Commodores-Logo.png',
    espnId: 238,
    cfbdId: 238,
    mascot: 'Commodores',
    location: 'Nashville, TN',
    established: 1873,
    stadiumCapacity: 40350
  }
};

// Helper functions for SEC teams
export function getSECTeamConfig(teamName: string): SECTeamConfig | null {
  return SEC_TEAM_CONFIGS[teamName] || null;
}

export function isSECTeam(teamName: string): boolean {
  return teamName in SEC_TEAM_CONFIGS;
}

export function getSECTeamLogo(teamName: string): string {
  const config = getSECTeamConfig(teamName);
  return config?.logoUrl || 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png';
}

export function getSECTeamColors(teamName: string): { primary: string; secondary: string } {
  const config = getSECTeamConfig(teamName);
  return {
    primary: config?.primaryColor || '#000000',
    secondary: config?.secondaryColor || '#FFFFFF'
  };
}

export function getAllSECTeams(): SECTeamConfig[] {
  return Object.values(SEC_TEAM_CONFIGS);
}

export function getSECEastTeams(): SECTeamConfig[] {
  return Object.values(SEC_TEAM_CONFIGS).filter(team => team.division === 'East');
}

export function getSECWestTeams(): SECTeamConfig[] {
  return Object.values(SEC_TEAM_CONFIGS).filter(team => team.division === 'West');
}

// Team ranking helpers based on historical performance
export function getSECTierRanking(teamName: string): 'Elite' | 'Strong' | 'Competitive' | 'Rebuilding' {
  const eliteTeams = ['Alabama', 'Georgia'];
  const strongTeams = ['LSU', 'Auburn', 'Tennessee', 'Florida'];
  const competitiveTeams = ['Texas A&M', 'Ole Miss', 'Arkansas', 'Kentucky', 'South Carolina', 'Missouri'];
  const rebuildingTeams = ['Mississippi State', 'Vanderbilt'];
  
  if (eliteTeams.includes(teamName)) return 'Elite';
  if (strongTeams.includes(teamName)) return 'Strong';
  if (competitiveTeams.includes(teamName)) return 'Competitive';
  return 'Rebuilding';
}

export const SEC_TEAMS_LIST = Object.keys(SEC_TEAM_CONFIGS);

export default SEC_TEAM_CONFIGS;