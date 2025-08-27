// Standalone Sportsbook Odds Module (Self-contained)
// Do NOT import from local app modules; safe to drop-in anywhere.

/*
  Overview
  - Fetch college football betting lines from CFBD
  - Normalize to a compact, predictable shape
  - Compute implied probabilities from spreads and moneylines
  - Provide a tiny live-update simulator for UI shimmer/testing

  Usage example (in your own code):
    import { fetchWeeklyOdds, computeImpliedFromMoneyline } from '@/lib/sportsbook-odds'

    const res = await fetchWeeklyOdds({ year: 2025, week: 1 })
    if (res.success) {
      console.log(res.data[0])
    }

  Environment:
    - Requires CFBD_API_KEY set in process.env when executed server-side
*/

export type SeasonType = 'regular' | 'postseason';

export interface FetchWeeklyOddsParams {
  year: number;
  week: number;
  seasonType?: SeasonType;
  team?: string;
  conference?: string;
  bookmaker?: string; // e.g., 'consensus' | 'Caesars' | 'DraftKings' | etc.
}

export interface NormalizedLine {
  id: string; // composite unique id year:week:home:away
  season: number;
  week: number;
  seasonType: SeasonType;
  homeTeam: string;
  awayTeam: string;
  startDate?: string;
  venue?: string;

  spread?: number; // spread relative to home (home negative means home favored)
  overUnder?: number;
  homeMoneyline?: number; // American odds
  awayMoneyline?: number; // American odds

  // Derived
  impliedHomeWinPct?: number; // 0..1
  impliedAwayWinPct?: number; // 0..1
}

export interface FetchWeeklyOddsResult {
  success: boolean;
  data: NormalizedLine[];
  error?: string;
  source?: string;
}

const CFBD_BASE = 'https://api.collegefootballdata.com';

function getAuthHeaders(): HeadersInit {
  const key = process.env.CFBD_API_KEY || '';
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (key) headers.Authorization = `Bearer ${key}`;
  return headers;
}

// Utilities ---------------------------------------------------------------

export function americanToImpliedProb(moneyline: number | undefined | null): number | undefined {
  if (moneyline === undefined || moneyline === null) return undefined;
  if (moneyline === 0) return undefined;
  if (moneyline > 0) {
    return 100 / (moneyline + 100);
  }
  return -moneyline / (-moneyline + 100);
}

// Very rough spread->probability mapping using normal-approx of margin.
// For production modeling, replace with your calibrated distribution.
export function spreadToImpliedProb(homeSpread: number | undefined | null): number | undefined {
  if (homeSpread === undefined || homeSpread === null) return undefined;
  // Negative spread means home is favored. Convert to prob via logistic fit
  const k = 0.165; // slope tuned for reasonable S-curve (heuristic)
  const probHome = 1 / (1 + Math.exp(k * homeSpread));
  return probHome;
}

function buildId(year: number, week: number, home: string, away: string) {
  return `${year}:${week}:${home}:${away}`.toLowerCase();
}

function chooseLatestLine(lines: any[], bookmaker?: string) {
  if (!Array.isArray(lines) || lines.length === 0) return undefined;
  let candidate = lines as any[];
  if (bookmaker && bookmaker.toLowerCase() !== 'consensus') {
    candidate = candidate.filter((l) => (l?.provider || '').toLowerCase() === bookmaker.toLowerCase());
  }
  candidate.sort((a, b) => new Date(b.updated || b.spreadUpdated || 0).getTime() - new Date(a.updated || a.spreadUpdated || 0).getTime());
  return candidate[0] || lines[0];
}

