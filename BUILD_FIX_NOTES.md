# ONYX v1.2 build fix

This patch fixes the Vercel build failure caused by older ONYX beta files still importing mock exports that were missing from `data/mock.ts`.

Vercel error fixed:
- `livePositions` missing
- `liveOrders` missing
- `shadowComparisons` missing
- `heroStats` missing
- `overviewKpis` missing
- `researchRuns` missing
- `latencySeries` missing

It also keeps the previous v1.1 fixes:
- Binance 451 fallback to Coinbase public market data
- mobile hero overlay removed
