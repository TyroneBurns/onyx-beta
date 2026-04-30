'use client';

import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { num, pct, useOnyxRuntime } from '@/components/onyx/onyx-runtime';
import { RuntimeStat, Pill } from '@/components/onyx/runtime-cards';

export function SignalsLive() {
  const { snapshot, learned, positions, settings, fetchSnapshot, openManual } = useOnyxRuntime();
  const signals = snapshot?.signals || [];
  const ready = signals.filter(s => s.action !== 'HOLD' && s.quality >= learned.effectiveMinQuality && s.confidence >= learned.effectiveMinConfidence);
  const blocked = signals.filter(s => s.action === 'HOLD' || s.quality < learned.effectiveMinQuality || s.confidence < learned.effectiveMinConfidence);

  return (
    <section className="space-y-8 overflow-safe">
      <SectionHeading
        eyebrow="Decision engine"
        title="Live signal queue"
        description="Real signals from the latest market scan. ONYX only allows entries that pass the learned quality, confidence and risk gates."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <RuntimeStat label="Ready signals" value={String(ready.length)} note={`From ${signals.length} researched markets`} tone={ready.length ? 'good' : 'neutral'} />
        <RuntimeStat label="Blocked / watch" value={String(blocked.length)} note="Filtered by quality, confidence or structure" tone="warn" />
        <RuntimeStat label="Open positions" value={String(positions.length)} note={`Max ${settings.maxOpenPositions}`} tone={positions.length ? 'good' : 'neutral'} />
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Entry rules</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Learned qualification matrix</h3>
          </div>
          <Button onClick={fetchSnapshot} variant="secondary">Refresh research</Button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            ['Effective quality', `>= ${learned.effectiveMinQuality}`],
            ['Effective confidence', `>= ${learned.effectiveMinConfidence}%`],
            ['Effective risk', `${learned.effectiveRiskPerTradePct.toFixed(2)}%`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-xl text-white">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {signals.map(signal => {
          const already = positions.some(p => p.symbol === signal.symbol);
          const allowed = signal.action !== 'HOLD' && signal.quality >= learned.effectiveMinQuality && signal.confidence >= learned.effectiveMinConfidence && !already && positions.length < settings.maxOpenPositions;
          return (
            <Card key={signal.symbol} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{signal.symbol}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{signal.side} bias</h3>
                  <p className="mt-1 text-sm text-slate-400">Last {num(signal.lastPrice, 4)} • ATR {pct(signal.atrPct)}</p>
                </div>
                <Pill tone={allowed ? 'good' : already ? 'cyan' : signal.action === 'HOLD' ? 'neutral' : 'warn'}>{already ? 'IN TRADE' : allowed ? 'READY' : signal.action}</Pill>
              </div>
              <p className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">{signal.reason}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Mini label="Quality" value={String(signal.quality)} />
                <Mini label="Confidence" value={String(signal.confidence)} />
                <Mini label="Score" value={String(signal.score)} />
              </div>
              <Button onClick={() => openManual(signal)} disabled={!allowed} className="mt-4 w-full" variant={allowed ? 'default' : 'secondary'}>
                {allowed ? 'Open paper trade' : 'Blocked by rules'}
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/8 bg-slate-950/40 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="mt-1 font-semibold text-white">{value}</div></div>;
}
