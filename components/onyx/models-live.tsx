'use client';

import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { gbp, pct, useOnyxRuntime } from '@/components/onyx/onyx-runtime';
import { RuntimeStat, Pill } from '@/components/onyx/runtime-cards';

export function ModelsLive() {
  const { metrics, learned, snapshot, trades } = useOnyxRuntime();
  const closed = metrics.closedTrades;
  const modelStatus = metrics.expectancy > 0 && metrics.profitFactor > 1.15 ? 'PASSING PAPER GATE' : closed.length < 100 ? 'COLLECTING DATA' : 'FAILED EDGE';
  const models = [
    {
      name: 'ONYX Market Research',
      version: 'v2.0',
      status: snapshot ? 'ACTIVE' : 'WAITING',
      confidence: snapshot ? `${snapshot.selectedPairs.length} pairs` : 'No scan',
      accuracy: snapshot?.mode || 'Research pending',
      notes: 'Chooses the tradable universe dynamically from public market data instead of forcing BTC / ETH / SOL.'
    },
    {
      name: 'ONYX Execution Filter',
      version: 'v2.0',
      status: 'ACTIVE',
      confidence: `Q ${learned.effectiveMinQuality}`,
      accuracy: `C ${learned.effectiveMinConfidence}`,
      notes: 'Blocks weak trend, low confidence and low quality candidates before paper entries are fired.'
    },
    {
      name: 'ONYX Learning Optimiser',
      version: 'v2.0',
      status: learned.state.toUpperCase(),
      confidence: `${learned.effectiveRiskPerTradePct.toFixed(2)}% risk`,
      accuracy: `PF ${metrics.profitFactor.toFixed(2)}`,
      notes: learned.reason
    }
  ];

  return (
    <section className="space-y-8 overflow-safe">
      <SectionHeading
        eyebrow="Model layer"
        title="Live model registry"
        description="This page now reads the active paper trading engine, learned controls and real forward-test results."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <RuntimeStat label="Model gate" value={modelStatus} note={`${closed.length}/100 closed trades`} tone={modelStatus === 'PASSING PAPER GATE' ? 'good' : 'warn'} />
        <RuntimeStat label="Expectancy" value={gbp(metrics.expectancy)} note={`Need positive before live`} tone={metrics.expectancy >= 0 ? 'good' : 'bad'} />
        <RuntimeStat label="Profit factor" value={metrics.profitFactor.toFixed(2)} note="Target > 1.15" tone={metrics.profitFactor >= 1.15 ? 'good' : 'bad'} />
        <RuntimeStat label="Win rate" value={pct(metrics.winRate)} note={`${metrics.winners.length} winners`} tone={metrics.winRate >= 40 ? 'good' : 'warn'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {models.map(model => (
          <Card key={model.name} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{model.version}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{model.name}</h3>
              </div>
              <Pill tone={model.status.includes('ACTIVE') || model.status.includes('EXPANDING') ? 'good' : model.status.includes('FAILED') ? 'bad' : 'warn'}>{model.status}</Pill>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Box label="Control" value={model.confidence} />
              <Box label="Readout" value={model.accuracy} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{model.notes}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Release gating</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Real-money lock remains closed</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ['100 closed paper trades', `${Math.min(100, closed.length)}/100`],
            ['Positive expectancy', metrics.expectancy > 0 ? 'Pass' : 'Fail'],
            ['Profit factor > 1.15', metrics.profitFactor > 1.15 ? 'Pass' : 'Fail'],
            ['Manual approval', 'Required']
          ].map(([label, value]) => <Box key={label} label={label} value={value} />)}
        </div>
      </Card>
    </section>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/6 bg-white/4 p-4"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 font-mono text-lg text-white">{value}</p></div>;
}
