'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { gbp, useOnyxRuntime } from '@/components/onyx/onyx-runtime';
import { RuntimeStat, Pill } from '@/components/onyx/runtime-cards';

export function SettingsLive() {
  const { settings, learned, metrics, updateSettings, resetPaper, resetLearning, fetchSnapshot } = useOnyxRuntime();

  return (
    <section className="space-y-8 overflow-safe">
      <SectionHeading
        eyebrow="Control layer"
        title="Live autonomous paper settings"
        description="These are now real app controls, not demo settings. Changes are saved locally and used by the ONYX paper engine."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <RuntimeStat label="Auto research" value={settings.autoResearch ? 'ON' : 'OFF'} note={`Every ${settings.scanEverySeconds}s`} tone={settings.autoResearch ? 'good' : 'warn'} />
        <RuntimeStat label="Auto paper" value={settings.autoPaper ? 'ON' : 'OFF'} note="Paper trades only" tone={settings.autoPaper ? 'warn' : 'neutral'} />
        <RuntimeStat label="Learning" value={settings.learningEnabled ? 'ON' : 'OFF'} note={learned.state} tone={settings.learningEnabled ? 'good' : 'neutral'} />
        <RuntimeStat label="Paper equity" value={gbp(metrics.equity)} note="Stored in browser" tone={metrics.equity >= settings.startingBalance ? 'good' : 'bad'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trading controls</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Base rules</h3>
          <div className="mt-6 space-y-3">
            <Control label="Starting balance" value={settings.startingBalance} onChange={v => updateSettings({ startingBalance: v })} />
            <Control label="Base risk per trade %" value={settings.riskPerTradePct} step="0.25" onChange={v => updateSettings({ riskPerTradePct: v })} />
            <Control label="Minimum quality" value={settings.minQuality} onChange={v => updateSettings({ minQuality: v })} />
            <Control label="Minimum confidence" value={settings.minConfidence} onChange={v => updateSettings({ minConfidence: v })} />
            <Control label="Max open positions" value={settings.maxOpenPositions} onChange={v => updateSettings({ maxOpenPositions: Math.max(1, v) })} />
            <Control label="Pairs to research" value={settings.maxPairsToResearch} onChange={v => updateSettings({ maxPairsToResearch: Math.max(1, v) })} />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Autonomy</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Research and learning</h3>
          <div className="mt-6 space-y-3">
            <Control label="Research interval seconds" value={settings.scanEverySeconds} onChange={v => updateSettings({ scanEverySeconds: Math.max(60, v) })} />
            <Control label="Minimum learned risk %" value={settings.minRiskPerTradePct} step="0.25" onChange={v => updateSettings({ minRiskPerTradePct: v })} />
            <Control label="Maximum learned risk %" value={settings.maxRiskPerTradePct} step="0.25" onChange={v => updateSettings({ maxRiskPerTradePct: v })} />
            <div className="grid gap-2 sm:grid-cols-3">
              <Toggle label="Auto research" active={settings.autoResearch} onClick={() => updateSettings({ autoResearch: !settings.autoResearch })} />
              <Toggle label="Auto paper" active={settings.autoPaper} onClick={() => updateSettings({ autoPaper: !settings.autoPaper })} />
              <Toggle label="Learning" active={settings.learningEnabled} onClick={() => updateSettings({ learningEnabled: !settings.learningEnabled })} />
            </div>
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-50">
              <strong>Current learned controls:</strong> Q {learned.effectiveMinQuality}, C {learned.effectiveMinConfidence}, risk {learned.effectiveRiskPerTradePct.toFixed(2)}%. {learned.reason}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Market universe</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Pairs ONYX can research</h3>
        <textarea
          value={settings.universe}
          onChange={e => updateSettings({ universe: e.target.value })}
          className="mt-6 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-200 outline-none focus:border-cyan-300/50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={fetchSnapshot} variant="secondary">Research now</Button>
          <Button onClick={resetLearning} variant="secondary">Reset learning</Button>
          <Button onClick={resetPaper} variant="ghost">Reset paper account</Button>
          <Pill tone="warn">Live trading keys not connected</Pill>
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Launch gate</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Before this ever touches real money</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['Paper-only validation', 'Required'],
            ['100+ closed paper trades', `${metrics.closedTrades.length}/100`],
            ['Positive expectancy', metrics.expectancy > 0 ? 'Pass' : 'Fail'],
            ['Profit factor > 1.15', metrics.profitFactor > 1.15 ? 'Pass' : 'Fail'],
            ['Max drawdown review', 'Manual'],
            ['Live execution approval', 'Locked']
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/6 bg-white/4 p-4">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 font-mono text-lg text-white">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function Control({ label, value, onChange, step = '1' }: { label: string; value: number; step?: string; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-xs text-slate-500">
      {label}
      <input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-300/50" />
    </label>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${active ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-white/5 text-slate-300'}`}>{label}: {active ? 'ON' : 'OFF'}</button>;
}
