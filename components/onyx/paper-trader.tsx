'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BrainCircuit, Pause, Play, RefreshCcw, ShieldCheck, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MarketCandidate, MarketSnapshot, TradeSignal } from '@/lib/onyx-types';
import { cn } from '@/lib/utils';

type PaperPosition = {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  lastPrice: number;
  notional: number;
  units: number;
  stopPrice: number;
  takeProfitPrice: number;
  openedAt: string;
  reason: string;
  quality: number;
  confidence: number;
};

type PaperTrade = {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  type: 'OPEN' | 'CLOSE';
  price: number;
  notional: number;
  pnl: number;
  pnlPct: number;
  reason: string;
  createdAt: string;
};

type Settings = {
  startingBalance: number;
  riskPerTradePct: number;
  maxOpenPositions: number;
  scanEverySeconds: number;
  autoOpen: boolean;
  minQuality: number;
  minConfidence: number;
  maxPairsToResearch: number;
  universe: string;
};

const DEFAULT_SETTINGS: Settings = {
  startingBalance: 1000,
  riskPerTradePct: 2,
  maxOpenPositions: 2,
  scanEverySeconds: 180,
  autoOpen: false,
  minQuality: 82,
  minConfidence: 80,
  maxPairsToResearch: 6,
  universe: 'BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT,ADAUSDT,DOGEUSDT,AVAXUSDT,LINKUSDT,SUIUSDT'
};

