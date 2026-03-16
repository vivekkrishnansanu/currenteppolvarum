# Current Eppolvarum ⚡
### കറന്റ് എപ്പോൾ വരും?

Kerala's real-time power outage tracker. No fake data — only verified sources.

## Data Sources

| Source | Status | What it does |
|--------|--------|-------------|
| **KSEB Scheduled Outages** | ✅ Live | Fetches `pse.kseb.in/Outages/webreport` every 5 min |
| **Cloudflare Radar** | 🔜 Soon | Internet traffic drop detection by region |
| **Social signals** | 🔜 Soon | Auto-detect "current poyi" spikes on X/Facebook |
| **Swiggy/Zomato offline** | 🔜 Soon | Restaurant cluster outage signal |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Deployment**: Vercel (1-click)
- **Backend**: Next.js API Routes (server-side KSEB proxy — no CORS issues)
- **Data refresh**: ISR (Incremental Static Regeneration) every 5 minutes

---

## Local Development

```bash
# 1. Clone and install
git clone <your-repo>
cd current-eppolvarum
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local — NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 3. Run dev server
npm run dev

# Open http://localhost:3000
```

---

## Deploy to Vercel (1-click)

```bash
npm i -g vercel
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_BASE_URL = https://currenteppolvarum.live
```

Or connect your GitHub repo to Vercel for auto-deploy on every push.

---

## How the KSEB integration works

The API route at `/api/outages`:
1. Fetches `http://pse.kseb.in/Outages/webreport` **server-side** (no CORS issues)
2. Parses the HTML table using `node-html-parser`
3. Maps outages to Kerala's 14 districts using keyword matching
4. Returns structured JSON to the frontend
5. Caches for 5 minutes (Next.js ISR)

If KSEB is down → the UI shows "Data unavailable" + direct KSEB link. **Zero fake data ever shown.**

---

## Adding the Cloudflare Radar Integration (Phase 2)

1. Get a free API token: https://dash.cloudflare.com/profile/api-tokens
2. Add to `.env.local`: `CLOUDFLARE_API_TOKEN=your_token`
3. The `/api/outages` route already has Cloudflare Radar logic — just needs the token

---

## Project Structure

```
current-eppolvarum/
├── app/
│   ├── api/
│   │   └── outages/
│   │       └── route.js       ← KSEB + Cloudflare fetch (server-side)
│   ├── components/
│   │   ├── Dashboard.jsx      ← Main UI (client component)
│   │   └── Dashboard.module.css
│   ├── lib/
│   │   ├── districts.js       ← Kerala 14 districts master data
│   │   └── parseKSEB.js       ← KSEB HTML parser
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx               ← Server component (initial data fetch)
├── .env.example
├── next.config.mjs
└── package.json
```

---

## Roadmap

- [x] KSEB scheduled cuts
- [ ] Cloudflare Radar unplanned outage detection
- [ ] Social media signal layer (X API)
- [ ] Swiggy/Zomato cluster offline detection
- [ ] Push notifications ("Current vannu!" alerts)
- [ ] Share district status via WhatsApp
- [ ] Historical outage patterns per district
- [ ] ETA prediction model (ML on historical data)

---

## License

MIT — build on this, share it, make Kerala better.
