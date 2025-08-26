-- College Football Database Schema for API Caching
-- Designed to minimize CFBD API calls while supporting comprehensive standings
-- Supports 130+ FBS teams across all conferences with MIT research fields

-- =============================================================================
-- CONFERENCES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS conferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conference_slug TEXT UNIQUE NOT NULL,
  conference_name TEXT NOT NULL,
  conference_full_name TEXT NOT NULL,
  division TEXT CHECK(division IN ('FBS', 'FCS', 'Independent')) NOT NULL,
  classification TEXT CHECK(classification IN ('Power Four', 'Group of Five', 'FCS', 'Independent')) NOT NULL,
  
  -- Branding
  primary_color TEXT,
  secondary_color TEXT,
  logo_url TEXT,
  
  -- Metadata
  team_count INTEGER DEFAULT 0,
  established_year INTEGER,
  realignment_notes TEXT,
  
  -- Caching
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TEAMS TABLE 
-- =============================================================================
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- Basic Info
  team_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  mascot TEXT,
  abbreviation TEXT,
  slug TEXT UNIQUE NOT NULL,
  
  -- Conference Affiliation
  conference_id INTEGER REFERENCES conferences(id),
  division TEXT CHECK(division IN ('FBS', 'FCS', 'Independent')) NOT NULL,
  
  -- Location
  city TEXT,
  state TEXT,
  stadium_name TEXT,
  stadium_capacity INTEGER,
  
  -- Branding & Identity
  primary_color TEXT,
  secondary_color TEXT,
  tertiary_color TEXT,
  logo_url TEXT,
  helmet_logo_url TEXT,
  alternate_logo_url TEXT,
  
  -- External IDs for API mapping
  cfbd_team_id INTEGER,
  espn_team_id INTEGER,
  
  -- Metadata
  founded_year INTEGER,
  realignment_year INTEGER DEFAULT 2024,
  notes TEXT,
  
  -- Caching
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SEASONS TABLE (for multi-year data)
-- =============================================================================
CREATE TABLE IF NOT EXISTS seasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  season_type TEXT CHECK(season_type IN ('regular', 'postseason')) DEFAULT 'regular',
  
  -- Season metadata
  start_date DATE,
  end_date DATE,
  playoff_format TEXT,
  
  -- Caching metadata
  data_complete BOOLEAN DEFAULT FALSE,
  last_api_fetch DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(year, season_type)
);

-- =============================================================================
-- TEAM STANDINGS (Core Records Data)
-- =============================================================================
CREATE TABLE IF NOT EXISTS team_standings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- References
  team_id INTEGER REFERENCES teams(id),
  season_id INTEGER REFERENCES seasons(id),
  
  -- Basic Record
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  win_percentage REAL DEFAULT 0.0,
  
  -- Conference Record
  conference_wins INTEGER DEFAULT 0,
  conference_losses INTEGER DEFAULT 0,
  conference_ties INTEGER DEFAULT 0,
  conference_win_percentage REAL DEFAULT 0.0,
  
  -- Scoring Stats
  points_for INTEGER DEFAULT 0,
  points_against INTEGER DEFAULT 0,
  points_for_per_game REAL DEFAULT 0.0,
  points_against_per_game REAL DEFAULT 0.0,
  average_margin REAL DEFAULT 0.0,
  
  -- Caching
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(team_id, season_id)
);