function gbp(value: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(value || 0);
}
function pct(value: number) {
  return `${(value || 0).toFixed(2)}%`;
}
function num(value: number, digits = 2) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: digits });
}
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function OnyxPaperTrader() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [cash, setCash] = useState(DEFAULT_SETTINGS.startingBalance);
  const [positions, setPositions] = useState<PaperPosition[]>([]);
  const [trades, setTrades] = useState<PaperTrade[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('onyx-paper-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { settings?: Settings; cash?: number; positions?: PaperPosition[]; trades?: PaperTrade[] };
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        if (typeof parsed.cash === 'number') setCash(parsed.cash);
        if (Array.isArray(parsed.positions)) setPositions(parsed.positions);
        if (Array.isArray(parsed.trades)) setTrades(parsed.trades);
      } catch {
        // ignore old/broken state
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('onyx-paper-state', JSON.stringify({ settings, cash, positions, trades }));
  }, [settings, cash, positions, trades]);

  const openPnl = useMemo(() => positions.reduce((sum, p) => sum + positionPnl(p), 0), [positions]);
  const exposure = useMemo(() => positions.reduce((sum, p) => sum + p.notional, 0), [positions]);
  const equity = cash + exposure + openPnl;
  const closedTrades = trades.filter(t => t.type === 'CLOSE');
  const winners = closedTrades.filter(t => t.pnl > 0);
  const losers = closedTrades.filter(t => t.pnl < 0);
  const realisedPnl = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = closedTrades.length ? (winners.length / closedTrades.length) * 100 : 0;
  const avgWin = winners.length ? winners.reduce((s, t) => s + t.pnl, 0) / winners.length : 0;
  const avgLoss = losers.length ? Math.abs(losers.reduce((s, t) => s + t.pnl, 0) / losers.length) : 0;
  const expectancy = closedTrades.length ? realisedPnl / closedTrades.length : 0;
  const profitFactor = avgLoss && losers.length ? winners.reduce((s, t) => s + t.pnl, 0) / Math.abs(losers.reduce((s, t) => s + t.pnl, 0)) : 0;

  async function fetchSnapshot() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        interval: '15m',
        pairs: String(settings.maxPairsToResearch),
        universe: settings.universe
      });
      const res = await fetch(`/api/market/snapshot?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Snapshot failed');
      setSnapshot(data as MarketSnapshot);
      markPositionsToMarket((data as MarketSnapshot).signals);
      if (settings.autoOpen) autoPaperTrade(data as MarketSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not research market');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSnapshot();
    const timer = window.setInterval(fetchSnapshot, settings.scanEverySeconds * 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.scanEverySeconds, settings.maxPairsToResearch, settings.universe, settings.autoOpen]);

  function markPositionsToMarket(signals: TradeSignal[]) {
    const priceMap = new Map(signals.map(s => [s.symbol, s.lastPrice]));
    setPositions(prev => prev.map(p => ({ ...p, lastPrice: priceMap.get(p.symbol) || p.lastPrice })));
  }

  function positionPnl(position: PaperPosition) {
    if (position.side === 'LONG') return (position.lastPrice - position.entryPrice) * position.units;
    return (position.entryPrice - position.lastPrice) * position.units;
  }

  function autoPaperTrade(data: MarketSnapshot) {
    setPositions(prev => {
      const already = new Set(prev.map(p => p.symbol));
      const candidates = data.signals
        .filter(s => s.action !== 'HOLD')
        .filter(s => s.quality >= settings.minQuality && s.confidence >= settings.minConfidence)
        .filter(s => !already.has(s.symbol))
        .slice(0, Math.max(0, settings.maxOpenPositions - prev.length));

      if (!candidates.length) return prev;
      const newPositions = candidates.map(signalToPosition);
      setCash(c => c - newPositions.reduce((sum, p) => sum + p.notional, 0));
      setTrades(t => [
        ...newPositions.map(p => ({
          id: uid(), symbol: p.symbol, side: p.side, type: 'OPEN' as const, price: p.entryPrice,
          notional: p.notional, pnl: 0, pnlPct: 0, reason: 'AUTO PAPER ENTRY', createdAt: new Date().toISOString()
        })),
        ...t
      ]);
      return [...prev, ...newPositions];
    });
  }

  function signalToPosition(signal: TradeSignal): PaperPosition {
    const notional = Math.max(5, equity * (settings.riskPerTradePct / 100));
    const side = signal.side === 'SHORT' ? 'SHORT' : 'LONG';
    return {
      id: uid(),
      symbol: signal.symbol,
      side,
      entryPrice: signal.lastPrice,
      lastPrice: signal.lastPrice,
      notional,
      units: notional / signal.lastPrice,
      stopPrice: signal.stopPrice || (side === 'LONG' ? signal.lastPrice * 0.985 : signal.lastPrice * 1.015),
      takeProfitPrice: signal.takeProfitPrice || (side === 'LONG' ? signal.lastPrice * 1.03 : signal.lastPrice * 0.97),
      openedAt: new Date().toISOString(),
      reason: signal.reason,
      quality: signal.quality,
      confidence: signal.confidence
    };
  }

  function openManual(signal: TradeSignal) {
    if (positions.some(p => p.symbol === signal.symbol)) return;
    if (positions.length >= settings.maxOpenPositions) return;
    const pos = signalToPosition(signal);
    setCash(c => c - pos.notional);
    setPositions(prev => [...prev, pos]);
    setTrades(prev => [{
      id: uid(), symbol: pos.symbol, side: pos.side, type: 'OPEN', price: pos.entryPrice,
      notional: pos.notional, pnl: 0, pnlPct: 0, reason: 'MANUAL PAPER ENTRY', createdAt: new Date().toISOString()
    }, ...prev]);
  }

  function closePosition(id: string, reason = 'MANUAL PAPER EXIT') {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;
    const pnl = positionPnl(pos);
    const pnlPct = pos.notional ? (pnl / pos.notional) * 100 : 0;
    setCash(c => c + pos.notional + pnl);
    setPositions(prev => prev.filter(p => p.id !== id));
    setTrades(prev => [{
      id: uid(), symbol: pos.symbol, side: pos.side, type: 'CLOSE', price: pos.lastPrice,
      notional: pos.notional, pnl, pnlPct, reason, createdAt: new Date().toISOString()
    }, ...prev]);
  }

  function resetPaper() {
    setCash(settings.startingBalance);
    setPositions([]);
    setTrades([]);
  }

  function updateSettings(next: Partial<Settings>) {
    setSettings(prev => ({ ...prev, ...next }));
  }

  return (
    <section className="space-y-6 overflow-safe">
      <div className="grid gap-4 xl:grid-cols-4">
        <Metric label="Paper equity" value={gbp(equity)} detail={`Cash ${gbp(cash)} • Exposure ${gbp(exposure)}`} positive={equity >= settings.startingBalance} />
        <Metric label="Open PnL" value={gbp(openPnl)} detail={`${positions.length} open positions`} positive={openPnl >= 0} />
        <Metric label="Expectancy" value={gbp(expectancy)} detail={`PF ${profitFactor.toFixed(2)} • WR ${pct(winRate)}`} positive={expectancy >= 0} />
        <Metric label="Market research" value={snapshot ? `${snapshot.selectedPairs.length} pairs` : 'Loading'} detail={snapshot?.mode || 'Scanning public markets'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">ONYX paper engine</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Research → rank → paper trade</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                ONYX now researches a defined crypto universe using public market data, ranks liquid movers, filters for trend / volatility / structure, then paper-trades only if the signal passes your guardrails. Keep it paper only until expectancy and profit factor prove themselves.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={fetchSnapshot} disabled={loading} variant="secondary"><RefreshCcw className="mr-2 h-4 w-4" />Research now</Button>
              <Button onClick={() => updateSettings({ autoOpen: !settings.autoOpen })} variant={settings.autoOpen ? 'default' : 'secondary'}>
                {settings.autoOpen ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}{settings.autoOpen ? 'Auto paper on' : 'Auto paper off'}
              </Button>
            </div>
          </div>
          {error ? <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200"><strong>Market fetch issue:</strong> {error}</div> : null}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {snapshot?.notes.map((note) => (
              <div key={note} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">{note}</div>
            ))}
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
            <Control label="Risk per trade %" value={settings.riskPerTradePct} step="0.25" onChange={v => updateSettings({ riskPerTradePct: v })} />
            <Control label="Min quality" value={settings.minQuality} onChange={v => updateSettings({ minQuality: v })} />
            <Control label="Min confidence" value={settings.minConfidence} onChange={v => updateSettings({ minConfidence: v })} />
            <Control label="Max open positions" value={settings.maxOpenPositions} onChange={v => updateSettings({ maxOpenPositions: v })} />
            <Control label="Pairs to research" value={settings.maxPairsToResearch} onChange={v => updateSettings({ maxPairsToResearch: v })} />
            <label className="block text-xs text-slate-500">Universe</label>
            <textarea value={settings.universe} onChange={e => updateSettings({ universe: e.target.value })} className="min-h-20 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-cyan-300/50" />
            <Button onClick={resetPaper} variant="ghost" className="w-full">Reset paper account</Button>
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
          {!close || win ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
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
