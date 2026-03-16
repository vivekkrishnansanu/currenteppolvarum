import { NextResponse } from 'next/server'
import { parseKSEBOutages, buildDistrictStatusMap } from '../../lib/parseKSEB.js'
import { DISTRICTS } from '../../lib/districts.js'

export const revalidate = 300

const KSEB_URL     = 'http://pse.kseb.in/Outages/webreport'
const CF_RADAR_URL = 'https://api.cloudflare.com/client/v4/radar/annotations/outages?format=json&limit=50&dateRange=7d'

// Google News RSS — targeted queries for Kerala power outages (free, no key)
const NEWS_RSS_QUERIES = [
  'KSEB power cut kerala',
  'kerala power outage current poyi',
]

// Power outage keywords — Malayalam transliteration + English
const OUTAGE_KEYWORDS = [
  'current poyi', 'light poyi', 'current illa', 'current illā',
  'current varunnilla', 'current varunnila', 'current varilla',
  'power cut', 'power outage', 'no power', 'light cut',
  'kseb', 'current cut',
]

export async function GET() {
  const results = await Promise.allSettled([
    fetchKSEB(),
    fetchCloudflareRadar(),
    fetchKeralaNewsRSS(),
  ])

  const [ksebResult, cfResult, newsResult] = results

  // Build base status map from KSEB
  let districtMap = {}
  let ksebStatus = 'error'
  let ksebError = null

  if (ksebResult.status === 'fulfilled' && ksebResult.value.ok) {
    districtMap = buildDistrictStatusMap(ksebResult.value.outages)
    ksebStatus = 'ok'
  } else {
    ksebError = ksebResult.reason?.message || 'KSEB fetch failed'
    for (const d of DISTRICTS) {
      districtMap[d.code] = {
        status: 'unknown', label: 'Data unavailable',
        outages: [], eta: null,
        source: 'kseb-fetch-failed', fetchedAt: new Date().toISOString()
      }
    }
  }

  // Layer Cloudflare Radar
  let cfStatus = 'error'
  let cfAnomalyCount = 0
  if (cfResult.status === 'fulfilled' && cfResult.value.anomalies) {
    cfStatus = 'ok'
    cfAnomalyCount = cfResult.value.anomalies.length
    layerCloudflareData(districtMap, cfResult.value.anomalies)
  }

  // Layer Kerala news RSS
  let newsStatus = 'error'
  let newsTotal = 0
  if (newsResult.status === 'fulfilled' && newsResult.value.signals) {
    newsStatus = newsResult.value.status
    newsTotal = newsResult.value.total || 0
    layerNewsSignals(districtMap, newsResult.value.signals)
  }

  const districts = DISTRICTS.map(d => ({ ...d, ...districtMap[d.code] }))

  return NextResponse.json({
    districts,
    meta: {
      fetchedAt: new Date().toISOString(),
      sources: {
        kseb:      { status: ksebStatus, error: ksebError, url: KSEB_URL },
        cloudflare: { status: cfStatus, anomalyCount: cfAnomalyCount },
        news:      { status: newsStatus, total: newsTotal },
      },
      totalOutages:   districts.filter(d => d.status === 'outage').length,
      totalScheduled: districts.filter(d => d.status === 'scheduled').length,
      totalClear:     districts.filter(d => d.status === 'clear').length,
    }
  })
}

// ── KSEB ────────────────────────────────────────────────────
async function fetchKSEB() {
  const res = await fetch(KSEB_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CurrentEppolvarum/1.0)', Accept: 'text/html' },
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error(`KSEB responded with ${res.status}`)
  const outages = parseKSEBOutages(await res.text())
  return { ok: true, outages }
}

