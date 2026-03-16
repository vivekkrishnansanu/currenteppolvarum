import { parse } from 'node-html-parser'
import { DISTRICTS } from './districts.js'

/**
 * Parses KSEB webreport HTML and returns structured outage data per district.
 * KSEB URL: http://pse.kseb.in/Outages/webreport
 *
 * Returns: Array of outage objects:
 * {
 *   districtCode: string,
 *   section: string,       // KSEB section name
 *   fromTime: string,
 *   toTime: string,
 *   reason: string,
 *   areas: string[],
 *   rawRow: string
 * }
 */
export function parseKSEBOutages(html) {
  const root = parse(html)
  const outages = []

  const rows = root.querySelectorAll('table tr')

  for (const row of rows) {
    const cells = row.querySelectorAll('td')
    if (cells.length < 3) continue

    const cellTexts = cells.map(c => c.text.trim().replace(/\s+/g, ' '))
    const rowText = cellTexts.join(' ').toLowerCase()

    // Skip header rows
    if (rowText.includes('section') && rowText.includes('time')) continue
    if (!rowText || rowText.length < 10) continue

    // Try to identify which district this row belongs to
    let matchedDistrict = null
    for (const district of DISTRICTS) {
      if (district.ksebKeywords.some(kw => rowText.includes(kw))) {
        matchedDistrict = district
        break
      }
    }

    // Extract time pattern HH:MM or HH.MM
    const timeMatches = rowText.match(/\b(\d{1,2}[:.]\d{2})\s*(am|pm|hrs?)?\b/gi) || []

    // Extract section name (usually first meaningful cell)
    const section = cellTexts[0] || cellTexts[1] || 'Unknown section'

    // Extract reason (look for words like maintenance, fault, repair)
    const reason = cellTexts.find(t =>
      /maintenance|fault|repair|upgrade|work|extension|shifting/i.test(t)
    ) || 'Scheduled maintenance'

    // Areas: all cells that aren't time or section
    const areas = cellTexts
      .filter(t => t.length > 3 && !/^\d{1,2}[:.]\d{2}/.test(t) && t !== section)
      .slice(0, 3)

    outages.push({
      districtCode: matchedDistrict?.code || null,
      districtName: matchedDistrict?.name || null,
      section,
      fromTime: timeMatches[0] || null,
      toTime: timeMatches[1] || null,
      reason,
      areas: areas.filter(Boolean),
      rawRow: cellTexts.join(' | ')
    })
  }

  return outages
}

/**
 * Groups outages by district and returns district status map
 */
export function buildDistrictStatusMap(outages) {
  const map = {}

  // Initialize all districts as clear
  for (const d of DISTRICTS) {
    map[d.code] = {
      status: 'clear',
      label: 'No scheduled cuts',
      outages: [],
      eta: null,
      source: 'kseb-scheduled',
      fetchedAt: new Date().toISOString()
    }
  }

  // Fill in scheduled outages
  for (const outage of outages) {
    if (!outage.districtCode) continue
    const entry = map[outage.districtCode]
    entry.status = 'scheduled'
    entry.label = 'Scheduled cut'
    entry.outages.push(outage)
    // Use latest toTime as ETA
    if (outage.toTime) {
      entry.eta = `Ends ${outage.toTime}`
    }
  }

  return map
}
