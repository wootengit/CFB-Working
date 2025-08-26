/**
 * Team Logos Utility - Copyright-safe team logo handling
 */

import { getTeamInfo, getFallbackTeamInfo } from '../lib/teams';

/**
 * Generate SVG-based team logo placeholders
 * Uses team colors and abbreviations for copyright-safe representations
 */
export function getTeamLogoSvg(teamName: string, size: number = 48): string {
  const team = getTeamInfo(teamName) || getFallbackTeamInfo(teamName);
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${team.abbreviation}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${team.colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${team.colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#grad-${team.abbreviation})" stroke="${team.colors.secondary}" stroke-width="2"/>
      <text x="24" y="28" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="${team.colors.text}">
        ${team.abbreviation}
      </text>
    </svg>
  `;
}

/**
 * Get team logo as data URI for direct use in src attributes
 */
export function getTeamLogoDataUri(teamName: string, size: number = 48): string {
  const svg = getTeamLogoSvg(teamName, size);
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}

/**
 * Get team logo component props
 */
export function getTeamLogoProps(teamName: string, size: number = 48) {
  const team = getTeamInfo(teamName) || getFallbackTeamInfo(teamName);
  
  return {
    src: getTeamLogoDataUri(teamName, size),
    alt: `${team.name} ${team.mascot} logo`,
    width: size,
    height: size,
    style: {
      borderRadius: '50%',
      border: `2px solid ${team.colors.secondary}`,
    }
  };
}

/**
 * Legacy function export
 */
export function getTeamLogo(teamName: string, size: number = 48) {
  return getTeamLogoDataUri(teamName, size);
}

/**
 * Legacy export for existing components
 */
export const teamLogos = {
  getLogoSvg: getTeamLogoSvg,
  getLogoDataUri: getTeamLogoDataUri,
  getLogoProps: getTeamLogoProps,
  getTeamLogo
};

export default teamLogos;