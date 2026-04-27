# ONYX launch tasks

## 1) Stop Set & Forget Northflank spend
- Open Northflank.
- Go to the old Set & Forget project.
- Open Jobs.
- Disable/pause the scheduled worker job first.
- Confirm no new runs are starting.
- If you are finished with it, delete the job after exporting any logs you want to keep.
- Keep the database for now if you want historical records, but remove API keys from runtime variables.

## 2) Push ONYX v1 paper trader
- Upload this package into your ONYX repo.
- Push to GitHub.
- Deploy to Vercel.
- Open the homepage and press **Research now**.
- Confirm selected pairs and signal cards load.

## 3) Run in paper-only mode
- Keep **Auto paper off** at first.
- Open one manual paper trade only after ONYX shows a READY signal.
- After you confirm open/close behaviour, turn **Auto paper on**.

## 4) Prove edge before live trading
Minimum pass criteria before live money:
- at least 100 closed paper trades
- expectancy per trade positive
- profit factor above 1.15
- no single pair carrying all gains
- max drawdown acceptable for the account size
- results survive at least two different market regimes

## 5) Next development milestones
- Add persistent database storage for paper trades.
- Add daily metrics board.
- Add strategy comparison page.
- Add auto-disable rules if expectancy stays negative.
- Add exchange connector only after paper results pass.
