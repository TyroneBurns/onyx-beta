# Stop Set & Forget on Northflank

Set & Forget should be stopped before ONYX testing continues because the old worker can keep spending API credits.

Recommended order:

1. Pause the scheduled Northflank job.
2. Check recent runs to make sure no new runs are queued.
3. Remove live/API credentials from runtime variables.
4. Keep the Postgres addon only if you still need historical data.
5. Delete the worker/job once you are sure no data is needed.

Do not run Set & Forget and ONYX together while testing. It makes results confusing and wastes credits.
