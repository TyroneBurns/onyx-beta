'use client';

import { BrainCircuit, Pause, Play, RefreshCcw, ShieldCheck, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MarketCandidate, TradeSignal } from '@/lib/onyx-types';
import { cn } from '@/lib/utils';
import { gbp, num, pct, useOnyxRuntime, type PaperPosition, type PaperTrade } from '@/components/onyx/onyx-runtime';

export function OnyxPaperTrader() {
  const {
    snapshot,
    loading,
    settings,
    learned,
    positions,
    trades,
    error,
    nextResearchIn,
    updateSettings,
    fetchSnapshot,
    openManual,
    closePosition,
    resetPaper,
    positionPnl,
    metrics
  } = useOnyxRuntime();

  return (
    <section className="space-y-6 overflow-safe">
      <div className="grid gap-4 xl:grid-cols-4">
        <Metric label="Paper equity" value={gbp(metrics.equity)} detail={`Cash ${gbp(metrics.equity - metrics.exposure - metrics.openPnl)} • Exposure ${gbp(metrics.exposure)}`} positive={metrics.equity >= settings.startingBalance} />
        <Metric label="Open PnL" value={gbp(metrics.openPnl)} detail={`${positions.length} open positions`} positive={metrics.openPnl >= 0} />
        <Metric label="Expectancy" value={gbp(metrics.expectancy)} detail={`PF ${metrics.profitFactor.toFixed(2)} • WR ${pct(metrics.winRate)}`} positive={metrics.expectancy >= 0} />
        <Metric label="Auto research" value={settings.autoResearch ? 'Every 5 mins' : 'Paused'} detail={`Next scan ${Math.floor(nextResearchIn / 60)}:${String(nextResearchIn % 60).padStart(2, '0')}`} positive={settings.autoResearch} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">ONYX autonomous paper engine</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Research → learn → paper trade</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                ONYX researches public markets every 5 minutes, ranks pairs, filters for trend / volatility / structure, then opens paper trades only when the signal clears your learned guardrails. This is paper trading only until the data proves a positive edge.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={fetchSnapshot} disabled={loading} variant="secondary"><RefreshCcw className="mr-2 h-4 w-4" />Research now</Button>
              <Button onClick={() => updateSettings({ autoPaper: !settings.autoPaper })} variant={settings.autoPaper ? 'default' : 'secondary'}>
                {settings.autoPaper ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}{settings.autoPaper ? 'Auto paper on' : 'Auto paper off'}
              </Button>
            </div>
          </div>
          {error ? <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200"><strong>Market fetch issue:</strong> {error}</div> : null}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              Source: {snapshot?.source || 'Waiting for first market scan'}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              Learning: {learned.state} — Q {learned.effectiveMinQuality}, C {learned.effectiveMinConfidence}, risk {learned.effectiveRiskPerTradePct.toFixed(2)}%
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              Edge gate: do not go live until 100+ paper closes, positive expectancy, PF &gt; 1.15 and drawdown controlled.
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-50">
            <strong>Learning note:</strong> {learned.reason}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Risk controls</p>
              <h3 className="mt-2 text-xl font-semibold">Paper settings</h3>
            </div>
            <ShieldCheck className="h-8 w-8 text-emerald-300" />
          </div>
          <div className="mt-4 space-y-3">
            <Control label="Starting balance" value={settings.startingBalance} onChange={v => updateSettings({ startingBalance: v })} />
            <Control label="Base risk per trade %" value={settings.riskPerTradePct} step="0.25" onChange={v => updateSettings({ riskPerTradePct: v })} />
            <Control label="Min quality" value={settings.minQuality} onChange={v => updateSettings({ minQuality: v })} />
            <Control label="Min confidence" value={settings.minConfidence} onChange={v => updateSettings({ minConfidence: v })} />
            <Control label="Max open positions" value={settings.maxOpenPositions} onChange={v => updateSettings({ maxOpenPositions: v })} />
            <Control label="Research every seconds" value={settings.scanEverySeconds} onChange={v => updateSettings({ scanEverySeconds: Math.max(60, v) })} />
            <Control label="Pairs to research" value={settings.maxPairsToResearch} onChange={v => updateSettings({ maxPairsToResearch: v })} />
            <label className="block text-xs text-slate-500">Universe</label>
            <textarea value={settings.universe} onChange={e => updateSettings({ universe: e.target.value })} className="min-h-20 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-cyan-300/50" />
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => updateSettings({ autoResearch: !settings.autoResearch })} variant="secondary" className="w-full">{settings.autoResearch ? 'Pause research' : 'Resume research'}</Button>
              <Button onClick={resetPaper} variant="ghost" className="w-full">Reset paper</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.25fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Selected by ONYX</p>
              <h3 className="mt-2 text-xl font-semibold">Researched pairs</h3>
            </div>
            <BrainCircuit className="h-7 w-7 text-cyan-300" />
          </div>
          <div className="space-y-3">
            {snapshot?.selectedPairs.map(pair => <PairCard key={pair.symbol} pair={pair} />) || <SkeletonList />}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Signal queue</p>
              <h3 className="mt-2 text-xl font-semibold">Paper trade candidates</h3>
            </div>
            <Target className="h-7 w-7 text-emerald-300" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {snapshot?.signals.map(signal => (
              <SignalCard key={signal.symbol} signal={signal} disabled={positions.length >= settings.maxOpenPositions || positions.some(p => p.symbol === signal.symbol)} onOpen={() => openManual(signal)} />
            )) || <SkeletonList />}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Live paper positions</p>
              <h3 className="mt-2 text-xl font-semibold">Open risk</h3>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">{positions.length} open</span>
          </div>
          <div className="space-y-3">
            {positions.length ? positions.map(p => <PositionCard key={p.id} position={p} pnl={positionPnl(p)} onClose={() => closePosition(p.id)} />) : <Empty text="No open paper positions. Turn auto paper on or open a candidate manually." />}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Paper history</p>
              <h3 className="mt-2 text-xl font-semibold">Recent activity</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{trades.length} events</span>
          </div>
          <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
            {trades.length ? trades.slice(0, 30).map(t => <TradeEvent key={t.id} trade={t} />) : <Empty text="No paper trades yet." />}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Metric({ label, value, detail, positive }: { label: string; value: string; detail: string; positive?: boolean }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <div className={cn('mt-3 text-3xl font-semibold', positive === undefined ? 'text-white' : positive ? 'text-emerald-300' : 'text-red-300')}>{value}</div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </Card>
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

function PairCard({ pair }: { pair: MarketCandidate }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{pair.symbol}</div>
          <p className="mt-1 text-xs leading-5 text-slate-400">{pair.reason}</p>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">{pair.researchScore}</div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-400">
        <span>24h {pct(pair.priceChangePct24h)}</span>
        <span>Vol {pct(pair.volatilityPct)}</span>
        <span>£vol {num(pair.quoteVolume / 1_000_000, 1)}m</span>
      </div>
    </div>
  );
}

function SignalCard({ signal, disabled, onOpen }: { signal: TradeSignal; disabled: boolean; onOpen: () => void }) {
  const actionable = signal.action !== 'HOLD';
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{signal.symbol}</div>
          <p className="mt-1 text-sm text-slate-400">{signal.side} • {num(signal.lastPrice, 4)}</p>
        </div>
        <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', actionable ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300')}>{signal.action}</span>
      </div>
      <p className="mt-3 min-h-10 text-xs leading-5 text-slate-400">{signal.reason}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Mini label="Quality" value={String(signal.quality)} />
        <Mini label="Confidence" value={String(signal.confidence)} />
        <Mini label="ATR" value={pct(signal.atrPct)} />
      </div>
      <Button onClick={onOpen} disabled={!actionable || disabled} variant={actionable ? 'default' : 'secondary'} className="mt-4 w-full">Open paper trade</Button>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/8 bg-slate-950/40 p-2"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="mt-1 font-semibold text-white">{value}</div></div>;
}