function normalizeFromCFBD(game: any, latest: any, year: number, week: number, seasonType: SeasonType): NormalizedLine {
  const home = game?.homeTeam || game?.home_team || '';
  const away = game?.awayTeam || game?.away_team || '';

  // Latest structure commonly has spread, overUnder, moneylines
  const spread = latest?.spread ?? latest?.formattedSpread ?? undefined;
  const ou = latest?.overUnder ?? latest?.total ?? undefined;
  const hm = latest?.homeMoneyline ?? latest?.home_moneyline ?? undefined;
  const am = latest?.awayMoneyline ?? latest?.away_moneyline ?? undefined;

  const impliedHomeWinPct = americanToImpliedProb(hm) ?? spreadToImpliedProb(spread as number);
  const impliedAwayWinPct = americanToImpliedProb(am);

  return {
    id: buildId(year, week, home, away),
    season: year,
    week,
    seasonType,
    homeTeam: home,
    awayTeam: away,
    startDate: game?.startDate || game?.start_date || undefined,
    venue: game?.venue || undefined,
    spread: typeof spread === 'number' ? spread : undefined,
    overUnder: typeof ou === 'number' ? ou : undefined,
    homeMoneyline: typeof hm === 'number' ? hm : undefined,
    awayMoneyline: typeof am === 'number' ? am : undefined,
    impliedHomeWinPct,
    impliedAwayWinPct,
  };
}

// Public API --------------------------------------------------------------

export async function fetchWeeklyOdds(params: FetchWeeklyOddsParams): Promise<FetchWeeklyOddsResult> {
  const { year, week, seasonType = 'regular', conference, team, bookmaker } = params;
  try {
    const url = new URL(`${CFBD_BASE}/lines`);
    url.searchParams.set('year', String(year));
    url.searchParams.set('week', String(week));
    url.searchParams.set('seasonType', seasonType);
    if (conference) url.searchParams.set('conference', conference);
    if (team) url.searchParams.set('team', team);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, data: [], error: text || res.statusText, source: 'cfbd' };
    }

    const json = await res.json();
    const normalized: NormalizedLine[] = Array.isArray(json)
      ? json.map((g) => {
          const latest = chooseLatestLine(g?.lines || [], bookmaker);
          return normalizeFromCFBD(g, latest, year, week, seasonType);
        })
      : [];

    return { success: true, data: normalized, source: 'cfbd' };
  } catch (err: any) {
    return { success: false, data: [], error: err?.message || 'Unknown error', source: 'cfbd' };
  }
}

// Simple odds update simulator -------------------------------------------

export interface OddsUpdateEvent {
  id: string; // NormalizedLine.id
  field: 'spread' | 'overUnder' | 'homeMoneyline' | 'awayMoneyline';
  value: number;
  timestamp: number;
}

export function* oddsJitterGenerator(line: NormalizedLine, seed: number = Date.now()): Generator<OddsUpdateEvent> {
  let x = seed % 2147483647;
  const rand = () => (x = (x * 48271) % 2147483647) / 2147483647;
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  // cycle indefinitely; consumer can break when desired
  while (true) {
    const field = pick(['spread', 'overUnder', 'homeMoneyline', 'awayMoneyline']);
    const magnitude = field === 'spread' ? (rand() - 0.5) * 1.0 : (rand() - 0.5) * 20;
    const base = (line as any)[field] ?? 0;
    const value = Math.round((base + magnitude) * 10) / 10;
    yield { id: line.id, field: field as any, value, timestamp: Date.now() };
  }
}

export function applyOddsUpdate(line: NormalizedLine, evt: OddsUpdateEvent): NormalizedLine {
  if (evt.id !== line.id) return line;
  const updated: NormalizedLine = { ...line } as any;
  (updated as any)[evt.field] = evt.value;
  // Recompute implied probabilities if moneylines or spread moved
  if (evt.field === 'homeMoneyline' || evt.field === 'awayMoneyline') {
    updated.impliedHomeWinPct = americanToImpliedProb(updated.homeMoneyline ?? undefined) ?? spreadToImpliedProb(updated.spread);
    updated.impliedAwayWinPct = americanToImpliedProb(updated.awayMoneyline ?? undefined);
  } else if (evt.field === 'spread') {
    updated.impliedHomeWinPct = americanToImpliedProb(updated.homeMoneyline ?? undefined) ?? spreadToImpliedProb(updated.spread);
  }
  return updated;
}

export default {
  fetchWeeklyOdds,
  americanToImpliedProb,
  spreadToImpliedProb,
  oddsJitterGenerator,
  applyOddsUpdate,
};


