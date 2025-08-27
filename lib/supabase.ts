// Supabase Client Configuration for CFB Stats Database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (API routes)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Database Types for CFB Stats
export interface Team {
  id: number
  name: string
  conference: string
  logo_url: string
  espn_id?: number
  created_at: string
  updated_at: string
}

export interface TeamStats {
  id: number
  team_id: number
  year: number
  wins: number
  losses: number
  sp_rating: number
  sp_ranking: number
  offense_ppa: number
  defense_ppa: number
  explosiveness: number
  offensive_efficiency: number
  defensive_efficiency: number
  points_per_game: number
  points_allowed_per_game: number
  created_at: string
  updated_at: string
}

export interface BettingStats {
  id: number
  team_id: number
  year: number
  ats_wins: number
  ats_losses: number
  ats_pushes: number
  over_wins: number
  under_wins: number
  ou_pushes: number
  favorite_ats_pct: number
  dog_ats_pct: number
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const cfbDatabase = {
  // Teams operations
  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async upsertTeam(team: Omit<Team, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('teams')
      .upsert(team, { onConflict: 'name' })
      .select()
    
    if (error) throw error
    return data
  },

  // Team Stats operations
  async getTeamStats(year: number) {
    const { data, error } = await supabase
      .from('team_stats')
      .select(`
        *,
        teams (name, conference, logo_url)
      `)
      .eq('year', year)
      .order('sp_rating', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertTeamStats(stats: Omit<TeamStats, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('team_stats')
      .upsert(stats, { onConflict: 'team_id,year' })
      .select()
    
    if (error) throw error
    return data
  },

  // Betting Stats operations
  async getBettingStats(year: number) {
    const { data, error } = await supabase
      .from('betting_stats')
      .select(`
        *,
        teams (name, conference)
      `)
      .eq('year', year)
    
    if (error) throw error
    return data
  },

  async upsertBettingStats(stats: Omit<BettingStats, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('betting_stats')
      .upsert(stats, { onConflict: 'team_id,year' })
      .select()
    
    if (error) throw error
    return data
  }
}