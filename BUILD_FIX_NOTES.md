# ONYX v1.3 build fix

Fixes the second Vercel build issue where older beta dashboard components expected fields like
`shadowComparisons[].symbol`.

The compatibility exports in `data/mock.ts` are now typed as `any[]` and include broad legacy
fields so old pages/routes no longer block the new ONYX paper-trader build.

Also includes previous fixes:
- Binance 451 fallback to Coinbase public market data
- mobile hero overlay fix
- missing mock exports fix
