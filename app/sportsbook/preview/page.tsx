import React from 'react'
import {
  fetchWeeklyOdds,
  americanToImpliedProb,
  type NormalizedLine
} from '@/lib/sportsbook-odds'

function formatMoneyline(value?: number) {
  if (value === undefined) return '—'
  return value > 0 ? `+${value}` : String(value)
}

function formatSpread(value?: number) {
  if (value === undefined) return '—'
  return value > 0 ? `+${value}` : String(value)
}

function formatPct(value?: number) {
  if (value === undefined) return '—'
  return `${Math.round(value * 100)}%`
}

function Row({ line }: { line: NormalizedLine }) {
  return (
    <div
      className="row"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 110px 90px 90px 110px 1fr',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div style={{ textAlign: 'left', color: '#e5e7eb', fontWeight: 600 }}>{line.awayTeam}</div>

      <div style={{ textAlign: 'center' }}>
        <span className="chip amber">{formatSpread(line.spread)}</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span className="chip green">O/U {line.overUnder ?? '—'}</span>
      </div>

      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
        <span className="chip white">{formatMoneyline(line.awayMoneyline)}</span>
        <span className="chip white">{formatMoneyline(line.homeMoneyline)}</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span className="chip blue">{formatPct(line.impliedHomeWinPct)}</span>
      </div>

      <div style={{ textAlign: 'right', color: '#e5e7eb', fontWeight: 600 }}>{line.homeTeam}</div>
    </div>
  )
}

export default async function SportsbookPreviewPage() {
  const year = 2025
  const week = 1

  const { success, data, error } = await fetchWeeklyOdds({ year, week, seasonType: 'regular' })

  const lines: NormalizedLine[] = success ? data : []

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0b1020,#0a0a0a)' }}>
      <style>{`
        .wrap { max-width: 1200px; margin: 0 auto; padding: 24px; }
        .hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .title { font-weight:800; font-size:28px; letter-spacing:0.02em; background:linear-gradient(135deg,#fff,#cbd5e1); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .panel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06); }
        .chip { display:inline-block; padding: 6px 10px; border-radius: 8px; font-weight:700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; letter-spacing: 0.02em; }
        .amber { color:#ffb000; background:rgba(255,176,0,0.08); border:1px solid rgba(255,176,0,0.25); text-shadow: 0 0 10px rgba(255,176,0,0.35); }
        .green { color:#46f46a; background:rgba(70,244,106,0.06); border:1px solid rgba(70,244,106,0.25); text-shadow: 0 0 10px rgba(70,244,106,0.35); }
        .white { color:#f8fafc; background:rgba(248,250,252,0.06); border:1px solid rgba(248,250,252,0.25); text-shadow: 0 0 8px rgba(248,250,252,0.25); }
        .blue { color:#60a5fa; background:rgba(96,165,250,0.07); border:1px solid rgba(96,165,250,0.25); text-shadow: 0 0 10px rgba(96,165,250,0.35); }
        .subtle { color:#94a3b8; font-size:12px; }
      `}</style>

      <div className="wrap">
        <div className="hdr">
          <div className="title">CFB Sportsbook Preview</div>
          <div className="subtle">Year {year} • Week {week}</div>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 110px 90px 90px 110px 1fr',
            padding: '6px 14px',
            color: '#94a3b8',
            fontSize: 12
          }}>
            <div style={{ textAlign: 'left' }}>AWAY</div>
            <div style={{ textAlign: 'center' }}>SPREAD</div>
            <div style={{ textAlign: 'center' }}>TOTAL</div>
            <div style={{ textAlign: 'center' }}>ML A/H</div>
            <div style={{ textAlign: 'center' }}>HOME %</div>
            <div style={{ textAlign: 'right' }}>HOME</div>
          </div>

          {lines.length === 0 && (
            <div style={{ color: '#e5e7eb', padding: 18 }}>
              {error ? `Unable to load odds: ${error}` : 'No odds available yet.'}
            </div>
          )}

          {lines.slice(0, 12).map((line) => (
            <Row key={line.id} line={line} />
          ))}
        </div>
      </div>
    </div>
  )
}