-- =============================================================================
-- MIT RESEARCH PREDICTIVE FIELDS
-- =============================================================================
CREATE TABLE IF NOT EXISTS team_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- References
  team_id INTEGER REFERENCES teams(id),
  season_id INTEGER REFERENCES seasons(id),
  
  -- MIT Tier 1 Fields (Highest Predictive Value - 72-86% accuracy)
  sp_plus_overall REAL,           -- SP+ Overall Rating (-20 to +30)
  sp_plus_ranking INTEGER,        -- SP+ National Ranking (1-130)
  explosiveness REAL,             -- Explosiveness Rating (0.8 to 2.2) - 86% win correlation
  offensive_efficiency REAL,      -- Success Rate (0.5 to 0.8) 
  defensive_efficiency REAL,      -- Defensive Success Rate
  ppa_overall REAL,               -- PPA Overall (-0.3 to 0.6) - Neural network predictions
  offensive_ppa REAL,             -- Offensive PPA
  defensive_ppa REAL,             -- Defensive PPA
  
  -- MIT Tier 2 Fields (Strong Supplementary Predictors)
  sp_plus_offense REAL,           -- SP+ Offensive Rating (-15 to +25)
  sp_plus_defense REAL,           -- SP+ Defensive Rating (-15 to +25)  
  fpi_rating REAL,                -- Football Power Index (-15 to +25)
  strength_of_schedule_rank INTEGER, -- SOS Rank (1-130)
  second_order_wins REAL,         -- Expected wins based on performance
  
  -- Advanced Metrics
  havoc_rate REAL,                -- Defensive Havoc Rate
  finishing_rate REAL,            -- Red Zone/Goal Line Efficiency
  field_position REAL,            -- Average Field Position
  pace REAL,                      -- Plays per game pace
  
  -- Recruiting & Talent
  talent_rank INTEGER,            -- 247Sports Talent Composite Rank
  recruiting_rank INTEGER,        -- Current recruiting class rank
  
  -- Caching metadata
  source TEXT DEFAULT 'CFBD',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  confidence_score REAL DEFAULT 1.0,
  
  UNIQUE(team_id, season_id)
);

-- =============================================================================
-- BETTING METRICS (For Betting Context)
-- =============================================================================
CREATE TABLE IF NOT EXISTS team_betting_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- References
  team_id INTEGER REFERENCES teams(id),
  season_id INTEGER REFERENCES seasons(id),
  
  -- Against The Spread (ATS)
  ats_wins INTEGER DEFAULT 0,
  ats_losses INTEGER DEFAULT 0,
  ats_pushes INTEGER DEFAULT 0,
  ats_percentage REAL DEFAULT 0.0,
  
  -- Over/Under
  over_wins INTEGER DEFAULT 0,
  under_wins INTEGER DEFAULT 0,
  ou_pushes INTEGER DEFAULT 0,
  over_percentage REAL DEFAULT 0.0,
  
  -- Situational ATS
  favorite_ats_wins INTEGER DEFAULT 0,
  favorite_ats_losses INTEGER DEFAULT 0,
  favorite_ats_percentage REAL DEFAULT 0.0,
  
  underdog_ats_wins INTEGER DEFAULT 0,
  underdog_ats_losses INTEGER DEFAULT 0,
  underdog_ats_percentage REAL DEFAULT 0.0,
  
  -- Performance Metrics  
  average_cover_margin REAL DEFAULT 0.0,
  average_line REAL DEFAULT 0.0,
  average_total REAL DEFAULT 0.0,
  
  -- Recent Form (Last 5 games)
  last5_wins INTEGER DEFAULT 0,
  last5_losses INTEGER DEFAULT 0,
  last5_ats_wins INTEGER DEFAULT 0,
  last5_ats_losses INTEGER DEFAULT 0,
  last5_ats_percentage REAL DEFAULT 0.0,
  
  -- Caching
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(team_id, season_id)
);

-- =============================================================================
-- API CACHE METADATA
-- =============================================================================
CREATE TABLE IF NOT EXISTS api_cache_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  endpoint TEXT NOT NULL,
  parameters TEXT,
  
  -- Usage tracking
  calls_made INTEGER DEFAULT 1,
  last_called DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Rate limiting
  daily_calls INTEGER DEFAULT 0,
  monthly_calls INTEGER DEFAULT 0,
  rate_limit_remaining INTEGER,
  
  -- Data freshness
  ttl_hours INTEGER DEFAULT 24,
  expires_at DATETIME,
  
  -- Response metadata
  response_size INTEGER,
  response_time_ms INTEGER,
  status_code INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- LOGO VALIDATION TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS logo_validation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  team_id INTEGER REFERENCES teams(id),
  conference_id INTEGER REFERENCES conferences(id),
  
  logo_type TEXT CHECK(logo_type IN ('primary', 'helmet', 'alternate', 'conference')) NOT NULL,
  logo_url TEXT NOT NULL,
  
  -- Validation status
  is_valid BOOLEAN DEFAULT NULL,
  http_status INTEGER,
  content_type TEXT,
  file_size_bytes INTEGER,
  
  -- Fallback information
  fallback_url TEXT,
  fallback_used BOOLEAN DEFAULT FALSE,
  
  -- Validation metadata
  last_validated DATETIME,
  validation_attempts INTEGER DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Conferences
