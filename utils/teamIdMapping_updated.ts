// ESPN Team ID Mapping for College Football Teams (FBS and FCS)
// Updated with previously missing team IDs to fix generic logo issue
export const TEAM_ID_MAPPING: Record<string, number> = {
  
  // FBS TEAMS
  
  // SEC (16 teams)
  'Alabama': 333,
  'Arkansas': 8,
  'Auburn': 2,
  'Florida': 57,
  'Georgia': 61,
  'Kentucky': 96,
  'LSU': 99,
  'Mississippi State': 344,
  'Missouri': 142,
  'Oklahoma': 201,
  'Ole Miss': 145,
  'South Carolina': 2579,
  'Tennessee': 2633,
  'Texas': 251,
  'Texas A&M': 245,
  'Vanderbilt': 238,

  // Big Ten (18 teams)
  'Illinois': 356,
  'Indiana': 84,
  'Iowa': 2294,
  'Maryland': 120,
  'Michigan': 130,
  'Michigan State': 127,
  'Minnesota': 135,
  'Nebraska': 158,
  'Northwestern': 77,
  'Ohio State': 194,
  'Oregon': 2483,
  'Penn State': 213,
  'Purdue': 2509,
  'Rutgers': 164,
  'UCLA': 26,
  'USC': 30,
  'Washington': 264,
  'Wisconsin': 275,

  // Big 12 (16 teams)
  'Arizona': 12,
  'Arizona State': 9,
  'Baylor': 239,
  'BYU': 252,
  'Cincinnati': 2132,
  'Colorado': 38,
  'Houston': 248,
  'Iowa State': 66,
  'Kansas': 2305,
  'Kansas State': 2306,
  'Oklahoma State': 197,
  'TCU': 2628,
  'Texas Tech': 2641,
  'UCF': 2116,
  'Utah': 254,
  'West Virginia': 277,

  // ACC (17 teams)  
  'Boston College': 103,
  'California': 25,
  'Clemson': 228,
  'Duke': 150,
  'Florida State': 52,
  'Georgia Tech': 59,
  'Louisville': 97,
  'Miami': 2390,
  'NC State': 152,
  'North Carolina': 153,
  'Notre Dame': 87,
  'Pittsburgh': 221,
  'SMU': 2567,
  'Stanford': 24,
  'Syracuse': 183,
  'Virginia': 258,
  'Virginia Tech': 259,
  'Wake Forest': 154,

  // American Athletic (14 teams)
  'Army': 349,
  'Charlotte': 2429,
  'East Carolina': 151,
  'Florida Atlantic': 2226, // Fixed from generic logo
  'Memphis': 235,
  'Navy': 2426,
  'North Texas': 249,
  'Rice': 242,
  'South Florida': 58,
  'Temple': 218,
  'Tulane': 2655,
  'Tulsa': 202,
  'UAB': 5,
  'UTSA': 2636,

  // Conference USA (10 teams)
  'Florida International': 2229, // Fixed from generic logo
  'Jacksonville State': 55,
  'Kennesaw State': 338,
  'Liberty': 2335,
  'Louisiana Tech': 2348,
  'Middle Tennessee': 2393,
  'New Mexico State': 166,
  'Sam Houston State': 2534,
  'UTEP': 2638,
  'Western Kentucky': 98,

  // Mid-American (12 teams)
  'Akron': 2006,
  'Ball State': 2050,
  'Bowling Green': 189,
  'Buffalo': 2084,
  'Central Michigan': 2117,
  'Eastern Michigan': 2199,
  'Kent State': 2309,
  'Miami (OH)': 193,
  'Northern Illinois': 2459,
  'Ohio': 195,
  'Toledo': 2649,
  'Western Michigan': 2711,

  // Mountain West (12 teams)
  'Air Force': 2005,
  'Boise State': 68,
  'Colorado State': 36,
  'Fresno State': 278,
  'Hawai\'i': 62, // Fixed from generic logo
  'Nevada': 2440,
  'New Mexico': 167,
  'San Diego State': 21,
  'San José State': 23, // Fixed from generic logo
  'UNLV': 2439,
  'Utah State': 328,
  'Wyoming': 2751,

  // Sun Belt (14 teams)
  'App State': 2026, // Fixed from generic logo
  'Arkansas State': 2032,
  'Coastal Carolina': 324,
  'Georgia Southern': 290,
  'Georgia State': 2247,
  'James Madison': 256,
  'Louisiana': 309,
  'UL Monroe': 2433, // Fixed from generic logo
  'Marshall': 276,
  'Old Dominion': 295,
  'South Alabama': 6,
  'Southern Miss': 2572,
  'Texas State': 326,
  'Troy': 2653,

  // Pac-12 (2 teams remaining)
  'Oregon State': 204,
  'Washington State': 265,

  // FBS Independents (3 teams)
  'UConn': 41,
  'Massachusetts': 113,
  'UMass': 113,

  // FCS TEAMS
  
  // PREVIOUSLY MISSING - NEWLY ADDED TO FIX LOGO ISSUES:
  'Florida Atlantic': 2226, // American Athletic
  'Florida International': 2229, // Conference USA
  'San José State': 23, // Mountain West
  'Hawai'i': 62, // Mountain West
  'Murray State': 93, // MVFC
  'Stonehill': 284, // NEC
  'Mercyhurst': 2385, // NEC
  'Robert Morris': 2523, // NEC
  'Duquesne': 2184, // NEC
  'Long Island University': 2341, // NEC
  'Wagner': 2681, // NEC
  'St. Francis (PA)': 2598, // NEC
  'Central Connecticut': 2115, // NEC
  'New Haven': 2441, // Northeast 10
  'Valparaiso': 2674, // Pioneer
  'San Diego': 301, // Pioneer
  'Dayton': 2168, // Pioneer
  'Presbyterian': 2506, // Pioneer
  'Davidson': 2166, // Pioneer
  'Stetson': 56, // Pioneer
  'Marist': 2368, // Pioneer
  'Butler': 2086, // Pioneer
  'St. Thomas (MN)': 2900, // Pioneer
  'Drake': 2181, // Pioneer
  'Morehead State': 2413, // Pioneer
  'Northwestern State': 2466, // Southland
  'Houston Christian': 2277, // Southland
  'Incarnate Word': 2916, // Southland
  'McNeese': 2377, // Southland
  'East Texas A&M': 2837, // Southland
  'Stephen F. Austin': 2617, // Southland
  'Nicholls': 2447, // Southland
  'SE Louisiana': 2545, // Southland
  'Lamar': 2320, // Southland
  'UT Rio Grande Valley': 292, // Southland
  'App State': 2026, // Sun Belt
  'UL Monroe': 2433, // Sun Belt
  'Grambling': 2755, // SWAC
  'Eastern Kentucky': 2198, // UAC
  'Utah Tech': 3101, // UAC
  'West Georgia': 2698, // UAC
  'Austin Peay': 2046, // UAC
  'North Alabama': 2453, // UAC
  'Tarleton State': 2627, // UAC
  'Abilene Christian': 2000, // UAC
  'Central Arkansas': 2110, // UAC
  'Southern Utah': 253, // UAC

  // Missouri Valley Football Conference (11 teams)
  'Illinois State': 2287,
  'Indiana State': 282,
  'Missouri State': 2623,
  'Murray State': 93, // Fixed from generic logo
  'North Dakota': 2447,
  'North Dakota State': 2449,
  'Northern Iowa': 2460,
  'South Dakota': 2569,
  'South Dakota State': 2571,
  'Southern Illinois': 2576,
  'Western Illinois': 2710,
  'Youngstown State': 2750,

  // Big Sky Conference (12 teams)
  'Cal Poly': 13,
  'Eastern Washington': 331,
  'Idaho': 70,
  'Idaho State': 304,
  'Montana': 2151,
  'Montana State': 2153,
  'Northern Arizona': 2464,
  'Northern Colorado': 2458,
  'Portland State': 2502,
  'Sacramento State': 16,
  'UC Davis': 302,
  'Weber State': 2725,

  // Coastal Athletic Association (16 teams)
  'Albany': 399,
  'Bryant': 2803,
  'Campbell': 2097,
  'Delaware': 48,
  'Elon': 2210,
  'Hampton': 2215,
  'Maine': 311,
  'Monmouth': 2405,
  'New Hampshire': 2315,
  'North Carolina A&T': 2428,
  'Rhode Island': 227,
  'Richmond': 257,
  'Stony Brook': 2619,
  'Towson': 119,
  'Villanova': 222,
  'William & Mary': 2729,

  // Southern Conference (9 teams)
  'Chattanooga': 236,
  'East Tennessee State': 2198,
  'Furman': 231,
  'Mercer': 2382,
  'Samford': 2524,
  'The Citadel': 2643,
  'VMI': 261,
  'Western Carolina': 2717,
  'Wofford': 2747,

  // Ivy League (8 teams)
  'Brown': 225,
  'Columbia': 156,
  'Cornell': 159,
  'Dartmouth': 163,
  'Harvard': 108,
  'Pennsylvania': 219,
  'Princeton': 163,
  'Yale': 43,

  // Patriot League (7 teams)
  'Bucknell': 2083,
  'Colgate': 2142,
  'Fordham': 2230,
  'Georgetown': 46,
  'Holy Cross': 107,
  'Lafayette': 2333,
  'Lehigh': 2333,

  // Southwestern Athletic Conference (12 teams)
  'Alabama A&M': 2006,
  'Alabama State': 2009,
  'Alcorn State': 2016,
  'Arkansas-Pine Bluff': 2032,
  'Bethune-Cookman': 2065,
  'Florida A&M': 50,
  'Grambling': 2755, // Fixed from generic logo
  'Jackson State': 2296,
  'Mississippi Valley State': 344,
  'Prairie View A&M': 2504,
  'Southern': 2582,
  'Texas Southern': 2640,
}

// Get ESPN team ID by team name
export function getTeamId(teamName: string): number {
  return TEAM_ID_MAPPING[teamName] || 0
}

// Alternative logo URLs for fallback
export const LOGO_FALLBACK_URLS = [
  (teamId: number) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamId}.png`,
  (teamId: number) => `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${teamId}.png&w=200&h=200`,
  (teamName: string) => `https://logos.fansided.com/logos/ncaa/${teamName.toLowerCase().replace(/\s/g, '')}.png`,
  (teamName: string) => `https://www.sports-reference.com/req/202010011/images/logos/schools/${teamName.toLowerCase().replace(/\s/g, '')}.png`
]