function PositionCard({ position, pnl, onClose }: { position: PaperPosition; pnl: number; onClose: () => void }) {
  const pnlPct = position.notional ? (pnl / position.notional) * 100 : 0;
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{position.side} {position.symbol}</div>
          <p className="mt-1 text-xs text-slate-400">Entry {num(position.entryPrice, 4)} • Last {num(position.lastPrice, 4)}</p>
        </div>
        <span className={cn('rounded-full border px-3 py-1 text-sm font-semibold', pnl >= 0 ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200' : 'border-red-300/25 bg-red-400/10 text-red-200')}>{gbp(pnl)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Mini label="Size" value={gbp(position.notional)} />
        <Mini label="PnL %" value={pct(pnlPct)} />
        <Mini label="Q/Conf" value={`${position.quality}/${position.confidence}`} />
      </div>
      <p className="mt-3 text-xs text-slate-500">Stop {num(position.stopPrice, 4)} • TP {num(position.takeProfitPrice, 4)}</p>
      <Button onClick={onClose} variant="secondary" className="mt-4 w-full">Close paper position</Button>
    </div>
  );
}

function TradeEvent({ trade }: { trade: PaperTrade }) {
  const close = trade.type === 'CLOSE';
  const win = trade.pnl >= 0;
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className={cn('mt-1 rounded-full p-2', !close ? 'bg-cyan-400/10 text-cyan-200' : win ? 'bg-emerald-400/10 text-emerald-200' : 'bg-red-400/10 text-red-200')}>
          {win ? '↗' : '↘'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-white">{trade.type} {trade.side} {trade.symbol}</div>
            <div className={cn('text-sm font-semibold', !close ? 'text-cyan-200' : win ? 'text-emerald-200' : 'text-red-200')}>{close ? gbp(trade.pnl) : 'Open'}</div>
          </div>
          <p className="mt-1 text-xs text-slate-400">{trade.reason} • {new Date(trade.createdAt).toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">Price {num(trade.price, 4)} • Size {gbp(trade.notional)} {close ? `• ${pct(trade.pnlPct)}` : ''}</p>
        </div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">{text}</div>;
}

function SkeletonList() {
  return <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-sm text-slate-400">Researching market…</div>;
}
