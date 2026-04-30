# ONYX v2 — Autonomous Paper Trader

ONYX is now a working paper trading app, not just a UI shell.

## What changed

- All main pages now use live ONYX paper state instead of demo data.
- Home researches markets and opens paper trades.
- Analytics reads actual paper equity, realised PnL, expectancy and profit factor.
- Models reads the active research / execution / learning layers.
- Signals reads real market candidates from the latest scan.
- Trades reads actual paper positions and trade history.
- Settings controls real app settings saved to browser localStorage.

## Autonomy

ONYX now:

- researches public markets automatically every 5 minutes
- scans a configurable crypto universe
- selects pairs by liquidity, momentum and volatility
- applies trend / volatility / structure filters
- opens paper trades automatically when auto paper is enabled
- marks positions to market on each scan
- closes positions on stop loss or take profit
- learns from recent closed paper trades
- tightens risk, quality and confidence if expectancy is weak
- cautiously expands only if paper expectancy and profit factor improve

## Important limitation

This version runs the autonomous loop in the browser while the app is open.

For true 24/7 unattended automation, the next backend step is:
- persistent database
- scheduled worker/cron
- server-side trade engine
- audit logs
- live exchange execution adapter

Do not connect real funds until paper results pass the launch gate.

## Real-money gate

Minimum before live:
- 100+ closed paper trades
- positive expectancy
- profit factor > 1.15
- controlled drawdown
- no single pair carrying all profit
- manual approval
