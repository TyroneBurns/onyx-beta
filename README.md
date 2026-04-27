# ONYX v1 — Research-first paper trading app

This update turns the ONYX UI sandbox into a working paper trading app.

## What changed

- Set & Forget is treated as a failed/paused edge, not a live strategy.
- ONYX becomes the parent trading research platform.
- The app now researches the market using Binance public data.
- ONYX picks pairs from a defined USDT universe by liquidity, volatility and momentum.
- Signals are filtered through trend, volatility and structure checks.
- Paper trades are stored in browser localStorage for quick testing.
- No exchange API keys are required.
- No Northflank worker is required for this version.

## Main files added

- `components/onyx/paper-trader.tsx`
- `app/api/market/snapshot/route.ts`
- `lib/onyx-engine.ts`
- `lib/onyx-types.ts`
- `LAUNCH_TASKS.md`
- `NORTHFLANK_STOP_SET_FORGET.md`

## How pair selection works

ONYX scans a configured universe, for example:

`BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT,ADAUSDT,DOGEUSDT,AVAXUSDT,LINKUSDT,SUIUSDT`

It ranks pairs by:

- liquidity
- 24h momentum
- volatility range
- whether current candles pass trend / ATR / structure filters

It does not assume BTC, ETH and SOL are always the best trades.

## Important

This is still paper-only. Do not connect live funds until paper metrics prove a real edge.
