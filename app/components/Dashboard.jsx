'use client'
import { useState, useEffect, useCallback } from 'react'
import styles from './Dashboard.module.css'
import { LOCALITY_MAP } from '../lib/localities.js'

const STATUS_CONFIG = {
  outage:    { color: 'var(--red)',   bg: 'var(--red-bg)',   border: 'var(--red-b)',   label: 'Outage',    dotAnim: true  },
  scheduled: { color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber-b)', label: 'Scheduled', dotAnim: false },
  clear:     { color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-b)', label: 'Clear',     dotAnim: false },
  unknown:   { color: 'var(--text3)', bg: 'var(--bg3)',      border: 'var(--border)',  label: 'Unknown',   dotAnim: false },
}

export default function Dashboard({ initialData }) {
  const [data, setData]               = useState(initialData)
  const [selected, setSelected]       = useState(null)
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [secAgo, setSecAgo]           = useState(0)

  // Tick every second for "X seconds ago" display
  useEffect(() => {
    const t = setInterval(() => setSecAgo(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [lastRefresh])

  // Refresh every 5 minutes
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/outages')
      if (res.ok) {
        const fresh = await res.json()
        setData(fresh)
        setLastRefresh(new Date())
        setSecAgo(0)
        // Update selected district detail if open
        if (selected) {
          const updated = fresh.districts.find(d => d.code === selected.code)
          if (updated) setSelected(updated)
        }
      }
    } catch (_) {}
    setLoading(false)
  }, [selected])

  useEffect(() => {
    const t = setInterval(refresh, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [refresh])

  const districts = data.districts || []
  // Resolve locality → district code (e.g. "vazhakkala" → "EKM")
  const localityMatch = search
    ? LOCALITY_MAP[search.toLowerCase().trim()]
    : null

  const filtered = search
    ? districts.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.ml?.includes(search) ||
        d.outages?.some(o => o.section?.toLowerCase().includes(search.toLowerCase())) ||
        d.outages?.some(o => o.areas?.some(a => a.toLowerCase().includes(search.toLowerCase()))) ||
        (localityMatch && d.code === localityMatch)
      )
    : districts

  const meta = data.meta || {}
  const isKSEBLive    = meta.sources?.kseb?.status === 'ok'
  const isCFLive      = meta.sources?.cloudflare?.status === 'ok'
  const isNewsLive     = meta.sources?.news?.status === 'ok'
  const fetchedTime   = meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'

  function timeAgo() {
    if (secAgo < 60) return `${secAgo}s ago`
    if (secAgo < 3600) return `${Math.floor(secAgo / 60)}m ago`
    return `${Math.floor(secAgo / 3600)}h ago`
  }

  return (
    <div className={styles.root}>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <BoltIcon />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoEn}>Current Eppolvarum</span>
            <span className={styles.logoMl}>കറന്റ് എപ്പോൾ വരും?</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.livePill} data-live={isKSEBLive}>
            <span className={styles.liveDot} data-live={isKSEBLive} />
            <span>{isKSEBLive ? timeAgo() : 'Connecting...'}</span>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={refresh}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshIcon spinning={loading} />
          </button>
        </div>
      </header>

      {/* HERO */}
      <div className={styles.hero}>
        <h1 className={styles.heroQ}>കറന്റ് എപ്പോൾ വരും?</h1>
        <p className={styles.heroSub}>Kerala power outage tracker · Real data from KSEB</p>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            className={styles.searchInput}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search district, section or area..."
            autoComplete="off"
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* SUMMARY STRIP */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryNum} style={{ color: 'var(--red)' }}>
            {meta.totalOutages ?? '—'}
          </div>
          <div className={styles.summaryLabel}>Outages</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryNum} style={{ color: 'var(--amber)' }}>
            {meta.totalScheduled ?? '—'}
          </div>
          <div className={styles.summaryLabel}>Scheduled cuts</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryNum} style={{ color: 'var(--green)' }}>
            {meta.totalClear ?? '—'}
          </div>
          <div className={styles.summaryLabel}>All clear</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryNum} style={{ color: 'var(--text2)' }}>14</div>
          <div className={styles.summaryLabel}>Districts</div>
        </div>
      </div>

      <div className={styles.main}>

        {/* DATA SOURCE BANNER */}
        <DataSourceBanner meta={meta} fetchedTime={fetchedTime} />

        {/* DETAIL PANEL */}
        {selected && (
          <DetailPanel
            district={selected}
            onClose={() => setSelected(null)}
          />
        )}

        {/* DISTRICT GRID */}
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>
            {search
              ? localityMatch
                ? `Showing district for "${search}"`
                : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
              : 'All 14 Districts'}
          </p>
          {isKSEBLive && (
            <p className={styles.sectionMeta}>Last updated {fetchedTime}</p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className={styles.noResults}>No districts match your search</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(d => (
              <DistrictCard
                key={d.code}
                district={d}
                isSelected={selected?.code === d.code}
                onClick={() => setSelected(selected?.code === d.code ? null : d)}
              />
            ))}
          </div>
        )}

        {/* HOW IT WORKS */}
        <HowItWorks ksebLive={isKSEBLive} cfLive={isCFLive} newsLive={isNewsLive} />

      </div>

      <footer className={styles.footer}>
        <p>
          Built for Kerala ·{' '}
          <a href="http://pse.kseb.in/Outages/webreport" target="_blank" rel="noopener">
            KSEB Source
          </a>{' '}
          ·{' '}
          <a href="https://radar.cloudflare.com" target="_blank" rel="noopener">
            Cloudflare Radar
          </a>
        </p>
        <p className={styles.footerSub}>
          Not affiliated with KSEB · Data refreshes every 5 minutes
        </p>
      </footer>

    </div>
  )
}

