// Static Odds Preview Generator (no server required)
// Usage (PowerShell):
//   $env:CFBD_API_KEY="<your_key>"; node scripts/generate-odds-preview.mjs 2025 1
// Output: temp/odds-preview.html

import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'

const CFBD_BASE = 'https://api.collegefootballdata.com'

function headers() {
  const key = process.env.CFBD_API_KEY || ''
  const h = { Accept: 'application/json' }
  if (key) h.Authorization = `Bearer ${key}`
  return h
}

function americanToImpliedProb(moneyline) {
  if (moneyline == null || moneyline === 0) return undefined
  if (moneyline > 0) return 100 / (moneyline + 100)
  return -moneyline / (-moneyline + 100)
}

function spreadToImpliedProb(homeSpread) {
  if (homeSpread == null) return undefined
  const k = 0.165
  return 1 / (1 + Math.exp(k * homeSpread))
}

function chooseLatestLine(lines, bookmaker) {
  if (!Array.isArray(lines) || lines.length === 0) return undefined
  let cand = lines
  if (bookmaker && bookmaker.toLowerCase() !== 'consensus') {
    cand = cand.filter(l => (l?.provider || '').toLowerCase() === bookmaker.toLowerCase())
  }
  cand.sort((a, b) => new Date(b?.updated || b?.spreadUpdated || 0) - new Date(a?.updated || a?.spreadUpdated || 0))
  return cand[0] || lines[0]
}

function normalize(game, latest, year, week, seasonType) {
  const home = game?.homeTeam || game?.home_team || ''
  const away = game?.awayTeam || game?.away_team || ''
  const spread = latest?.spread ?? latest?.formattedSpread ?? undefined
  const ou = latest?.overUnder ?? latest?.total ?? undefined
  const hm = latest?.homeMoneyline ?? latest?.home_moneyline ?? undefined
  const am = latest?.awayMoneyline ?? latest?.away_moneyline ?? undefined
  return {
    id: `${year}:${week}:${home}:${away}`.toLowerCase(),
    season: year,
    week,
    seasonType,
    homeTeam: home,
    awayTeam: away,
    startDate: game?.startDate || game?.start_date,
    venue: game?.venue,
    spread: typeof spread === 'number' ? spread : undefined,
    overUnder: typeof ou === 'number' ? ou : undefined,
    homeMoneyline: typeof hm === 'number' ? hm : undefined,
    awayMoneyline: typeof am === 'number' ? am : undefined,
    impliedHomeWinPct: americanToImpliedProb(hm) ?? spreadToImpliedProb(spread),
    impliedAwayWinPct: americanToImpliedProb(am)
  }
}

function fmtML(v) { return v == null ? '—' : (v > 0 ? `+${v}` : String(v)) }
function fmtSpread(v) { return v == null ? '—' : (v > 0 ? `+${v}` : String(v)) }
function fmtPct(v) { return v == null ? '—' : `${Math.round(v * 100)}%` }