// ── CLOUDFLARE RADAR ────────────────────────────────────────
async function fetchCloudflareRadar() {
  const headers = { 'Content-Type': 'application/json' }
  if (process.env.CLOUDFLARE_API_TOKEN) headers['Authorization'] = `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`

  const res = await fetch(CF_RADAR_URL, { headers, next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`Cloudflare Radar ${res.status}`)

  const json = await res.json()
  if (!json?.success) throw new Error('Cloudflare Radar API error')

  // Filter annotations that include India ('IN') in their locations
  const anomalies = (json?.result?.annotations || []).filter(a =>
    a.locations?.includes('IN') ||
    a.locationsDetails?.some(l => l.alpha2?.toUpperCase() === 'IN')
  )
  return { anomalies }
}

// ── KERALA NEWS RSS ──────────────────────────────────────────
// Google News RSS search — free, no API key, works server-side.
// Returns KSEB + power cut stories from all Kerala news outlets.
const NEWS_MAX_AGE_MS = 48 * 60 * 60 * 1000 // 48 hours

async function fetchKeralaNewsRSS() {
  const allArticles = [] // { title, link, source, pubDate }
  const now = Date.now()

  await Promise.allSettled(
    NEWS_RSS_QUERIES.map(async (query) => {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CurrentEppolvarum/1.0)' },
          next: { revalidate: 300 },
        })
        if (!res.ok) return

        const xml = await res.text()
        const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
        for (const item of items) {
          const titleMatch  = item.match(/<title>([\s\S]*?)<\/title>/)
          const linkMatch   = item.match(/<link>([\s\S]*?)<\/link>/)
          const sourceMatch = item.match(/<source[^>]*>([\s\S]*?)<\/source>/)
          const pubMatch    = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)

          // Skip articles older than 48 hours
          if (pubMatch) {
            const age = now - new Date(pubMatch[1].trim()).getTime()
            if (age > NEWS_MAX_AGE_MS) continue
          }

          if (titleMatch) {
            allArticles.push({
              title:   titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
              link:    linkMatch?.[1]?.trim() || '',
              source:  sourceMatch?.[1]?.trim() || '',
              pubDate: pubMatch?.[1]?.trim() || '',
            })
          }
        }
      } catch { /* skip */ }
    })
  )

  // Signals: district code → array of matching articles
  const signals = {}
  let total = 0
  const seen = new Set()

  for (const article of allArticles) {
    if (seen.has(article.title)) continue
    seen.add(article.title)

    const text = article.title.toLowerCase()
    if (!OUTAGE_KEYWORDS.some(kw => text.includes(kw)) && !text.includes('kseb')) continue

    total++

    // Map to district — also add to a general 'ALL' bucket for non-district articles
    let mapped = false
    for (const d of DISTRICTS) {
      if (d.ksebKeywords.some(k => text.includes(k))) {
        if (!signals[d.code]) signals[d.code] = []
        signals[d.code].push(article)
        mapped = true
        break
      }
    }
    // Non-district articles go to ALL so every district can show them
    if (!mapped) {
      if (!signals['ALL']) signals['ALL'] = []
      signals['ALL'].push(article)
    }
  }

  return { signals, status: 'ok', total }
}

// ── LAYERS ───────────────────────────────────────────────────
function layerCloudflareData(districtMap, anomalies) {
  if (anomalies.length === 0) return
  const note = anomalies.length === 1
    ? `India internet anomaly: ${anomalies[0].description || 'unusual traffic drop'}`
    : `${anomalies.length} India internet anomalies detected`
  for (const code of Object.keys(districtMap)) {
    districtMap[code].cfAnomalyDetected = true
    districtMap[code].cfAnomalyNote = note
  }
}

function layerNewsSignals(districtMap, signals) {
  const general = signals['ALL'] || []
  for (const code of Object.keys(districtMap)) {
    const districtArticles = signals[code] || []
    const articles = [...districtArticles, ...general]
    if (articles.length === 0) continue
    districtMap[code].newsArticles = articles
    districtMap[code].newsMentions = articles.length
    if (articles.length >= 2 && districtMap[code].status === 'clear') {
      districtMap[code].newsAlert = true
    }
  }
}

