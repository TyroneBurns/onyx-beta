# ONYX v1.1 — Paper Trader API/UI Fix

This patch keeps ONYX as a research-first paper trading app, but fixes the first deploy issues:

- Binance `451` errors are now handled by falling back to Coinbase Exchange public market data.
- The large green hero overlay has been removed and replaced with subtle ONYX-style cyan/emerald glow.
- Market scan copy now says public market data instead of Binance-only.
- No live exchange keys are required.
- No Northflank worker is required for this ONYX paper version.

## Stop Set & Forget Northflank

Pause or delete the old Set & Forget Northflank job so it stops eating API credits:

1. Northflank → Set-Forget project
2. Jobs
3. Select the cron/worker job
4. Disable schedule or pause/delete the job
5. Remove old API keys from runtime variables if no longer needed

## Launch tasks

1. Push this patch to `onyx-beta`
2. Redeploy Vercel
3. Open ONYX
4. Press **Research now**
5. Confirm the error card is gone and researched pairs load
6. Keep auto paper OFF until you confirm scans work cleanly
