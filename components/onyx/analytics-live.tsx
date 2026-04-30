'use client';

import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { gbp, pct, useOnyxRuntime } from '@/components/onyx/onyx-runtime';
import { RuntimeStat, Pill } from '@/components/onyx/runtime-cards';

export function AnalyticsLive() {
  const { metrics, positions, trades, settings, learned } = useOnyxRuntime();
  const closed = metrics.closedTrades;
  const recent = closed.slice(0, 20);
  const bestWin = closed.reduce((best, t) => Math.max(best, t.pnl), 0);
  const worstLoss = closed.reduce((worst, t) => Math.min(worst, t.pnl), 0);
  const openRisk = positions.reduce((sum, p) => sum + Math.abs(p.entryPrice - p.stopPrice) * p.units, 0);
  const qualityAvg = recent.length ? recent.reduce((s, t) => s + (t.quality || 0), 0) / recent.length : 0;
  const statusTone = metrics.expectancy > 0 && metrics.profitFactor > 1 ? 'good' : metrics.closedTrades.length < 12 ? 'warn' : 'bad';

  return (
    <section className="space-y-8 overflow-safe">
      <SectionHeading
        eyebrow="Insight layer"
        title="Real paper performance analytics"
        description="No demo data. These cards read the live ONYX paper account, open positions, realised PnL and learning state from the app."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <RuntimeStat label="Paper equity" value={gbp(metrics.equity)} note={`Start ${gbp(settings.startingBalance)}`} tone={metrics.equity >= settings.startingBalance ? 'good' : 'bad'} />
        <RuntimeStat label="Realised PnL" value={gbp(metrics.realisedPnl)} note={`${closed.length} closed paper trades`} tone={metrics.realisedPnl >= 0 ? 'good' : 'bad'} />
        <RuntimeStat label="Expectancy" value={gbp(metrics.expectancy)} note={`PF ${metrics.profitFactor.toFixed(2)} • WR ${pct(metrics.winRate)}`} tone={statusTone} />
        <RuntimeStat label="Open risk" value={gbp(openRisk)} note={`${positions.length} live paper positions`} tone={openRisk > 0 ? 'warn' : 'neutral'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Equity behaviour</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Paper edge curve</h3>
            </div>
            <Pill tone={statusTone}>{learned.state}</Pill>
          </div>
          <div className="mt-6 h-56 rounded-2xl border border-white/8 bg-slate-950/40 p-4">
            <div className="flex h-full items-end gap-1">
              {(closed.length ? closed.slice().reverse().slice(-30) : [{ pnl: 0 }]).map((trade, index, arr) => {
                const running = arr.slice(0, index + 1).reduce((s, t: any) => s + Number(t.pnl || 0), 0);
                const max = Math.max(1, ...arr.map((_, i) => Math.abs(arr.slice(0, i + 1).reduce((s, t: any) => s + Number(t.pnl || 0), 0))));
                const height = 18 + Math.min(82, Math.abs(running / max) * 82);
                return <div key={index} className={`min-w-1 flex-1 rounded-t ${running >= 0 ? 'bg-emerald-400/80' : 'bg-rose-400/80'}`} style={{ height: `${height}%` }} />;
              })}
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{learned.reason}</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Edge diagnostics</p>
          <h3 className="mt-2 text-xl font-semibold text-white">What ONYX has learned</h3>
          <div className="mt-6 space-y-3">
            {[
              ['Best pair', metrics.bestPair],
              ['Weakest pair', metrics.weakestPair],
              ['Best win', gbp(bestWin)],
              ['Worst loss', gbp(worstLoss)],
              ['Avg closed quality', qualityAvg ? qualityAvg.toFixed(1) : 'Waiting'],
              ['Effective Q / C / Risk', `${learned.effectiveMinQuality} / ${learned.effectiveMinConfidence} / ${learned.effectiveRiskPerTradePct.toFixed(2)}%`]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/4 px-4 py-3">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-right font-mono text-sm text-white">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