function renderHTML(lines, year, week) {
  const rows = lines.slice(0, 16).map(l => `
    <div class="row">
      <div class="team left">${escapeHtml(l.awayTeam)}</div>
      <div class="center"><span class="chip amber">${fmtSpread(l.spread)}</span></div>
      <div class="center"><span class="chip green">O/U ${l.overUnder ?? '—'}</span></div>
      <div class="center pair"><span class="chip white">${fmtML(l.awayMoneyline)}</span><span class="chip white">${fmtML(l.homeMoneyline)}</span></div>
      <div class="center"><span class="chip blue">${fmtPct(l.impliedHomeWinPct)}</span></div>
      <div class="team right">${escapeHtml(l.homeTeam)}</div>
    </div>
  `).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CFB Sportsbook Preview - Y${year} W${week}</title>
  <style>
    :root { --bg0:#0b1020; --bg1:#0a0a0a; --panel-r:14px; }
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: linear-gradient(135deg,var(--bg0),var(--bg1)); color:#e5e7eb; }
    .wrap { max-width:1200px; margin:0 auto; padding:24px; }
    .hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .title { font-weight:800; font-size:28px; letter-spacing:.02em; background:linear-gradient(135deg,#fff,#cbd5e1); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
    .meta { color:#94a3b8; font-size:12px; }
    .panel { background: rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius: var(--panel-r); padding:16px; box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06); }
    .head { display:grid; grid-template-columns: 1fr 110px 90px 140px 110px 1fr; padding: 6px 14px; color:#94a3b8; font-size:12px; }
    .row { display:grid; grid-template-columns: 1fr 110px 90px 140px 110px 1fr; align-items:center; gap:12px; padding:10px 14px; border-radius:10px; background:rgba(0,0,0,.6); border:1px solid rgba(255,255,255,.08); }
    .team.left { text-align:left; font-weight:700; }
    .team.right { text-align:right; font-weight:700; }
    .center { text-align:center; }
    .pair { display:flex; justify-content:center; gap:8px; }
    .chip { display:inline-block; padding:6px 10px; border-radius:8px; font-weight:800; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; letter-spacing:.02em; }
    .amber { color:#ffb000; background:rgba(255,176,0,.08); border:1px solid rgba(255,176,0,.25); text-shadow:0 0 10px rgba(255,176,0,.35); }
    .green { color:#46f46a; background:rgba(70,244,106,.06); border:1px solid rgba(70,244,106,.25); text-shadow:0 0 10px rgba(70,244,106,.35); }
    .white { color:#f8fafc; background:rgba(248,250,252,.06); border:1px solid rgba(248,250,252,.25); text-shadow:0 0 8px rgba(248,250,252,.25); }
    .blue { color:#60a5fa; background:rgba(96,165,250,.07); border:1px solid rgba(96,165,250,.25); text-shadow:0 0 10px rgba(96,165,250,.35); }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <div class="title">CFB Sportsbook Preview</div>
      <div class="meta">Year ${year} • Week ${week}</div>
    </div>
    <div class="panel">
      <div class="head">
        <div style="text-align:left">AWAY</div>
        <div style="text-align:center">SPREAD</div>
        <div style="text-align:center">TOTAL</div>
        <div style="text-align:center">ML A/H</div>
        <div style="text-align:center">HOME %</div>
        <div style="text-align:right">HOME</div>
      </div>
      ${rows}
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[m]))
}

function randomBetween(min, max) { return Math.random() * (max - min) + min }
function round1(n) { return Math.round(n * 10) / 10 }

function generateMockLines(year, week, count = 12) {
  const TEAMS = [
    'Alabama','Georgia','LSU','Tennessee','Auburn','Florida','Texas','Oklahoma','Ohio State','Michigan',
    'USC','Oregon','Clemson','Florida State','Penn State','Notre Dame','Utah','Texas A&M','Ole Miss','Missouri'
  ]
  const pick = () => TEAMS[Math.floor(Math.random() * TEAMS.length)]
  const lines = []
  const seen = new Set()
  while (lines.length < count) {
    let home = pick(), away = pick()
    if (home === away) continue
    const key = `${home}:${away}`
    if (seen.has(key)) continue
    seen.add(key)
    const spread = round1(randomBetween(-14, 14))
    const ou = round1(randomBetween(42, 70))
    const hm = Math.random() < 0.5 ? -Math.floor(randomBetween(110, 210)) : Math.floor(randomBetween(100, 180))
    const am = Math.random() < 0.5 ? -Math.floor(randomBetween(110, 210)) : Math.floor(randomBetween(100, 180))
    lines.push({
      id: `${year}:${week}:${home}:${away}`.toLowerCase(),
      season: year,
      week,
      seasonType: 'regular',
      homeTeam: home,
      awayTeam: away,
      startDate: undefined,
      venue: undefined,
      spread,
      overUnder: ou,
      homeMoneyline: hm,
      awayMoneyline: am,
      impliedHomeWinPct: americanToImpliedProb(hm) ?? spreadToImpliedProb(spread),
      impliedAwayWinPct: americanToImpliedProb(am)
    })
  }
  return lines
}

async function main() {
  const year = Number(process.argv[2] || 2025)
  const week = Number(process.argv[3] || 1)
  const seasonType = 'regular'

  let lines = []
  try {
    const url = new URL(`${CFBD_BASE}/lines`)
    url.searchParams.set('year', String(year))
    url.searchParams.set('week', String(week))
    url.searchParams.set('seasonType', seasonType)

    const res = await fetch(url.toString(), { headers: headers() })
    if (!res.ok) {
      const text = await res.text()
      console.warn(`CFBD /lines failed: ${res.status} ${res.statusText} ${text}`)
      lines = generateMockLines(year, week, 12)
    } else {
      const json = await res.json()
      lines = Array.isArray(json) ? json.map(g => normalize(g, chooseLatestLine(g?.lines || []), year, week, seasonType)) : []
      if (lines.length === 0) {
        console.warn('CFBD returned 0 lines, generating mock preview...')
        lines = generateMockLines(year, week, 12)
      }
    }
  } catch (err) {
    console.warn('Falling back to mock preview due to error:', err?.message || err)
    lines = generateMockLines(year, week, 12)
  }

  const html = renderHTML(lines, year, week)
  const outDir = path.join(process.cwd(), 'temp')
  const outPath = path.join(outDir, 'odds-preview.html')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(outPath, html, 'utf8')
  console.log(`✅ Wrote ${outPath} (${lines.length} rows)`) 
}

main().catch(err => {
  console.error('❌ Failed:', err?.message || err)
  process.exit(1)
})


