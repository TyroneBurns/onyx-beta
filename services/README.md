These folders are placeholders for the non-Vercel parts of the stack.

- market-collector: websocket and raw event ingestion
- research-engine: hftbacktest job runner and calibration
- shadow-trader: live paper execution and discrepancy logging
- live-executor: real order routing
- risk-engine: hard limits, kill switches, and exposure checks

Keep these off Vercel once you move beyond the beta.
