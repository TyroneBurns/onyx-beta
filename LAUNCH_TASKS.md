# ONYX launch tasks

## Immediate

- [ ] Stop/pause old Set & Forget Northflank job so it stops using API credits.
- [ ] Remove any old paid API keys from Set & Forget runtime variables.
- [ ] Push ONYX v2 autonomous paper trader.
- [ ] Redeploy Vercel.
- [ ] Open ONYX Home and confirm market research loads.
- [ ] Open Analytics, Models, Signals, Trades and Settings and confirm no demo data remains.
- [ ] Keep live trading keys disconnected.
- [ ] Keep auto paper OFF until you confirm scans and manual paper trades work.

## Paper test

- [ ] Press Research now.
- [ ] Open one manual paper trade from a READY signal.
- [ ] Confirm the trade appears on Trades.
- [ ] Confirm Analytics updates.
- [ ] Turn Auto paper ON only after manual trade flow is confirmed.
- [ ] Leave ONYX open if you want the browser-based 5-minute research loop to run.
- [ ] Review results after 30, 60 and 100 closed trades.

## Pass criteria before live

- [ ] 100+ closed paper trades.
- [ ] Expectancy positive.
- [ ] Profit factor above 1.15.
- [ ] Win rate and payoff ratio stable.
- [ ] Drawdown acceptable.
- [ ] Best pair and weakest pair reviewed.
- [ ] Strategy does not rely on one lucky pair.
- [ ] Manual approval given before live mode.

## Future backend tasks

- [ ] Add Supabase tables for paper state, scans, positions and trades.
- [ ] Add server-side scheduled scan every 5 minutes.
- [ ] Add audit log table.
- [ ] Add strategy pass/fail gate.
- [ ] Add exchange adapter only after paper edge is proven.