// ── DISTRICT CARD ────────────────────────────────────────────
function DistrictCard({ district, isSelected, onClick }) {
  const cfg = STATUS_CONFIG[district.status] || STATUS_CONFIG.unknown
  const hasOutages = district.outages?.length > 0

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardActive : ''}`}
      style={isSelected ? { borderColor: cfg.color } : {}}
      onClick={onClick}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardName}>{district.name}</span>
        <span
          className={styles.statusDot}
          style={{
            background: cfg.color,
            animation: cfg.dotAnim ? 'pulse-dot 1.5s infinite' : 'none'
          }}
        />
      </div>
      <div className={styles.cardMl}>{district.ml}</div>
      <span
        className={styles.badge}
        style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        {cfg.label}
      </span>
      {hasOutages && district.eta && (
        <div className={styles.cardEta}>{district.eta}</div>
      )}
      {district.outages?.length > 0 && (
        <div className={styles.cardCount}>
          {district.outages.length} section{district.outages.length > 1 ? 's' : ''}
        </div>
      )}
      {district.newsAlert && (
        <div className={styles.alertBadge}>⚠ Unconfirmed reports</div>
      )}
    </div>
  )
}

// ── DETAIL PANEL ─────────────────────────────────────────────
function DetailPanel({ district, onClose }) {
  const cfg = STATUS_CONFIG[district.status] || STATUS_CONFIG.unknown
  const outages = district.outages || []

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>{district.name}</h2>
          <p className={styles.panelMl}>{district.ml}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className={styles.badge}
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 13 }}
          >
            {cfg.label}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
      </div>

      <div className={styles.panelBody}>
        {district.status === 'clear' && (
          <div className={styles.etaBox} style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <div className={styles.etaLabel} style={{ color: cfg.color }}>Status</div>
            <div className={styles.etaValue} style={{ color: cfg.color }}>Power available</div>
            <div className={styles.etaSub} style={{ color: cfg.color }}>No scheduled cuts found in KSEB portal</div>
          </div>
        )}

        {district.status === 'scheduled' && outages.length > 0 && (
          <>
            <div className={styles.etaBox} style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <div className={styles.etaLabel} style={{ color: cfg.color }}>Scheduled end</div>
              <div className={styles.etaValue} style={{ color: cfg.color }}>
                {district.eta || 'See KSEB portal'}
              </div>
              <div className={styles.etaSub} style={{ color: cfg.color }}>
                {outages.length} section{outages.length > 1 ? 's' : ''} affected
              </div>
            </div>

            <div className={styles.outagesList}>
              {outages.map((o, i) => (
                <div key={i} className={styles.outageItem}>
                  <div className={styles.outageSection}>
                    <span className={styles.dot} style={{ background: cfg.color }} />
                    {o.section}
                  </div>
                  {o.fromTime && o.toTime && (
                    <div className={styles.outageTime}>
                      {o.fromTime} → {o.toTime}
                    </div>
                  )}
                  {o.reason && (
                    <div className={styles.outageReason}>{o.reason}</div>
                  )}
                  {o.areas?.length > 0 && (
                    <div className={styles.areasList}>
                      {o.areas.map((a, j) => (
                        <span key={j} className={styles.areaTag}>{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {district.status === 'outage' && (
          <div className={styles.etaBox} style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <div className={styles.etaLabel} style={{ color: cfg.color }}>Estimated restoration</div>
            <div className={styles.etaValue} style={{ color: cfg.color }}>
              {district.eta || 'Under investigation'}
            </div>
            <div className={styles.etaSub} style={{ color: cfg.color }}>
              Detected via internet traffic anomaly
            </div>
          </div>
        )}

        {district.status === 'unknown' && (
          <div className={styles.etaBox} style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <div className={styles.etaLabel} style={{ color: 'var(--text2)' }}>Data unavailable</div>
            <div className={styles.etaSub} style={{ color: 'var(--text2)', marginTop: 4 }}>
              Could not fetch KSEB data. Check{' '}
              <a href="http://pse.kseb.in/Outages/webreport" target="_blank" rel="noopener">
                KSEB portal directly
              </a>
            </div>
          </div>
        )}

        {/* SIGNALS */}
        <div className={styles.signalsSection}>
          <div className={styles.signalsTitle}>Live signals</div>

          <div className={styles.signalRow}>
            <span className={styles.signalIcon}>🌐</span>
            <span className={styles.signalLabel}>Cloudflare Radar <span style={{ fontWeight: 400, fontSize: 10, color: 'var(--text3)' }}>(India-wide)</span></span>
            <span className={styles.signalVal} style={{ color: district.cfAnomalyDetected ? 'var(--amber)' : 'var(--text3)' }}>
              {district.cfAnomalyDetected ? district.cfAnomalyNote : 'No anomaly detected'}
            </span>
          </div>

          <div className={styles.signalRow}>
            <span className={styles.signalIcon}>📰</span>
            <span className={styles.signalLabel}>Kerala News</span>
            <span className={styles.signalVal} style={{ color: district.newsMentions >= 2 ? 'var(--amber)' : 'var(--text3)' }}>
              {district.newsMentions
                ? `${district.newsMentions} outage article${district.newsMentions > 1 ? 's' : ''} in news`
                : 'No outage news found'}
            </span>
          </div>

          {district.newsArticles?.length > 0 && (
            <div className={styles.newsList}>
              {district.newsArticles.slice(0, 5).map((a, i) => (
                <a
                  key={i}
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newsItem}
                >
                  <span className={styles.newsTitle}>{a.title}</span>
                  <span className={styles.newsSource}>
                    {a.source && `${a.source} · `}
                    {a.pubDate ? new Date(a.pubDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </a>
              ))}
            </div>
          )}


        </div>

        <div className={styles.sourceRow}>
          <InfoIcon />
          <span>
            {district.source === 'kseb-scheduled'
              ? 'Source: KSEB Scheduled Outages Portal — verified real-time data'
              : district.source === 'kseb-fetch-failed'
              ? 'Source: KSEB fetch failed — check portal directly'
              : `Source: ${district.source || 'Unknown'}`}
          </span>
        </div>

        <a
          href="http://pse.kseb.in/Outages/webreport"
          target="_blank"
          rel="noopener"
          className={styles.ksebLink}
        >
          View on KSEB portal →
        </a>
      </div>
    </div>
  )
}

// ── DATA SOURCE BANNER ───────────────────────────────────────
function DataSourceBanner({ meta, fetchedTime }) {
  const ksebOk = meta.sources?.kseb?.status === 'ok'
  const error  = meta.sources?.kseb?.error

  if (ksebOk) {
    return (
      <div className={styles.banner} data-type="success">
        <TickIcon color="var(--green)" />
        <span>
          Live KSEB data · Fetched at {fetchedTime} · Refreshes every 5 minutes
        </span>
      </div>
    )
  }

  return (
    <div className={styles.banner} data-type="warning">
      <WarnIcon />
      <span>
        <strong>KSEB portal unreachable.</strong>{' '}
        {error || 'Check your connection or visit the'}{' '}
        <a href="http://pse.kseb.in/Outages/webreport" target="_blank" rel="noopener">
          KSEB portal directly
        </a>.
        {' '}No fake data is shown.
      </span>
    </div>
  )
}

// ── HOW IT WORKS ─────────────────────────────────────────────
function HowItWorks({ ksebLive, cfLive, newsLive }) {
  return (
    <div className={styles.howSection}>
      <p className={styles.howTitle}>How we detect outages</p>
      <div className={styles.sourcesGrid}>
        <SourceItem
          live={ksebLive}
          name="KSEB Scheduled Outages Portal"
          url="http://pse.kseb.in/Outages/webreport"
          icon="⚡"
          points={[
            'Direct scrape of pse.kseb.in — the official KSEB source',
            'Covers all 14 Kerala districts with section-level detail',
            'Shows affected areas, outage time and reason',
            'Refreshed every 5 minutes automatically',
          ]}
        />
        <SourceItem
          live={cfLive}
          name="Cloudflare Radar"
          url="https://radar.cloudflare.com"
          icon="📡"
          points={[
            'Monitors annotated internet outages across India (country-level, not Kerala-specific)',
            'Flags events like ISP disruptions, election shutdowns, or major infrastructure failures',
            'Acts as a secondary signal — if India has a major outage, Kerala may be affected too',
            'Cannot pinpoint district or state — shown as context for all 14 districts equally',
          ]}
        />
        <SourceItem
          live={newsLive}
          name="Kerala News RSS"
          url="https://news.google.com/rss/search?q=KSEB+power+cut+kerala&hl=en-IN&gl=IN"
          icon="📰"
          points={[
            'Scans Google News for KSEB and power cut stories',
            'Covers Mathrubhumi, Manorama, The Hindu and more',
            'Only shows articles published in the last 48 hours',
            'Helps surface unplanned outages not yet on KSEB portal',
          ]}
        />
      </div>
      <p className={styles.howNote}>
        No data is fabricated. If a source is unreachable, the app shows "unavailable" honestly rather than guessing. All three sources are checked independently on every refresh.
      </p>
    </div>
  )
}

function SourceItem({ live, soon, name, url, icon, points }) {
  return (
    <div className={styles.sourceItem}>
      <div className={styles.sourceIcon}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div className={styles.sourceName}>
          {url ? <a href={url} target="_blank" rel="noopener" className={styles.sourceNameLink}>{name}</a> : name}
          {live && <span className={styles.liveTag}>Live</span>}
          {soon && <span className={styles.soonTag}>Soon</span>}
        </div>
        {points && (
          <ul className={styles.sourcePoints}>
            {points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

// ── ICONS ────────────────────────────────────────────────────
function BoltIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path d="M10 1L3 10h6l-3 7 10-9H9l1-7z" fill="var(--amber)" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
      <circle cx="6" cy="6" r="4.5" stroke="#555" strokeWidth="1.5" />
      <path d="M10 10L13.5 13.5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function RefreshIcon({ spinning }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
      style={{ animation: spinning ? 'spin 0.8s linear infinite' : 'none' }}>
      <path d="M13 7.5A5.5 5.5 0 012.5 10" stroke="var(--text2)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 7.5A5.5 5.5 0 0112.5 5" stroke="var(--text2)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 2.5l1 2.5-2.5 1" stroke="var(--text2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 12.5l-1-2.5 2.5-1" stroke="var(--text2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="6" cy="6" r="5" stroke="var(--text3)" strokeWidth="1" />
      <path d="M6 4v2.5M6 8v.3" stroke="var(--text3)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
function WarnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="7" cy="7" r="6" stroke="var(--amber)" strokeWidth="1.3" />
      <path d="M7 4v3M7 9.5v.5" stroke="var(--amber)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function TickIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1.3" />
      <path d="M4.5 7l2 2 3-3" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
