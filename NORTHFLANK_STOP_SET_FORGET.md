# Stop Set & Forget on Northflank

Set & Forget should be stopped because the HMM strategy failed to prove edge and may keep using API credits.

## Steps

1. Open Northflank.
2. Go to the Set-Forget project.
3. Open Jobs.
4. Select the worker/cron job.
5. Disable the schedule or pause/delete the job.
6. Check Runtime variables and remove old API keys that are no longer needed.
7. Confirm no active runs are left.

## Keep

You can keep the GitHub repo as research history.

## Status

Set & Forget should be treated as:
- paper research only
- failed edge
- not live ready
