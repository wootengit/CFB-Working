/**
 * Team Colors Utility - Re-exports from lib/teams.ts for backward compatibility
 */

import { 
  getTeamInfo,
  getFallbackTeamInfo,
  type TeamInfo
} from '../lib/teams';

// Re-export everything
export { 
  getTeamInfo,
  getFallbackTeamInfo,
  type TeamInfo
};

// Legacy exports for existing components
export const teamColors = {};
export const conferenceColors = {};

// Additional legacy function exports
export function getTeamColors(teamName: string) {
  const team = getTeamInfo(teamName);
  return team ? team.colors : { primary: '#374151', secondary: '#6B7280', text: '#FFFFFF' };
}

export function getTeamGradient(teamName: string) {
  const colors = getTeamColors(teamName);
  return `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
}