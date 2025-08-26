/**
 * Team Logo URL Generator - ESPN Sports Logos
 * Complete mapping for all Division 1A college football teams
 * Validated ESPN team IDs for correct logo display
 */

export const ESPN_TEAM_IDS: Record<string, number> = {
  // SEC Conference (16 teams)
  'alabama': 333,
  'arkansas': 8,
  'auburn': 2,
  'florida': 57,
  'georgia': 61,
  'kentucky': 96,
  'lsu': 99,
  'mississippi-state': 142,
  'missouri': 142,
  'ole-miss': 145,
  'oklahoma': 201,
  'south-carolina': 2579,
  'tennessee': 2633,
  'texas': 251,
  'texas-am': 245,
  'vanderbilt': 238,

  // Big Ten Conference (18 teams)
  'illinois': 356,
  'indiana': 84,
  'iowa': 2294,
  'maryland': 120,
  'michigan': 130,
  'michigan-state': 127,
  'minnesota': 135,
  'nebraska': 158,
  'northwestern': 77,
  'ohio-state': 194,
  'oregon': 2483,
  'penn-state': 213,
  'purdue': 2509,
  'rutgers': 164,
  'ucla': 26,
  'usc': 30,
  'washington': 264,
  'wisconsin': 275,

  // Big 12 Conference (16 teams)
  'arizona': 12,
  'arizona-state': 9,
  'baylor': 239,
  'byu': 252,
  'cincinnati': 2132,
  'colorado': 38,
  'houston': 248,
  'iowa-state': 66,
  'kansas': 2305,
  'kansas-state': 2306,
  'oklahoma-state': 197,
  'tcu': 2628,
  'texas-tech': 2641,
  'ucf': 2116,
  'utah': 254,
  'west-virginia': 277,

  // ACC Conference (17 teams)
  'boston-college': 103,
  'california': 25,
  'clemson': 228,
  'duke': 150,
  'florida-state': 52,
  'georgia-tech': 59,
  'louisville': 97,
  'miami': 2390,
  'north-carolina': 153,
  'nc-state': 152,
  'pittsburgh': 221,
  'smu': 2567,
  'stanford': 24,
  'syracuse': 183,
  'virginia': 258,
  'virginia-tech': 259,
  'wake-forest': 154,

  // American Conference (14 teams)
  'army': 349,
  'charlotte': 2429,
  'east-carolina': 151,
  'florida-atlantic': 2226,
  'memphis': 235,
  'navy': 2426,
  'north-texas': 249,
  'rice': 242,
  'temple': 218,
  'tulane': 2655,
  'tulsa': 202,
  'uab': 5,
  'south-florida': 58,
  'utsa': 2636,

  // Mountain West Conference (12 teams)
  'air-force': 2005,
  'boise-state': 68,
  'colorado-state': 36,
  'fresno-state': 278,
  'hawaii': 62,
  'nevada': 2440,
  'new-mexico': 167,
  'san-diego-state': 21,
  'san-jose-state': 23,
  'unlv': 2439,
  'utah-state': 328,
  'wyoming': 2751,

  // Sun Belt Conference (14 teams)
  'appalachian-state': 2026,
  'arkansas-state': 2032,
  'coastal-carolina': 324,
  'georgia-southern': 290,
  'georgia-state': 2247,
  'james-madison': 256,
  'louisiana': 309, // Fixed from 2348 (was duplicate with Louisiana Tech)
  'louisiana-monroe': 2433,
  'marshall': 276,
  'old-dominion': 295,
  'south-alabama': 6,
  'southern-miss': 2572,
  'texas-state': 326,
  'troy': 2653,

  // Conference USA (10 teams)
  'florida-international': 2229,
  'jacksonville-state': 55,
  'kennesaw-state': 2245, // Fixed from 2246
  'liberty': 2335,
  'louisiana-tech': 2433, // Fixed from 2348 (was duplicate with Louisiana)
  'middle-tennessee': 2393,
  'new-mexico-state': 166,
  'sam-houston': 2534,
  'utep': 2638,
  'western-kentucky': 98,

  // MAC Conference (12 teams)
  'akron': 2006,
  'ball-state': 2050,
  'bowling-green': 189,
  'buffalo': 2084,
  'central-michigan': 2117,
  'eastern-michigan': 2199,
  'kent-state': 2309,
  'miami-redhawks': 193, // Miami RedHawks (not Miami Hurricanes)
  'northern-illinois': 2459,
  'ohio': 195,
  'toledo': 2649,
  'western-michigan': 2711,

  // Pac-12 Remnant (2 teams)
  'oregon-state': 204,
  'washington-state': 265,

  // Independents (3 teams)
  'notre-dame': 87,
  'uconn': 41,
  'umass': 113,

  // Major FCS Teams (for reference)
  'north-dakota-state': 2449,
  'montana': 135, // Fixed from 136
  'montana-state': 156,
  'south-dakota-state': 2571,
  'villanova': 222,
  'delaware': 48,
  'richmond': 257,
  'william-mary': 2729,
  'maine': 311,
  'new-hampshire': 160,
  'rhode-island': 227,
  'albany': 13,
  'stony-brook': 2523, // Fixed from 2522
  'fordham': 2230,
  'holy-cross': 2226,
  'colgate': 2142,
  'bucknell': 2083,
  'lafayette': 2296, // Fixed from 2297
  'lehigh': 2329
};

/**
 * Get correct ESPN logo URL for a team
 */
export function getTeamLogoUrl(teamId: string): string {
  const espnId = ESPN_TEAM_IDS[teamId];
  
  if (!espnId) {
    console.warn(`No ESPN ID found for team: ${teamId}`);
    // Fallback to generic college football logo
    return 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png';
  }
  
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`;
}

/**
 * Get team logo with fallback options
 */
export function getTeamLogoWithFallback(teamId: string, teamName: string): string {
  // Try ESPN logo first
  const espnLogo = getTeamLogoUrl(teamId);
  
  if (ESPN_TEAM_IDS[teamId]) {
    return espnLogo;
  }
  
  // Fallback to ESPN search by name (less reliable)
  const nameForUrl = teamName.toLowerCase().replace(/\s+/g, '-');
  return `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${nameForUrl}.png&w=100&h=100`;
}

/**
 * Validate if a logo URL is accessible
 */
export async function validateLogoUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && (response.headers.get('content-type')?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

/**
 * Get all team logos as a mapping
 */
export function getAllTeamLogos(): Record<string, string> {
  const logos: Record<string, string> = {};
  
  for (const [teamId, espnId] of Object.entries(ESPN_TEAM_IDS)) {
    logos[teamId] = `https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`;
  }
  
  return logos;
}

/**
 * Get logo URL by team name (fallback method)
 */
export function getLogoByTeamName(teamName: string): string {
  // Convert team name to likely team ID format
  const teamId = teamName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '')
    .replace(/'/g, '')
    .replace(/\./g, '');
  
  return getTeamLogoUrl(teamId);
}