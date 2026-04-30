'use client';

import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { gbp, num, pct, useOnyxRuntime, type PaperTrade } from '@/components/onyx/onyx-runtime';
import { RuntimeStat, Pill } from '@/components/onyx/runtime-cards';
import { cn } from '@/lib/utils';

export function TradesLive() {
  const { metrics, positions, trades, closePosition, positionPnl } = useOnyxRuntime();
  const closedToday = metrics.closedTrades.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString());
  const netToday = closedToday.reduce((s, t) => s + t.pnl, 0);

  return (
    <section className="space-y-8 overflow-safe">
      <SectionHeading
        eyebrow="Execution layer"
        title="Real paper trade ledger"
        description="No demo rows. This page shows the actual ONYX paper entries, exits, open risk, reasons and realised outcomes."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <RuntimeStat label="Realised today" value={gbp(netToday)} note={`${closedToday.length} closed today`} tone={netToday >= 0 ? 'good' : 'bad'} />
        <RuntimeStat label="Open positions" value={String(positions.length)} note={`${gbp(metrics.exposure)} exposure`} tone={positions.length ? 'warn' : 'neutral'} />
        <RuntimeStat label="Avg closed result" value={gbp(metrics.expectancy)} note={`${metrics.closedTrades.length} closed paper trades`} tone={metrics.expectancy >= 0 ? 'good' : 'bad'} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Open now</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Live paper positions</h3>
          </div>
          <Pill tone={positions.length ? 'warn' : 'neutral'}>{positions.length} open</Pill>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {positions.length ? positions.map(position => {
            const pnl = positionPnl(position);
            return (
              <div key={position.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{position.side} {position.symbol}</h4>
                    <p className="mt-1 text-sm text-slate-400">Entry {num(position.entryPrice, 4)} • Last {num(position.lastPrice, 4)}</p>
                  </div>
                  <Pill tone={pnl >= 0 ? 'good' : 'bad'}>{gbp(pnl)}</Pill>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <Mini label="Size" value={gbp(position.notional)} />
                  <Mini label="PnL %" value={pct(position.notional ? (pnl / position.notional) * 100 : 0)} />
                  <Mini label="Q/Conf" value={`${position.quality}/${position.confidence}`} />
                </div>
                <p className="mt-3 text-xs text-slate-500">Stop {num(position.stopPrice, 4)} • TP {num(position.takeProfitPrice, 4)}</p>
                <Button onClick={() => closePosition(position.id)} variant="secondary" className="mt-4 w-full">Close paper position</Button>
              </div>
            );
          }) : <Empty text="No open paper positions." />}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Execution log</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Recent activity</h3>
          </div>
          <Pill>{trades.length} events</Pill>
        </div>
        <div className="space-y-3">
          {trades.length ? trades.slice(0, 80).map(trade => <TradeRow key={trade.id} trade={trade} />) : <Empty text="No paper trades yet." />}
        </div>
      </Card>
    </section>
  );
}

function TradeRow({ trade }: { trade: PaperTrade }) {
  const close = trade.type === 'CLOSE';
  const win = trade.pnl >= 0;
  return (
    <div className={cn('rounded-2xl border p-4', close ? win ? 'border-emerald-300/15 bg-emerald-400/5' : 'border-rose-300/15 bg-rose-400/5' : 'border-cyan-300/15 bg-cyan-400/5')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-white">{trade.type} {trade.side} {trade.symbol}</h4>
          <p className="mt-1 text-xs text-slate-400">{trade.reason} • {new Date(trade.createdAt).toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">Price {num(trade.price, 4)} • Size {gbp(trade.notional)}</p>
        </div>
        <div className="text-right">
          <div className={cn('font-semibold', !close ? 'text-cyan-200' : win ? 'text-emerald-200' : 'text-rose-200')}>{close ? gbp(trade.pnl) : 'Open'}</div>
          {close ? <p className={cn('mt-1 text-xs', win ? 'text-emerald-300' : 'text-rose-300')}>{pct(trade.pnlPct)}</p> : null}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/8 bg-slate-950/40 p-2"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="mt-1 font-semibold text-white">{value}</div></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">{text}</div>;
}
