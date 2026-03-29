# ONYX Beta

Vercel-ready ONYX beta control centre with mocked research, shadow, live, signal, and trade data.

## What this is

This repo gives you a deployable beta for GitHub + Vercel:
- polished ONYX UI
- mock API routes under `app/api/*`
- pages for overview, research, shadow, live, signals, trades, and settings
- architecture notes for wiring in `hftbacktest`, collectors, and real execution later

## What this is not

This beta does **not** run live HFT execution on Vercel. It is the control-centre layer and a clean beta shell for:
- signal review
- backtest summaries
- shadow/live monitoring
- deployment demos
- investor/customer screenshots

## Local run

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo into Vercel
3. Framework preset: Next.js
4. Build command: `npm run build`
5. Output: leave default

No environment variables are required for the mocked beta.

## Suggested next real build steps

- replace mock data in `data/mock.ts` with real API/database reads
- connect `app/api/*` to Postgres/Timescale
- move collectors, shadow trading, and execution services off Vercel
- use this UI as the control plane for those services

## Service plan

The `services/` folder includes deployment notes for:
- market collector
- research engine
- shadow trader
- live executor
- risk engine

Those are scaffolds only in this beta.
