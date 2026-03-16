import { DISTRICTS } from './lib/districts.js'
import Dashboard from './components/Dashboard.jsx'

// Server component — fetches real data at request time
async function getData() {
  try {
    // In production (Vercel), this calls the internal API route
    // In dev, use localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/outages`, {
      next: { revalidate: 300 }, // ISR: refresh every 5 min
    })
    if (!res.ok) throw new Error('API failed')
    return res.json()
  } catch (err) {
    // Return empty/error state — never fake data
    return {
      districts: DISTRICTS.map(d => ({
        ...d,
        status: 'unknown',
        label: 'Data unavailable',
        outages: [],
        eta: null,
        source: 'fetch-error',
      })),
      meta: {
        fetchedAt: new Date().toISOString(),
        sources: {
          kseb: { status: 'error', error: err.message },
          cloudflare: { status: 'error' },
        },
        totalOutages: 0,
        totalScheduled: 0,
        totalClear: 0,
      },
      error: err.message,
    }
  }
}

export default async function HomePage() {
  const data = await getData()
  return <Dashboard initialData={data} />
}
