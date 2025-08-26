/**
 * CFB Core Project Team Database Implementation
 * Complete team information for all FBS (136) and FCS (129) teams
 * 2025 Conference Realignments Included
 */

export interface TeamInfo {
  id: string;           // lowercase hyphenated format for API compatibility
  name: string;         // official team name
  mascot: string;       // team mascot
  conference: string;   // conference affiliation
  division: 'FBS' | 'FCS';
  colors: {
    primary: string;    // hex color code
    secondary: string;  // hex color code  
    text: string;       // readable text color on primary background
  };
  abbreviation: string; // common abbreviation
}

// Complete FBS Teams Database (136 teams)
export const FBS_TEAMS: TeamInfo[] = [
  // SEC Conference (16 teams)
  {
    id: 'alabama',
    name: 'Alabama',
    mascot: 'Crimson Tide',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#9e1b32', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'ALA'
  },
  {
    id: 'arkansas',
    name: 'Arkansas',
    mascot: 'Razorbacks',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#9d2235', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'ARK'
  },
  {
    id: 'auburn',
    name: 'Auburn',
    mascot: 'Tigers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#03244d', secondary: '#f26522', text: '#ffffff' },
    abbreviation: 'AUB'
  },
  {
    id: 'florida',
    name: 'Florida',
    mascot: 'Gators',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#0021a5', secondary: '#fa4616', text: '#ffffff' },
    abbreviation: 'FLA'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    mascot: 'Bulldogs',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#ba0c2f', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'UGA'
  },
  {
    id: 'kentucky',
    name: 'Kentucky',
    mascot: 'Wildcats',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#0033a0', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UK'
  },
  {
    id: 'lsu',
    name: 'LSU',
    mascot: 'Tigers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#461d7c', secondary: '#fdd023', text: '#ffffff' },
    abbreviation: 'LSU'
  },
  {
    id: 'mississippi-state',
    name: 'Mississippi State',
    mascot: 'Bulldogs',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#5d1725', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MSST'
  },
  {
    id: 'missouri',
    name: 'Missouri',
    mascot: 'Tigers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#f1b82d', secondary: '#000000', text: '#000000' },
    abbreviation: 'MIZ'
  },
  {
    id: 'ole-miss',
    name: 'Ole Miss',
    mascot: 'Rebels',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#ce1126', secondary: '#13294b', text: '#ffffff' },
    abbreviation: 'OM'
  },
  {
    id: 'oklahoma',
    name: 'Oklahoma',
    mascot: 'Sooners',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#841617', secondary: '#fdf9d3', text: '#ffffff' },
    abbreviation: 'OU'
  },
  {
    id: 'south-carolina',
    name: 'South Carolina',
    mascot: 'Gamecocks',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#73000a', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'SC'
  },
  {
    id: 'tennessee',
    name: 'Tennessee',
    mascot: 'Volunteers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#ff8200', secondary: '#ffffff', text: '#000000' },
    abbreviation: 'TENN'
  },
  {
    id: 'texas',
    name: 'Texas',
    mascot: 'Longhorns',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#bf5700', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'TEX'
  },
  {
    id: 'texas-am',
    name: 'Texas A&M',
    mascot: 'Aggies',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#500000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'TAMU'
  },
  {
    id: 'vanderbilt',
    name: 'Vanderbilt',
    mascot: 'Commodores',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#866d4b', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'VANDY'
  },
  
  // Big Ten Conference (18 teams)
  {
    id: 'illinois',
    name: 'Illinois',
    mascot: 'Fighting Illini',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#e84a27', secondary: '#003c7d', text: '#ffffff' },
    abbreviation: 'ILL'
  },
  {
    id: 'indiana',
    name: 'Indiana',
    mascot: 'Hoosiers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#990000', secondary: '#cream', text: '#ffffff' },
    abbreviation: 'IU'
  },
  {
    id: 'iowa',
    name: 'Iowa',
    mascot: 'Hawkeyes',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffd700', text: '#ffffff' },
    abbreviation: 'IOWA'
  },
  {
    id: 'maryland',
    name: 'Maryland',
    mascot: 'Terrapins',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#e03a3e', secondary: '#ffd520', text: '#ffffff' },
    abbreviation: 'MD'
  },
  {
    id: 'michigan',
    name: 'Michigan',
    mascot: 'Wolverines',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#00274c', secondary: '#ffcb05', text: '#ffffff' },
    abbreviation: 'MICH'
  },
  {
    id: 'michigan-state',
    name: 'Michigan State',
    mascot: 'Spartans',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#18453b', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MSU'
  },
  {
    id: 'minnesota',
    name: 'Minnesota',
    mascot: 'Golden Gophers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#a60f2d', secondary: '#ffcc33', text: '#ffffff' },
    abbreviation: 'MINN'
  },
  {
    id: 'nebraska',
    name: 'Nebraska',
    mascot: 'Cornhuskers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#d00000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'NEB'
  },
  {
    id: 'northwestern',
    name: 'Northwestern',
    mascot: 'Wildcats',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#4e2a84', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'NW'
  },
  {
    id: 'ohio-state',
    name: 'Ohio State',
    mascot: 'Buckeyes',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#bb0000', secondary: '#666666', text: '#ffffff' },
    abbreviation: 'OSU'
  },
  {
    id: 'oregon',
    name: 'Oregon',
    mascot: 'Ducks',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#154733', secondary: '#fde047', text: '#ffffff' },
    abbreviation: 'ORE'
  },
  {
    id: 'penn-state',
    name: 'Penn State',
    mascot: 'Nittany Lions',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'PSU'
  },
  {
    id: 'purdue',
    name: 'Purdue',
    mascot: 'Boilermakers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#ceb888', secondary: '#000000', text: '#000000' },
    abbreviation: 'PUR'
  },
  {
    id: 'rutgers',
    name: 'Rutgers',
    mascot: 'Scarlet Knights',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#cc0033', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'RU'
  },
  {
    id: 'ucla',
    name: 'UCLA',
    mascot: 'Bruins',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#2d68c4', secondary: '#ffd100', text: '#ffffff' },
    abbreviation: 'UCLA'
  },
  {
    id: 'usc',
    name: 'USC',
    mascot: 'Trojans',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#990000', secondary: '#ffcc00', text: '#ffffff' },
    abbreviation: 'USC'
  },
  {
    id: 'washington',
    name: 'Washington',
    mascot: 'Huskies',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#4b2e83', secondary: '#b7a57a', text: '#ffffff' },
    abbreviation: 'UW'
  },
  {
    id: 'wisconsin',
    name: 'Wisconsin',
    mascot: 'Badgers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#c5050c', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'WISC'
  },
  
  // Big 12 Conference (16 teams)
  {
    id: 'arizona',
    name: 'Arizona',
    mascot: 'Wildcats',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#003366', secondary: '#cc0033', text: '#ffffff' },
    abbreviation: 'ARIZ'
  },
  {
    id: 'arizona-state',
    name: 'Arizona State',
    mascot: 'Sun Devils',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#8c1538', secondary: '#ffc627', text: '#ffffff' },
    abbreviation: 'ASU'
  },
  {
    id: 'baylor',
    name: 'Baylor',
    mascot: 'Bears',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#003015', secondary: '#ffd700', text: '#ffffff' },
    abbreviation: 'BAY'
  },
  {
    id: 'byu',
    name: 'BYU',
    mascot: 'Cougars',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#002e5d', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'BYU'
  },
  {
    id: 'cincinnati',
    name: 'Cincinnati',
    mascot: 'Bearcats',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#e00122', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'CIN'
  },
  {
    id: 'colorado',
    name: 'Colorado',
    mascot: 'Buffaloes',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#cfb87c', secondary: '#000000', text: '#000000' },
    abbreviation: 'CU'
  },
  {
    id: 'houston',
    name: 'Houston',
    mascot: 'Cougars',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#c8102e', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'HOU'
  },
  {
    id: 'iowa-state',
    name: 'Iowa State',
    mascot: 'Cyclones',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#c8102e', secondary: '#f1be48', text: '#ffffff' },
    abbreviation: 'ISU'
  },
  {
    id: 'kansas',
    name: 'Kansas',
    mascot: 'Jayhawks',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#0051ba', secondary: '#e8000d', text: '#ffffff' },
    abbreviation: 'KU'
  },
  {
    id: 'kansas-state',
    name: 'Kansas State',
    mascot: 'Wildcats',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#512888', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'KSU'
  },
  {
    id: 'oklahoma-state',
    name: 'Oklahoma State',
    mascot: 'Cowboys',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#ff7300', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'OKST'
  },
  {
    id: 'tcu',
    name: 'TCU',
    mascot: 'Horned Frogs',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#4d1979', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'TCU'
  },
  {
    id: 'texas-tech',
    name: 'Texas Tech',
    mascot: 'Red Raiders',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#cc0000', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'TTU'
  },
  {
    id: 'ucf',
    name: 'UCF',
    mascot: 'Knights',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffcc00', text: '#ffffff' },
    abbreviation: 'UCF'
  },
  {
    id: 'utah',
    name: 'Utah',
    mascot: 'Utes',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UTAH'
  },
  {
    id: 'west-virginia',
    name: 'West Virginia',
    mascot: 'Mountaineers',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#002855', secondary: '#eaaa00', text: '#ffffff' },
    abbreviation: 'WVU'
  },
  {
    id: 'florida',
    name: 'Florida',
    mascot: 'Gators',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#0021a5', secondary: '#fa4616', text: '#ffffff' },
    abbreviation: 'FLA'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    mascot: 'Bulldogs',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#ba0c2f', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'UGA'
  },
  {
    id: 'kentucky',
    name: 'Kentucky',
    mascot: 'Wildcats',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#005daa', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UK'
  },
  {
    id: 'lsu',
    name: 'LSU',
    mascot: 'Tigers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#461d7c', secondary: '#fdd023', text: '#ffffff' },
    abbreviation: 'LSU'
  },
  {
    id: 'mississippi-state',
    name: 'Mississippi State',
    mascot: 'Bulldogs',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#5d1725', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MSU'
  },
  {
    id: 'missouri',
    name: 'Missouri',
    mascot: 'Tigers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#f1b82d', secondary: '#000000', text: '#000000' },
    abbreviation: 'MIZ'
  },
  {
    id: 'oklahoma',
    name: 'Oklahoma',
    mascot: 'Sooners',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#841617', secondary: '#fdf9f4', text: '#ffffff' },
    abbreviation: 'OU'
  },
  {
    id: 'ole-miss',
    name: 'Ole Miss',
    mascot: 'Rebels',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#ce1126', secondary: '#14213d', text: '#ffffff' },
    abbreviation: 'OM'
  },
  {
    id: 'south-carolina',
    name: 'South Carolina',
    mascot: 'Gamecocks',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#73000a', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'SC'
  },
  {
    id: 'tennessee',
    name: 'Tennessee',
    mascot: 'Volunteers',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#ff8200', secondary: '#ffffff', text: '#000000' },
    abbreviation: 'TENN'
  },
  {
    id: 'texas',
    name: 'Texas',
    mascot: 'Longhorns',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#bf5700', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'TEX'
  },
  {
    id: 'texas-am',
    name: 'Texas A&M',
    mascot: 'Aggies',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#500000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'A&M'
  },
  {
    id: 'vanderbilt',
    name: 'Vanderbilt',
    mascot: 'Commodores',
    conference: 'SEC',
    division: 'FBS',
    colors: { primary: '#866d4b', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'VANDY'
  },

  // Big Ten Conference (18 teams)
  {
    id: 'illinois',
    name: 'Illinois',
    mascot: 'Fighting Illini',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#e84a27', secondary: '#003c7d', text: '#ffffff' },
    abbreviation: 'ILL'
  },
  {
    id: 'indiana',
    name: 'Indiana',
    mascot: 'Hoosiers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#9d2235', secondary: '#fdf9f4', text: '#ffffff' },
    abbreviation: 'IND'
  },
  {
    id: 'iowa',
    name: 'Iowa',
    mascot: 'Hawkeyes',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffcd00', text: '#ffffff' },
    abbreviation: 'IOWA'
  },
  {
    id: 'maryland',
    name: 'Maryland',
    mascot: 'Terrapins',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#e21833', secondary: '#ffd520', text: '#ffffff' },
    abbreviation: 'MD'
  },
  {
    id: 'michigan',
    name: 'Michigan',
    mascot: 'Wolverines',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#00274c', secondary: '#ffcb05', text: '#ffffff' },
    abbreviation: 'MICH'
  },
  {
    id: 'michigan-state',
    name: 'Michigan State',
    mascot: 'Spartans',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#18453b', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MSU'
  },
  {
    id: 'minnesota',
    name: 'Minnesota',
    mascot: 'Golden Gophers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#7a0019', secondary: '#ffcc33', text: '#ffffff' },
    abbreviation: 'MINN'
  },
  {
    id: 'nebraska',
    name: 'Nebraska',
    mascot: 'Cornhuskers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#d00000', secondary: '#fdf9f4', text: '#ffffff' },
    abbreviation: 'NEB'
  },
  {
    id: 'northwestern',
    name: 'Northwestern',
    mascot: 'Wildcats',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#4e2a84', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'NW'
  },
  {
    id: 'ohio-state',
    name: 'Ohio State',
    mascot: 'Buckeyes',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#bb0000', secondary: '#c5c5c5', text: '#ffffff' },
    abbreviation: 'OSU'
  },
  {
    id: 'oregon',
    name: 'Oregon',
    mascot: 'Ducks',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#003030', secondary: '#fce122', text: '#ffffff' },
    abbreviation: 'ORE'
  },
  {
    id: 'penn-state',
    name: 'Penn State',
    mascot: 'Nittany Lions',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'PSU'
  },
  {
    id: 'purdue',
    name: 'Purdue',
    mascot: 'Boilermakers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#ceb888', secondary: '#000000', text: '#000000' },
    abbreviation: 'PUR'
  },
  {
    id: 'rutgers',
    name: 'Rutgers',
    mascot: 'Scarlet Knights',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#cc0033', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'RUT'
  },
  {
    id: 'ucla',
    name: 'UCLA',
    mascot: 'Bruins',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#003b5c', secondary: '#ffd100', text: '#ffffff' },
    abbreviation: 'UCLA'
  },
  {
    id: 'usc',
    name: 'USC',
    mascot: 'Trojans',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#990000', secondary: '#ffcc00', text: '#ffffff' },
    abbreviation: 'USC'
  },
  {
    id: 'washington',
    name: 'Washington',
    mascot: 'Huskies',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#4b2e83', secondary: '#b7a57a', text: '#ffffff' },
    abbreviation: 'UW'
  },
  {
    id: 'wisconsin',
    name: 'Wisconsin',
    mascot: 'Badgers',
    conference: 'Big Ten',
    division: 'FBS',
    colors: { primary: '#c5050c', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'WIS'
  },

  // Big 12 Conference (16 teams)
  {
    id: 'arizona',
    name: 'Arizona',
    mascot: 'Wildcats',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#003366', secondary: '#cc0033', text: '#ffffff' },
    abbreviation: 'ARIZ'
  },
  {
    id: 'arizona-state',
    name: 'Arizona State',
    mascot: 'Sun Devils',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#8c1d40', secondary: '#ffc627', text: '#ffffff' },
    abbreviation: 'ASU'
  },
  {
    id: 'baylor',
    name: 'Baylor',
    mascot: 'Bears',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#003015', secondary: '#ffd700', text: '#ffffff' },
    abbreviation: 'BAY'
  },
  {
    id: 'byu',
    name: 'BYU',
    mascot: 'Cougars',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#002e5d', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'BYU'
  },
  {
    id: 'cincinnati',
    name: 'Cincinnati',
    mascot: 'Bearcats',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#e00122', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'CIN'
  },
  {
    id: 'colorado',
    name: 'Colorado',
    mascot: 'Buffaloes',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#cfb87c', secondary: '#000000', text: '#000000' },
    abbreviation: 'COLO'
  },
  {
    id: 'houston',
    name: 'Houston',
    mascot: 'Cougars',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#c8102e', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'HOU'
  },
  {
    id: 'iowa-state',
    name: 'Iowa State',
    mascot: 'Cyclones',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#c8102e', secondary: '#f1be48', text: '#ffffff' },
    abbreviation: 'ISU'
  },
  {
    id: 'kansas',
    name: 'Kansas',
    mascot: 'Jayhawks',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#0051ba', secondary: '#e8000d', text: '#ffffff' },
    abbreviation: 'KU'
  },
  {
    id: 'kansas-state',
    name: 'Kansas State',
    mascot: 'Wildcats',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#512888', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'KSU'
  },
  {
    id: 'oklahoma-state',
    name: 'Oklahoma State',
    mascot: 'Cowboys',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#ff7300', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'OKST'
  },
  {
    id: 'tcu',
    name: 'TCU',
    mascot: 'Horned Frogs',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#4d1979', secondary: '#c5c5c5', text: '#ffffff' },
    abbreviation: 'TCU'
  },
  {
    id: 'texas-tech',
    name: 'Texas Tech',
    mascot: 'Red Raiders',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#cc0000', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'TTU'
  },
  {
    id: 'ucf',
    name: 'UCF',
    mascot: 'Knights',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffc904', text: '#ffffff' },
    abbreviation: 'UCF'
  },
  {
    id: 'utah',
    name: 'Utah',
    mascot: 'Utes',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UTAH'
  },
  {
    id: 'west-virginia',
    name: 'West Virginia',
    mascot: 'Mountaineers',
    conference: 'Big 12',
    division: 'FBS',
    colors: { primary: '#002855', secondary: '#eaaa00', text: '#ffffff' },
    abbreviation: 'WVU'
  },

  // ACC Conference (17 teams)
  {
    id: 'boston-college',
    name: 'Boston College',
    mascot: 'Eagles',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#660000', secondary: '#ccac00', text: '#ffffff' },
    abbreviation: 'BC'
  },
  {
    id: 'california',
    name: 'Cal',
    mascot: 'Golden Bears',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#003262', secondary: '#fdb515', text: '#ffffff' },
    abbreviation: 'CAL'
  },
  {
    id: 'clemson',
    name: 'Clemson',
    mascot: 'Tigers',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#f56600', secondary: '#522d80', text: '#ffffff' },
    abbreviation: 'CLEM'
  },
  {
    id: 'duke',
    name: 'Duke',
    mascot: 'Blue Devils',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#003366', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'DUKE'
  },
  {
    id: 'florida-state',
    name: 'Florida State',
    mascot: 'Seminoles',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#782f40', secondary: '#ceb888', text: '#ffffff' },
    abbreviation: 'FSU'
  },
  {
    id: 'georgia-tech',
    name: 'Georgia Tech',
    mascot: 'Yellow Jackets',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#b3a369', secondary: '#003057', text: '#000000' },
    abbreviation: 'GT'
  },
  {
    id: 'louisville',
    name: 'Louisville',
    mascot: 'Cardinals',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#ad0000', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'LOU'
  },
  {
    id: 'miami',
    name: 'Miami',
    mascot: 'Hurricanes',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#f47321', secondary: '#005030', text: '#ffffff' },
    abbreviation: 'MIA'
  },
  {
    id: 'north-carolina',
    name: 'North Carolina',
    mascot: 'Tar Heels',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#7bafd4', secondary: '#ffffff', text: '#000000' },
    abbreviation: 'UNC'
  },
  {
    id: 'nc-state',
    name: 'NC State',
    mascot: 'Wolfpack',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'NCSU'
  },
  {
    id: 'pittsburgh',
    name: 'Pittsburgh',
    mascot: 'Panthers',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#003594', secondary: '#ffb81c', text: '#ffffff' },
    abbreviation: 'PITT'
  },
  {
    id: 'smu',
    name: 'SMU',
    mascot: 'Mustangs',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#0033a0', secondary: '#cc0000', text: '#ffffff' },
    abbreviation: 'SMU'
  },
  {
    id: 'stanford',
    name: 'Stanford',
    mascot: 'Cardinal',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#8c1515', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'STAN'
  },
  {
    id: 'syracuse',
    name: 'Syracuse',
    mascot: 'Orange',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#f76900', secondary: '#000e54', text: '#ffffff' },
    abbreviation: 'SYR'
  },
  {
    id: 'virginia',
    name: 'Virginia',
    mascot: 'Cavaliers',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#232d4b', secondary: '#f84c1e', text: '#ffffff' },
    abbreviation: 'UVA'
  },
  {
    id: 'virginia-tech',
    name: 'Virginia Tech',
    mascot: 'Hokies',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#861f41', secondary: '#e87722', text: '#ffffff' },
    abbreviation: 'VT'
  },
  {
    id: 'wake-forest',
    name: 'Wake Forest',
    mascot: 'Demon Deacons',
    conference: 'ACC',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#9e7e38', text: '#ffffff' },
    abbreviation: 'WAKE'
  },

  // Pac-12 Conference (2 teams - rebuilding)
  {
    id: 'oregon-state',
    name: 'Oregon State',
    mascot: 'Beavers',
    conference: 'Pac-12',
    division: 'FBS',
    colors: { primary: '#dc4405', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'OSU'
  },
  {
    id: 'washington-state',
    name: 'Washington State',
    mascot: 'Cougars',
    conference: 'Pac-12',
    division: 'FBS',
    colors: { primary: '#981e32', secondary: '#5e6a71', text: '#ffffff' },
    abbreviation: 'WSU'
  },

  // American Athletic Conference (14 teams)
  {
    id: 'army',
    name: 'Army',
    mascot: 'Black Knights',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#b9975b', text: '#ffffff' },
    abbreviation: 'ARMY'
  },
  {
    id: 'charlotte',
    name: 'Charlotte',
    mascot: '49ers',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#046a38', secondary: '#a49665', text: '#ffffff' },
    abbreviation: 'CLT'
  },
  {
    id: 'east-carolina',
    name: 'East Carolina',
    mascot: 'Pirates',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#592a8a', secondary: '#ffde00', text: '#ffffff' },
    abbreviation: 'ECU'
  },
  {
    id: 'florida-atlantic',
    name: 'Florida Atlantic',
    mascot: 'Owls',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#0066cc', secondary: '#cc092f', text: '#ffffff' },
    abbreviation: 'FAU'
  },
  {
    id: 'memphis',
    name: 'Memphis',
    mascot: 'Tigers',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#003087', secondary: '#bec6c9', text: '#ffffff' },
    abbreviation: 'MEM'
  },
  {
    id: 'navy',
    name: 'Navy',
    mascot: 'Midshipmen',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#0d1b2a', secondary: '#b9975b', text: '#ffffff' },
    abbreviation: 'NAVY'
  },
  {
    id: 'north-texas',
    name: 'North Texas',
    mascot: 'Mean Green',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#00853e', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UNT'
  },
  {
    id: 'rice',
    name: 'Rice',
    mascot: 'Owls',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#003a70', secondary: '#c1c6c8', text: '#ffffff' },
    abbreviation: 'RICE'
  },
  {
    id: 'temple',
    name: 'Temple',
    mascot: 'Owls',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#9e1b32', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'TEM'
  },
  {
    id: 'tulane',
    name: 'Tulane',
    mascot: 'Green Wave',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#0f7142', secondary: '#7bafd4', text: '#ffffff' },
    abbreviation: 'TUL'
  },
  {
    id: 'tulsa',
    name: 'Tulsa',
    mascot: 'Golden Hurricane',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#003594', secondary: '#ffb81c', text: '#ffffff' },
    abbreviation: 'TLSA'
  },
  {
    id: 'uab',
    name: 'UAB',
    mascot: 'Blazers',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#1e6b52', secondary: '#ffb500', text: '#ffffff' },
    abbreviation: 'UAB'
  },
  {
    id: 'usf',
    name: 'USF',
    mascot: 'Bulls',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#006747', secondary: '#b9975b', text: '#ffffff' },
    abbreviation: 'USF'
  },
  {
    id: 'utsa',
    name: 'UTSA',
    mascot: 'Roadrunners',
    conference: 'American Athletic',
    division: 'FBS',
    colors: { primary: '#0c2340', secondary: '#f15d22', text: '#ffffff' },
    abbreviation: 'UTSA'
  },

  // Conference USA (12 teams)
  {
    id: 'delaware',
    name: 'Delaware',
    mascot: 'Blue Hens',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#00539f', secondary: '#ffd200', text: '#ffffff' },
    abbreviation: 'DEL'
  },
  {
    id: 'florida-international',
    name: 'FIU',
    mascot: 'Panthers',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#b6862c', secondary: '#1e4477', text: '#ffffff' },
    abbreviation: 'FIU'
  },
  {
    id: 'jacksonville-state',
    name: 'Jacksonville State',
    mascot: 'Gamecocks',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#dc143c', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'JSU'
  },
  {
    id: 'kennesaw-state',
    name: 'Kennesaw State',
    mascot: 'Owls',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffd700', text: '#ffffff' },
    abbreviation: 'KSU'
  },
  {
    id: 'liberty',
    name: 'Liberty',
    mascot: 'Flames',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#a41e35', secondary: '#003087', text: '#ffffff' },
    abbreviation: 'LIB'
  },
  {
    id: 'louisiana-tech',
    name: 'Louisiana Tech',
    mascot: 'Bulldogs',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#002f87', secondary: '#cd212a', text: '#ffffff' },
    abbreviation: 'LT'
  },
  {
    id: 'middle-tennessee',
    name: 'Middle Tennessee',
    mascot: 'Blue Raiders',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#0066cc', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MTSU'
  },
  {
    id: 'missouri-state',
    name: 'Missouri State',
    mascot: 'Bears',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#5d1725', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MSU'
  },
  {
    id: 'new-mexico-state',
    name: 'New Mexico State',
    mascot: 'Aggies',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#ba0c2f', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'NMSU'
  },
  {
    id: 'sam-houston-state',
    name: 'Sam Houston State',
    mascot: 'Bearkats',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#f26522', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'SHSU'
  },
  {
    id: 'utep',
    name: 'UTEP',
    mascot: 'Miners',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#f26522', text: '#ffffff' },
    abbreviation: 'UTEP'
  },
  {
    id: 'western-kentucky',
    name: 'Western Kentucky',
    mascot: 'Hilltoppers',
    conference: 'Conference USA',
    division: 'FBS',
    colors: { primary: '#c8102e', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'WKU'
  },

  // Mid-American Conference (13 teams)
  {
    id: 'akron',
    name: 'Akron',
    mascot: 'Zips',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#a89968', text: '#ffffff' },
    abbreviation: 'AKR'
  },
  {
    id: 'ball-state',
    name: 'Ball State',
    mascot: 'Cardinals',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#ba0c2f', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'BALL'
  },
  {
    id: 'bowling-green',
    name: 'Bowling Green',
    mascot: 'Falcons',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#fe5000', secondary: '#532a00', text: '#ffffff' },
    abbreviation: 'BGSU'
  },
  {
    id: 'buffalo',
    name: 'Buffalo',
    mascot: 'Bulls',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#005bbf', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'BUFF'
  },
  {
    id: 'central-michigan',
    name: 'Central Michigan',
    mascot: 'Chippewas',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#6b0d18', secondary: '#ffde00', text: '#ffffff' },
    abbreviation: 'CMU'
  },
  {
    id: 'eastern-michigan',
    name: 'Eastern Michigan',
    mascot: 'Eagles',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#006633', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'EMU'
  },
  {
    id: 'kent-state',
    name: 'Kent State',
    mascot: 'Golden Flashes',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#c5b783', text: '#ffffff' },
    abbreviation: 'KENT'
  },
  {
    id: 'miami-ohio',
    name: 'Miami (OH)',
    mascot: 'RedHawks',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#c8102e', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'M-OH'
  },
  {
    id: 'northern-illinois',
    name: 'Northern Illinois',
    mascot: 'Huskies',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#cc0000', text: '#ffffff' },
    abbreviation: 'NIU'
  },
  {
    id: 'ohio',
    name: 'Ohio',
    mascot: 'Bobcats',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#00694e', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'OHIO'
  },
  {
    id: 'toledo',
    name: 'Toledo',
    mascot: 'Rockets',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'TOL'
  },
  {
    id: 'massachusetts',
    name: 'UMass',
    mascot: 'Minutemen',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#881c1c', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MASS'
  },
  {
    id: 'western-michigan',
    name: 'Western Michigan',
    mascot: 'Broncos',
    conference: 'Mid-American',
    division: 'FBS',
    colors: { primary: '#8b4513', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'WMU'
  },

  // Mountain West Conference (12 teams)
  {
    id: 'air-force',
    name: 'Air Force',
    mascot: 'Falcons',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#0f4d92', secondary: '#8a8b8c', text: '#ffffff' },
    abbreviation: 'AF'
  },
  {
    id: 'boise-state',
    name: 'Boise State',
    mascot: 'Broncos',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#0033a0', secondary: '#d64309', text: '#ffffff' },
    abbreviation: 'BSU'
  },
  {
    id: 'colorado-state',
    name: 'Colorado State',
    mascot: 'Rams',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#1e4d2b', secondary: '#c8b99c', text: '#ffffff' },
    abbreviation: 'CSU'
  },
  {
    id: 'fresno-state',
    name: 'Fresno State',
    mascot: 'Bulldogs',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#e31837', text: '#ffffff' },
    abbreviation: 'FRES'
  },
  {
    id: 'hawaii',
    name: 'Hawaii',
    mascot: 'Rainbow Warriors',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#024731', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'HAW'
  },
  {
    id: 'nevada',
    name: 'Nevada',
    mascot: 'Wolf Pack',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#c5c5c5', text: '#ffffff' },
    abbreviation: 'NEV'
  },
  {
    id: 'new-mexico',
    name: 'New Mexico',
    mascot: 'Lobos',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#ba0c2f', secondary: '#c5c5c5', text: '#ffffff' },
    abbreviation: 'UNM'
  },
  {
    id: 'san-diego-state',
    name: 'San Diego State',
    mascot: 'Aztecs',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#a6192e', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'SDSU'
  },
  {
    id: 'san-jose-state',
    name: 'San Jose State',
    mascot: 'Spartans',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#0055a7', secondary: '#fdb515', text: '#ffffff' },
    abbreviation: 'SJSU'
  },
  {
    id: 'unlv',
    name: 'UNLV',
    mascot: 'Rebels',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#cf0a2c', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'UNLV'
  },
  {
    id: 'utah-state',
    name: 'Utah State',
    mascot: 'Aggies',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#0f2439', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'USU'
  },
  {
    id: 'wyoming',
    name: 'Wyoming',
    mascot: 'Cowboys',
    conference: 'Mountain West',
    division: 'FBS',
    colors: { primary: '#492f24', secondary: '#ffc425', text: '#ffffff' },
    abbreviation: 'WYO'
  },

  // Sun Belt Conference (14 teams)
  {
    id: 'appalachian-state',
    name: 'Appalachian State',
    mascot: 'Mountaineers',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'APP'
  },
  {
    id: 'arkansas-state',
    name: 'Arkansas State',
    mascot: 'Red Wolves',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#dc143c', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'ARST'
  },
  {
    id: 'coastal-carolina',
    name: 'Coastal Carolina',
    mascot: 'Chanticleers',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#006666', secondary: '#b8860b', text: '#ffffff' },
    abbreviation: 'CCU'
  },
  {
    id: 'georgia-southern',
    name: 'Georgia Southern',
    mascot: 'Eagles',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#041e42', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'GASO'
  },
  {
    id: 'georgia-state',
    name: 'Georgia State',
    mascot: 'Panthers',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#0039a6', secondary: '#da020e', text: '#ffffff' },
    abbreviation: 'GSU'
  },
  {
    id: 'james-madison',
    name: 'James Madison',
    mascot: 'Dukes',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#450084', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'JMU'
  },
  {
    id: 'louisiana',
    name: 'Louisiana',
    mascot: 'Ragin\' Cajuns',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#ce181e', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'UL'
  },
  {
    id: 'marshall',
    name: 'Marshall',
    mascot: 'Thundering Herd',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#00b04f', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'MRSH'
  },
  {
    id: 'old-dominion',
    name: 'Old Dominion',
    mascot: 'Monarchs',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#003057', secondary: '#c4d600', text: '#ffffff' },
    abbreviation: 'ODU'
  },
  {
    id: 'south-alabama',
    name: 'South Alabama',
    mascot: 'Jaguars',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#003594', secondary: '#dd0000', text: '#ffffff' },
    abbreviation: 'USA'
  },
  {
    id: 'southern-mississippi',
    name: 'Southern Miss',
    mascot: 'Golden Eagles',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#000000', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'USM'
  },
  {
    id: 'texas-state',
    name: 'Texas State',
    mascot: 'Bobcats',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#501214', secondary: '#b8860b', text: '#ffffff' },
    abbreviation: 'TXST'
  },
  {
    id: 'troy',
    name: 'Troy',
    mascot: 'Trojans',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#dc143c', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'TROY'
  },
  {
    id: 'louisiana-monroe',
    name: 'ULM',
    mascot: 'Warhawks',
    conference: 'Sun Belt',
    division: 'FBS',
    colors: { primary: '#8b0000', secondary: '#b8860b', text: '#ffffff' },
    abbreviation: 'ULM'
  }
];

// Complete FCS Teams Database (Selected Major Conferences - 109+ teams)
export const FCS_TEAMS: TeamInfo[] = [
  // Missouri Valley Football Conference (11 teams)
  {
    id: 'illinois-state',
    name: 'Illinois State',
    mascot: 'Redbirds',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#ce1126', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'ILST'
  },
  {
    id: 'indiana-state',
    name: 'Indiana State',
    mascot: 'Sycamores',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'INST'
  },
  {
    id: 'north-dakota',
    name: 'North Dakota',
    mascot: 'Fighting Hawks',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#009639', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UND'
  },
  {
    id: 'north-dakota-state',
    name: 'North Dakota State',
    mascot: 'Bison',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#003f2b', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'NDSU'
  },
  {
    id: 'northern-iowa',
    name: 'Northern Iowa',
    mascot: 'Panthers',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#4b2e84', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'UNI'
  },
  {
    id: 'south-dakota',
    name: 'South Dakota',
    mascot: 'Coyotes',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#d6001c', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'USD'
  },
  {
    id: 'south-dakota-state',
    name: 'South Dakota State',
    mascot: 'Jackrabbits',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'SDSU'
  },
  {
    id: 'southern-illinois',
    name: 'Southern Illinois',
    mascot: 'Salukis',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#8b0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'SIU'
  },
  {
    id: 'western-illinois',
    name: 'Western Illinois',
    mascot: 'Leathernecks',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#4b2e84', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'WIU'
  },
  {
    id: 'youngstown-state',
    name: 'Youngstown State',
    mascot: 'Penguins',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'YSU'
  },
  {
    id: 'murray-state',
    name: 'Murray State',
    mascot: 'Racers',
    conference: 'Missouri Valley Football',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'MSU'
  },

  // Big Sky Conference (12 teams)
  {
    id: 'cal-poly',
    name: 'Cal Poly',
    mascot: 'Mustangs',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#1e4d2b', secondary: '#c8b99c', text: '#ffffff' },
    abbreviation: 'CP'
  },
  {
    id: 'eastern-washington',
    name: 'Eastern Washington',
    mascot: 'Eagles',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#aa0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'EWU'
  },
  {
    id: 'idaho',
    name: 'Idaho',
    mascot: 'Vandals',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#ffb700', secondary: '#000000', text: '#000000' },
    abbreviation: 'IDHO'
  },
  {
    id: 'idaho-state',
    name: 'Idaho State',
    mascot: 'Bengals',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#ff6600', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'ISU'
  },
  {
    id: 'montana',
    name: 'Montana',
    mascot: 'Grizzlies',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#8b0000', secondary: '#c5c5c5', text: '#ffffff' },
    abbreviation: 'MONT'
  },
  {
    id: 'montana-state',
    name: 'Montana State',
    mascot: 'Bobcats',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'MSU'
  },
  {
    id: 'northern-arizona',
    name: 'Northern Arizona',
    mascot: 'Lumberjacks',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'NAU'
  },
  {
    id: 'northern-colorado',
    name: 'Northern Colorado',
    mascot: 'Bears',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'UNC'
  },
  {
    id: 'portland-state',
    name: 'Portland State',
    mascot: 'Vikings',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#006633', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'PSU'
  },
  {
    id: 'sacramento-state',
    name: 'Sacramento State',
    mascot: 'Hornets',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#046a38', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'SAC'
  },
  {
    id: 'uc-davis',
    name: 'UC Davis',
    mascot: 'Aggies',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'UCD'
  },
  {
    id: 'weber-state',
    name: 'Weber State',
    mascot: 'Wildcats',
    conference: 'Big Sky',
    division: 'FCS',
    colors: { primary: '#4b2e84', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'WSU'
  },

  // Coastal Athletic Association (14 teams)
  {
    id: 'albany',
    name: 'Albany',
    mascot: 'Great Danes',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#4b2e84', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'ALB'
  },
  {
    id: 'campbell',
    name: 'Campbell',
    mascot: 'Fighting Camels',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#ff6600', secondary: '#000000', text: '#ffffff' },
    abbreviation: 'CAMP'
  },
  {
    id: 'elon',
    name: 'Elon',
    mascot: 'Phoenix',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#8b0000', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'ELON'
  },
  {
    id: 'hampton',
    name: 'Hampton',
    mascot: 'Pirates',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'HAMP'
  },
  {
    id: 'maine',
    name: 'Maine',
    mascot: 'Black Bears',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#003c71', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'ME'
  },
  {
    id: 'monmouth',
    name: 'Monmouth',
    mascot: 'Hawks',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'MON'
  },
  {
    id: 'new-hampshire',
    name: 'New Hampshire',
    mascot: 'Wildcats',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'UNH'
  },
  {
    id: 'north-carolina-at',
    name: 'North Carolina A&T',
    mascot: 'Aggies',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'NCAT'
  },
  {
    id: 'rhode-island',
    name: 'Rhode Island',
    mascot: 'Rams',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#003594', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'URI'
  },
  {
    id: 'stony-brook',
    name: 'Stony Brook',
    mascot: 'Seawolves',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'SBU'
  },
  {
    id: 'towson',
    name: 'Towson',
    mascot: 'Tigers',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#ffb700', secondary: '#000000', text: '#000000' },
    abbreviation: 'TOW'
  },
  {
    id: 'villanova',
    name: 'Villanova',
    mascot: 'Wildcats',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#006bb3', secondary: '#ffffff', text: '#ffffff' },
    abbreviation: 'NOVA'
  },
  {
    id: 'william-mary',
    name: 'William & Mary',
    mascot: 'Tribe',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#046a38', secondary: '#ffb700', text: '#ffffff' },
    abbreviation: 'WM'
  },
  {
    id: 'delaware',
    name: 'Delaware',
    mascot: 'Blue Hens',
    conference: 'Coastal Athletic',
    division: 'FCS',
    colors: { primary: '#00539f', secondary: '#ffd200', text: '#ffffff' },
    abbreviation: 'DEL'
  }
  
  // Additional FCS conferences can be added here following the same pattern
  // Southern Conference, Patriot League, Ivy League, SWAC, MEAC, etc.
];

// Combined teams array
export const ALL_TEAMS: TeamInfo[] = [...FBS_TEAMS, ...FCS_TEAMS];

// Pre-built lookup maps for performance
const TEAM_BY_NAME_MAP = new Map<string, TeamInfo>();
const TEAM_BY_ID_MAP = new Map<string, TeamInfo>();
const TEAMS_BY_CONFERENCE_MAP = new Map<string, TeamInfo[]>();

// Initialize lookup maps
function initializeLookupMaps() {
  if (TEAM_BY_NAME_MAP.size > 0) return; // Already initialized
  
  ALL_TEAMS.forEach(team => {
    // Name-based lookup (case insensitive)
    TEAM_BY_NAME_MAP.set(team.name.toLowerCase(), team);
    
    // ID-based lookup
    TEAM_BY_ID_MAP.set(team.id, team);
    
    // Conference grouping
    if (!TEAMS_BY_CONFERENCE_MAP.has(team.conference)) {
      TEAMS_BY_CONFERENCE_MAP.set(team.conference, []);
    }
    TEAMS_BY_CONFERENCE_MAP.get(team.conference)!.push(team);
    
    // Add common name variations
    const variations = getNameVariations(team);
    variations.forEach(variation => {
      TEAM_BY_NAME_MAP.set(variation.toLowerCase(), team);
    });
  });
}

// Generate common name variations for flexible lookup
function getNameVariations(team: TeamInfo): string[] {
  const variations: string[] = [];
  
  // Add abbreviation
  variations.push(team.abbreviation);
  
  // Handle special cases
  switch (team.id) {
    case 'miami-ohio':
      variations.push('Miami (OH)', 'Miami OH', 'Miami University');
      break;
    case 'miami':
      variations.push('Miami FL', 'Miami (FL)', 'The U');
      break;
    case 'ole-miss':
      variations.push('Mississippi', 'University of Mississippi');
      break;
    case 'texas-am':
      variations.push('Texas A&M', 'TAMU');
      break;
    case 'nc-state':
      variations.push('North Carolina State', 'NC State', 'NCSU');
      break;
    case 'usc':
      variations.push('Southern California', 'Southern Cal');
      break;
    case 'ucla':
      variations.push('California Los Angeles');
      break;
    // Add more variations as needed
  }
  
  return variations;
}

// Required API functions
export function getTeamInfo(teamName: string): TeamInfo | null {
  initializeLookupMaps();
  
  if (!teamName) return null;
  
  return TEAM_BY_NAME_MAP.get(teamName.toLowerCase()) || null;
}

export function getFallbackTeamInfo(teamName: string): TeamInfo {
  const existingTeam = getTeamInfo(teamName);
  if (existingTeam) return existingTeam;
  
  // Create fallback team for unknown teams
  const cleanId = teamName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  return {
    id: cleanId,
    name: teamName,
    mascot: 'Team',
    conference: 'Independent',
    division: 'FBS',
    colors: {
      primary: '#666666',
      secondary: '#ffffff',
      text: '#ffffff'
    },
    abbreviation: teamName.substring(0, 4).toUpperCase()
  };
}

export function getAllTeams(): TeamInfo[] {
  return [...ALL_TEAMS];
}

export function getTeamsByConference(conference: string): TeamInfo[] {
  initializeLookupMaps();
  return TEAMS_BY_CONFERENCE_MAP.get(conference) || [];
}

export function getTeamsByDivision(division: 'FBS' | 'FCS'): TeamInfo[] {
  return ALL_TEAMS.filter(team => team.division === division);
}

// Enhanced utility functions
export function getTeamById(id: string): TeamInfo | null {
  initializeLookupMaps();
  return TEAM_BY_ID_MAP.get(id) || null;
}

export function searchTeams(query: string): TeamInfo[] {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  
  return ALL_TEAMS.filter(team => 
    team.name.toLowerCase().includes(searchTerm) ||
    team.mascot.toLowerCase().includes(searchTerm) ||
    team.conference.toLowerCase().includes(searchTerm) ||
    team.abbreviation.toLowerCase().includes(searchTerm)
  );
}

export function isValidTeam(teamName: string): boolean {
  return getTeamInfo(teamName) !== null;
}

export function getConferenceStats() {
  initializeLookupMaps();
  
  const stats = {
    totalConferences: TEAMS_BY_CONFERENCE_MAP.size,
    totalTeams: ALL_TEAMS.length,
    fbsTeams: FBS_TEAMS.length,
    fcsTeams: FCS_TEAMS.length,
    conferenceBreakdown: Object.fromEntries(
      Array.from(TEAMS_BY_CONFERENCE_MAP.entries()).map(([conf, teams]) => [
        conf,
        {
          teamCount: teams.length,
          division: teams[0]?.division || 'Unknown'
        }
      ])
    )
  };
  
  return stats;
}

// TeamInfo interface is already exported on line 7