CREATE INDEX IF NOT EXISTS idx_conferences_slug ON conferences(conference_slug);
CREATE INDEX IF NOT EXISTS idx_conferences_division ON conferences(division);

-- Teams
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_conference ON teams(conference_id);
CREATE INDEX IF NOT EXISTS idx_teams_division ON teams(division);
CREATE INDEX IF NOT EXISTS idx_teams_cfbd_id ON teams(cfbd_team_id);

-- Standings
CREATE INDEX IF NOT EXISTS idx_standings_team_season ON team_standings(team_id, season_id);
CREATE INDEX IF NOT EXISTS idx_standings_season ON team_standings(season_id);
CREATE INDEX IF NOT EXISTS idx_standings_wins ON team_standings(wins DESC);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_team_season ON team_analytics(team_id, season_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sp_plus ON team_analytics(sp_plus_overall DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_explosiveness ON team_analytics(explosiveness DESC);

-- Betting
CREATE INDEX IF NOT EXISTS idx_betting_team_season ON team_betting_stats(team_id, season_id);
CREATE INDEX IF NOT EXISTS idx_betting_ats ON team_betting_stats(ats_percentage DESC);

-- API Cache
CREATE INDEX IF NOT EXISTS idx_cache_endpoint ON api_cache_log(endpoint);
CREATE INDEX IF NOT EXISTS idx_cache_date ON api_cache_log(last_called);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON api_cache_log(expires_at);

-- Logo Validation
CREATE INDEX IF NOT EXISTS idx_logo_team ON logo_validation(team_id);
CREATE INDEX IF NOT EXISTS idx_logo_valid ON logo_validation(is_valid);

-- =============================================================================
-- VIEWS FOR EASY DATA ACCESS
-- =============================================================================

-- Complete Team Data View
CREATE VIEW IF NOT EXISTS v_teams_complete AS
SELECT 
  t.id,
  t.team_name,
  t.school_name,
  t.mascot,
  t.abbreviation,
  t.slug,
  
  -- Conference Info
  c.conference_name,
  c.conference_slug,
  c.division,
  c.classification,
  
  -- Colors and Logos
  t.primary_color,
  t.secondary_color,
  t.logo_url,
  
  -- Location
  t.city,
  t.state,
  t.stadium_name
  
FROM teams t
LEFT JOIN conferences c ON t.conference_id = c.id;

-- Current Season Standings View  
CREATE VIEW IF NOT EXISTS v_current_standings AS
SELECT 
  tc.team_name,
  tc.conference_name,
  tc.division,
  ts.wins,
  ts.losses,
  ts.win_percentage,
  ts.conference_wins,
  ts.conference_losses,
  ts.points_for_per_game,
  ts.points_against_per_game,
  ts.average_margin,
  
  -- MIT Research Fields
  ta.sp_plus_overall,
  ta.sp_plus_ranking,
  ta.explosiveness,
  ta.offensive_efficiency,
  ta.defensive_efficiency,
  ta.ppa_overall,
  ta.strength_of_schedule_rank,
  
  -- Betting Stats
  tb.ats_percentage,
  tb.over_percentage,
  tb.average_cover_margin,
  
  tc.logo_url,
  tc.primary_color
  
FROM team_standings ts
JOIN v_teams_complete tc ON ts.team_id = tc.id
JOIN seasons s ON ts.season_id = s.id
LEFT JOIN team_analytics ta ON ts.team_id = ta.team_id AND ts.season_id = ta.season_id
LEFT JOIN team_betting_stats tb ON ts.team_id = tb.team_id AND ts.season_id = tb.season_id
WHERE s.year = 2024 AND s.season_type = 'regular'
ORDER BY tc.conference_name, ts.wins DESC;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Update team count in conferences when teams are added/removed
CREATE TRIGGER IF NOT EXISTS update_conference_team_count 
AFTER INSERT ON teams 
BEGIN
  UPDATE conferences 
  SET team_count = (
    SELECT COUNT(*) 
    FROM teams 
    WHERE conference_id = NEW.conference_id
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.conference_id;
END;

-- Auto-update win percentage when wins/losses change
CREATE TRIGGER IF NOT EXISTS update_win_percentage
AFTER UPDATE OF wins, losses ON team_standings
BEGIN
  UPDATE team_standings
  SET 
    win_percentage = CASE 
      WHEN (NEW.wins + NEW.losses + NEW.ties) > 0 
      THEN CAST(NEW.wins AS REAL) / (NEW.wins + NEW.losses + NEW.ties)
      ELSE 0.0
    END,
    last_updated = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

-- Auto-update ATS percentage
CREATE TRIGGER IF NOT EXISTS update_ats_percentage
AFTER UPDATE OF ats_wins, ats_losses ON team_betting_stats
BEGIN
  UPDATE team_betting_stats
  SET 
    ats_percentage = CASE
      WHEN (NEW.ats_wins + NEW.ats_losses) > 0
      THEN CAST(NEW.ats_wins AS REAL) / (NEW.ats_wins + NEW.ats_losses) * 100
      ELSE 0.0
    END,
    last_updated = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Insert current season
INSERT OR IGNORE INTO seasons (year, season_type, start_date, end_date) 
VALUES (2024, 'regular', '2024-08-24', '2024-12-31');

-- Insert Power Four Conferences
INSERT OR IGNORE INTO conferences (conference_slug, conference_name, conference_full_name, division, classification, primary_color, secondary_color) VALUES
('sec', 'SEC', 'Southeastern Conference', 'FBS', 'Power Four', '#1F2B5C', '#C5C5C5'),
('big-ten', 'Big Ten', 'Big Ten Conference', 'FBS', 'Power Four', '#1E41A7', '#FFFFFF'),
('big-12', 'Big 12', 'Big 12 Conference', 'FBS', 'Power Four', '#0066CC', '#FFFFFF'), 
('acc', 'ACC', 'Atlantic Coast Conference', 'FBS', 'Power Four', '#003366', '#FFA500'),
('pac-12', 'Pac-12', 'Pac-12 Conference', 'FBS', 'Power Four', '#003F5C', '#8B0000');

-- Insert Group of Five Conferences
INSERT OR IGNORE INTO conferences (conference_slug, conference_name, conference_full_name, division, classification, primary_color, secondary_color) VALUES
('american', 'American', 'American Athletic Conference', 'FBS', 'Group of Five', '#0066CC', '#FFFFFF'),
('mountain-west', 'Mountain West', 'Mountain West Conference', 'FBS', 'Group of Five', '#003366', '#CC6600'),
('mac', 'MAC', 'Mid-American Conference', 'FBS', 'Group of Five', '#CC0000', '#FFFFFF'),
('sun-belt', 'Sun Belt', 'Sun Belt Conference', 'FBS', 'Group of Five', '#FFCC00', '#003366'),
('conference-usa', 'C-USA', 'Conference USA', 'FBS', 'Group of Five', '#003366', '#FFCC00'),
('independent', 'Independent', 'FBS Independents', 'Independent', 'Independent', '#666666', '#FFFFFF');

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

/*
This schema is designed to:

1. MINIMIZE API CALLS by caching all team and conference data locally
2. SUPPORT 30,000/month limit with smart caching and TTL
3. STORE MIT RESEARCH FIELDS for high-accuracy predictions (72-86% correlation)
4. HANDLE ALL DIVISION 1A conferences (Power Four + Group of Five + Independents)
5. PROVIDE BETTING CONTEXT with ATS, O/U, and cover margins
6. VALIDATE AND FALLBACK logos automatically
7. TRACK API usage to stay within limits
8. SUPPORT MULTI-YEAR data for historical analysis

Key Features:
- Automatic win percentage calculations
- Logo validation with fallbacks  
- API usage tracking and rate limiting
- MIT research field storage for predictions
- Conference-based organization
- Comprehensive indexes for fast queries
- Views for easy data access
- Triggers for automatic updates

Usage:
- Import teams and conferences from CFBD API once
- Cache standings data with configurable TTL
- Query locally for 95% of requests
- Only hit API for fresh data or new seasons
- Track usage to optimize API call patterns
*/