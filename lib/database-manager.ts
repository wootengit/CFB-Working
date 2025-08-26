/**
 * College Football Database Manager
 * Handles local SQLite database for API caching and standings optimization
 * Designed to minimize CFBD API calls and stay within 30,000/month limit
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

// Types for our database entities
export interface Conference {
  id?: number;
  conference_slug: string;
  conference_name: string;
  conference_full_name: string;
  division: 'FBS' | 'FCS' | 'Independent';
  classification: 'Power Four' | 'Group of Five' | 'FCS' | 'Independent';
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  team_count?: number;
  established_year?: number;
}

export interface Team {
  id?: number;
  team_name: string;
  school_name: string;
  mascot?: string;
  abbreviation?: string;
  slug: string;
  conference_id?: number;
  division: 'FBS' | 'FCS' | 'Independent';
  city?: string;
  state?: string;
  stadium_name?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  cfbd_team_id?: number;
  espn_team_id?: number;
}

export interface TeamStanding {
  id?: number;
  team_id: number;
  season_id: number;
  wins: number;
  losses: number;
  ties: number;
  win_percentage: number;
  conference_wins: number;
  conference_losses: number;
  points_for_per_game: number;
  points_against_per_game: number;
  average_margin: number;
}

export interface TeamAnalytics {
  team_id: number;
  season_id: number;
  sp_plus_overall?: number;
  sp_plus_ranking?: number;
  explosiveness?: number;
  offensive_efficiency?: number;
  defensive_efficiency?: number;
  ppa_overall?: number;
  offensive_ppa?: number;
  defensive_ppa?: number;
  sp_plus_offense?: number;
  sp_plus_defense?: number;
  fpi_rating?: number;
  strength_of_schedule_rank?: number;
  talent_rank?: number;
}

export interface APICacheEntry {
  endpoint: string;
  parameters?: string;
  calls_made: number;
  monthly_calls: number;
  ttl_hours: number;
  expires_at: string;
  last_called: string;
}

class DatabaseManager {
  private db: Database.Database;
  private readonly dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || path.join(process.cwd(), 'data', 'cfb-cache.db');
    this.db = new Database(this.dbPath);
    
    // Enable foreign keys and optimize for performance
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 10000');
    
    this.initializeDatabase();
  }

  /**
   * Initialize database with schema and default data
   */
  private initializeDatabase(): void {
    try {
      const schemaPath = path.join(process.cwd(), 'lib', 'database-schema.sql');
      const schema = readFileSync(schemaPath, 'utf-8');
      
      // Execute schema in transaction
      this.db.transaction(() => {
        this.db.exec(schema);
      })();
      
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw new Error('Failed to initialize database');
    }
  }

  /**
   * Check if we should fetch fresh data from API based on cache TTL
   */
  shouldFetchFromAPI(endpoint: string, ttlHours: number = 24): boolean {
    const stmt = this.db.prepare(`
      SELECT expires_at, monthly_calls 
      FROM api_cache_log 
      WHERE endpoint = ? 
      ORDER BY last_called DESC 
      LIMIT 1
    `);
    
    const result = stmt.get(endpoint) as { expires_at: string; monthly_calls: number } | undefined;
    
    if (!result) {
      return true; // No cache entry, fetch from API
    }
    
    // Check if cache expired
    const expiresAt = new Date(result.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      return true;
    }
    
    // Check monthly API limit (stay under 25,000 to be safe)
    if (result.monthly_calls >= 25000) {
      console.warn(`⚠️ Monthly API limit approaching for ${endpoint}`);
      return false;
    }
    
    return false; // Use cached data
  }

  /**
   * Log API call for rate limiting and monitoring
   */
  logAPICall(endpoint: string, parameters: any = {}, ttlHours: number = 24): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttlHours * 60 * 60 * 1000));
    
    const stmt = this.db.prepare(`
      INSERT INTO api_cache_log (
        endpoint, parameters, calls_made, monthly_calls, 
        ttl_hours, expires_at, last_called
      ) VALUES (?, ?, 1, 1, ?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET
        calls_made = calls_made + 1,
        monthly_calls = CASE 
          WHEN date(last_called) = date('now') THEN monthly_calls + 1
          ELSE 1
        END,
        last_called = ?,
        expires_at = ?
    `);
    
    const paramStr = JSON.stringify(parameters);
    stmt.run(endpoint, paramStr, ttlHours, expiresAt.toISOString(), now.toISOString(), 
            now.toISOString(), expiresAt.toISOString());
  }

  /**
   * Get API usage statistics
   */
  getAPIUsage(): { daily: number; monthly: number; total: number } {
    const stats = this.db.prepare(`
      SELECT 
        SUM(CASE WHEN date(last_called) = date('now') THEN calls_made ELSE 0 END) as daily,
        SUM(CASE WHEN date(last_called) >= date('now', 'start of month') THEN monthly_calls ELSE 0 END) as monthly,
        SUM(calls_made) as total
      FROM api_cache_log
    `).get() as { daily: number; monthly: number; total: number };
    
    return {
      daily: stats.daily || 0,
      monthly: stats.monthly || 0,
      total: stats.total || 0
    };
  }

  /**
   * Seed database with comprehensive Division 1A conference and team data
   */
  seedWithDivision1AData(): void {
    const transaction = this.db.transaction(() => {
      
      // Insert Power Four conferences with 2024 realignment
      const conferences: Conference[] = [
        {
          conference_slug: 'sec',
          conference_name: 'SEC',
          conference_full_name: 'Southeastern Conference',
          division: 'FBS',
          classification: 'Power Four',
          primary_color: '#1F2B5C',
          secondary_color: '#C5C5C5',
          logo_url: 'https://logos-world.net/wp-content/uploads/2022/02/SEC-Logo.png',
          established_year: 1932
        },
        {
          conference_slug: 'big-ten',
          conference_name: 'Big Ten',
          conference_full_name: 'Big Ten Conference',
          division: 'FBS',
          classification: 'Power Four',
          primary_color: '#1E41A7',
          secondary_color: '#FFFFFF',
          logo_url: 'https://1000logos.net/wp-content/uploads/2023/05/Big-Ten-logo.png',
          established_year: 1896
        },
        {
          conference_slug: 'big-12',
          conference_name: 'Big 12',
          conference_full_name: 'Big 12 Conference',
          division: 'FBS',
          classification: 'Power Four',
          primary_color: '#0066CC',
          secondary_color: '#FFFFFF',
          logo_url: 'https://1000logos.net/wp-content/uploads/2023/05/Big-12-logo.png',
          established_year: 1994
        },
        {
          conference_slug: 'acc',
          conference_name: 'ACC',
          conference_full_name: 'Atlantic Coast Conference',
          division: 'FBS',
          classification: 'Power Four',
          primary_color: '#003366',
          secondary_color: '#FFA500',
          logo_url: 'https://1000logos.net/wp-content/uploads/2023/04/ACC-logo.png',
          established_year: 1953
        },
        // Group of Five
        {
          conference_slug: 'american',
          conference_name: 'American',
          conference_full_name: 'American Athletic Conference',
          division: 'FBS',
          classification: 'Group of Five',
          primary_color: '#0066CC',
          secondary_color: '#FFFFFF',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/02/American_Athletic_Conference_logo.svg',
          established_year: 2013
        },
        {
          conference_slug: 'mountain-west',
          conference_name: 'Mountain West',
          conference_full_name: 'Mountain West Conference',
          division: 'FBS',
          classification: 'Group of Five',
          primary_color: '#003366',
          secondary_color: '#CC6600',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Mountain_West_Conference_logo.svg',
          established_year: 1999
        },
        {
          conference_slug: 'mac',
          conference_name: 'MAC',
          conference_full_name: 'Mid-American Conference',
          division: 'FBS',
          classification: 'Group of Five',
          primary_color: '#CC0000',
          secondary_color: '#FFFFFF',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/MAC_logo.png',
          established_year: 1946
        },
        {
          conference_slug: 'sun-belt',
          conference_name: 'Sun Belt',
          conference_full_name: 'Sun Belt Conference',
          division: 'FBS',
          classification: 'Group of Five',
          primary_color: '#FFCC00',
          secondary_color: '#003366',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Sun_Belt_Conference_logo.svg',
          established_year: 1976
        },
        {
          conference_slug: 'conference-usa',
          conference_name: 'C-USA',
          conference_full_name: 'Conference USA',
          division: 'FBS',
          classification: 'Group of Five',
          primary_color: '#003366',
          secondary_color: '#FFCC00',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Conference_USA_logo.svg',
          established_year: 1995
        }
      ];

      // Insert conferences
      const insertConference = this.db.prepare(`
        INSERT OR REPLACE INTO conferences (
          conference_slug, conference_name, conference_full_name, division, 
          classification, primary_color, secondary_color, logo_url, established_year
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      conferences.forEach(conf => {
        insertConference.run(
          conf.conference_slug, conf.conference_name, conf.conference_full_name,
          conf.division, conf.classification, conf.primary_color, 
          conf.secondary_color, conf.logo_url, conf.established_year
        );
      });

      // Sample SEC teams with complete data (will expand with full roster)
      const secTeams: Team[] = [
        {
          team_name: 'Alabama',
          school_name: 'University of Alabama',
          mascot: 'Crimson Tide',
          abbreviation: 'ALA',
          slug: 'alabama',
          division: 'FBS',
          city: 'Tuscaloosa',
          state: 'AL',
          stadium_name: 'Bryant-Denny Stadium',
          primary_color: '#9E1B32',
          secondary_color: '#828A8F',
          logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
          cfbd_team_id: 333,
          espn_team_id: 333
        },
        {
          team_name: 'Georgia',
          school_name: 'University of Georgia',
          mascot: 'Bulldogs',
          abbreviation: 'UGA',
          slug: 'georgia',
          division: 'FBS',
          city: 'Athens',
          state: 'GA',
          stadium_name: 'Sanford Stadium',
          primary_color: '#BA0C2F',
          secondary_color: '#000000',
          logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
          cfbd_team_id: 61,
          espn_team_id: 61
        },
        {
          team_name: 'Texas',
          school_name: 'University of Texas at Austin',
          mascot: 'Longhorns',
          abbreviation: 'TEX',
          slug: 'texas',
          division: 'FBS',
          city: 'Austin',
          state: 'TX',
          stadium_name: 'Darrell K Royal Stadium',
          primary_color: '#BF5700',
          secondary_color: '#FFFFFF',
          logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
          cfbd_team_id: 251,
          espn_team_id: 251
        },
        {
          team_name: 'Oklahoma',
          school_name: 'University of Oklahoma',
          mascot: 'Sooners',
          abbreviation: 'OU',
          slug: 'oklahoma',
          division: 'FBS',
          city: 'Norman',
          state: 'OK',
          stadium_name: 'Gaylord Family Oklahoma Memorial Stadium',
          primary_color: '#841617',
          secondary_color: '#FDF9D3',
          logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/201.png',
          cfbd_team_id: 201,
          espn_team_id: 201
        }
      ];

      // Get SEC conference ID
      const secConferenceId = this.db.prepare(
        'SELECT id FROM conferences WHERE conference_slug = ?'
      ).get('sec') as { id: number } | undefined;

      if (secConferenceId) {
        const insertTeam = this.db.prepare(`
          INSERT OR REPLACE INTO teams (
            team_name, school_name, mascot, abbreviation, slug, conference_id,
            division, city, state, stadium_name, primary_color, secondary_color,
            logo_url, cfbd_team_id, espn_team_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        secTeams.forEach(team => {
          insertTeam.run(
            team.team_name, team.school_name, team.mascot, team.abbreviation,
            team.slug, secConferenceId.id, team.division, team.city, team.state,
            team.stadium_name, team.primary_color, team.secondary_color,
            team.logo_url, team.cfbd_team_id, team.espn_team_id
          );
        });
      }

      console.log('✅ Database seeded with Division 1A conference and team data');
    });

    transaction();
  }

  /**
   * Store team standings data
   */
  upsertTeamStandings(standings: TeamStanding[]): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO team_standings (
        team_id, season_id, wins, losses, ties, win_percentage,
        conference_wins, conference_losses, points_for_per_game,
        points_against_per_game, average_margin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((standings: TeamStanding[]) => {
      for (const standing of standings) {
        stmt.run(
          standing.team_id, standing.season_id, standing.wins, standing.losses,
          standing.ties, standing.win_percentage, standing.conference_wins,
          standing.conference_losses, standing.points_for_per_game,
          standing.points_against_per_game, standing.average_margin
        );
      }
    });

    transaction(standings);
  }

  /**
   * Store team analytics (MIT research fields)
   */
  upsertTeamAnalytics(analytics: TeamAnalytics[]): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO team_analytics (
        team_id, season_id, sp_plus_overall, sp_plus_ranking, explosiveness,
        offensive_efficiency, defensive_efficiency, ppa_overall, offensive_ppa,
        defensive_ppa, sp_plus_offense, sp_plus_defense, fpi_rating,
        strength_of_schedule_rank, talent_rank
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((analytics: TeamAnalytics[]) => {
      for (const analytic of analytics) {
        stmt.run(
          analytic.team_id, analytic.season_id, analytic.sp_plus_overall,
          analytic.sp_plus_ranking, analytic.explosiveness, 
          analytic.offensive_efficiency, analytic.defensive_efficiency,
          analytic.ppa_overall, analytic.offensive_ppa, analytic.defensive_ppa,
          analytic.sp_plus_offense, analytic.sp_plus_defense, analytic.fpi_rating,
          analytic.strength_of_schedule_rank, analytic.talent_rank
        );
      }
    });

    transaction(analytics);
  }

  /**
   * Get complete standings data for a conference
   */
  getStandingsByConference(conferenceSlug: string, year: number = 2024): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM v_current_standings 
      WHERE conference_name = ? OR conference_slug = ?
      ORDER BY wins DESC, win_percentage DESC
    `);

    return stmt.all(conferenceSlug, conferenceSlug);
  }

  /**
   * Get all standings with conference grouping
   */
  getAllStandings(year: number = 2024): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM v_current_standings
      ORDER BY conference_name, wins DESC, win_percentage DESC
    `);

    return stmt.all();
  }

  /**
   * Get team by slug
   */
  getTeamBySlug(slug: string): Team | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM v_teams_complete WHERE slug = ?
    `);

    return stmt.get(slug) as Team | undefined;
  }

  /**
   * Get all conferences with team counts
   */
  getAllConferences(): Conference[] {
    const stmt = this.db.prepare(`
      SELECT *, 
        (SELECT COUNT(*) FROM teams WHERE conference_id = conferences.id) as team_count
      FROM conferences 
      ORDER BY classification, conference_name
    `);

    return stmt.all() as Conference[];
  }

  /**
   * Validate and update logo URLs
   */
  async validateLogos(): Promise<{ valid: number; invalid: number; updated: number }> {
    const teams = this.db.prepare('SELECT id, team_name, logo_url FROM teams').all() as Team[];
    let validCount = 0;
    let invalidCount = 0;
    let updatedCount = 0;

    for (const team of teams) {
      if (team.logo_url) {
        try {
          const response = await fetch(team.logo_url, { method: 'HEAD' });
          const isValid = response.ok && response.headers.get('content-type')?.startsWith('image/');
          
          // Log validation result
          this.db.prepare(`
            INSERT OR REPLACE INTO logo_validation (
              team_id, logo_type, logo_url, is_valid, http_status,
              content_type, last_validated
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            team.id, 'primary', team.logo_url, isValid,
            response.status, response.headers.get('content-type'),
            new Date().toISOString()
          );

          if (isValid) {
            validCount++;
          } else {
            invalidCount++;
            // Use fallback ESPN logo
            const fallbackUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.id}.png`;
            this.db.prepare('UPDATE teams SET logo_url = ? WHERE id = ?')
              .run(fallbackUrl, team.id);
            updatedCount++;
          }
        } catch (error) {
          invalidCount++;
          console.warn(`Logo validation failed for ${team.team_name}: ${error}`);
        }
      }
    }

    return { valid: validCount, invalid: invalidCount, updated: updatedCount };
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }

  /**
   * Get database instance for custom queries
   */
  getDatabase(): Database.Database {
    return this.db;
  }
}

// Singleton instance
let dbManager: DatabaseManager | null = null;

export const getDatabaseManager = (): DatabaseManager => {
  if (!dbManager) {
    dbManager = new DatabaseManager();
  }
  return dbManager;
};

export default DatabaseManager;