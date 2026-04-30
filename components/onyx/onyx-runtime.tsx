'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { MarketSnapshot, TradeSignal } from '@/lib/onyx-types';

export type PaperPosition = {
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

export type PaperTrade = {
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
  quality?: number;
  confidence?: number;
  openedAt?: string;
  closedAt?: string;
};

export type OnyxSettings = {
  startingBalance: number;
  riskPerTradePct: number;
  maxOpenPositions: number;
  scanEverySeconds: number;
  autoResearch: boolean;
  autoPaper: boolean;
  minQuality: number;
  minConfidence: number;
  maxPairsToResearch: number;
  universe: string;
  learningEnabled: boolean;
  maxRiskPerTradePct: number;
  minRiskPerTradePct: number;
};

export type LearnedProfile = {
  effectiveRiskPerTradePct: number;
  effectiveMinQuality: number;
  effectiveMinConfidence: number;
  state: 'learning' | 'tightening' | 'expanding' | 'paused';
  reason: string;
};

type RuntimeState = {
  settings: OnyxSettings;
  learned: LearnedProfile;
  snapshot: MarketSnapshot | null;
  loading: boolean;
  error: string | null;
  cash: number;
  positions: PaperPosition[];
  trades: PaperTrade[];
  lastResearchAt: string | null;
  nextResearchIn: number;
  updateSettings: (next: Partial<OnyxSettings>) => void;
  fetchSnapshot: () => Promise<void>;
  openManual: (signal: TradeSignal) => void;
  closePosition: (id: string, reason?: string) => void;
  resetPaper: () => void;
  resetLearning: () => void;
  positionPnl: (position: PaperPosition) => number;
  metrics: OnyxMetrics;
};

export type OnyxMetrics = {
  equity: number;
  exposure: number;
  openPnl: number;
  realisedPnl: number;
  closedTrades: PaperTrade[];
  winners: PaperTrade[];
  losers: PaperTrade[];
  winRate: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  profitFactor: number;
  bestPair: string;
  weakestPair: string;
  totalTrades: number;
};

const DEFAULT_SETTINGS: OnyxSettings = {
  startingBalance: 1000,
  riskPerTradePct: 2,
  maxOpenPositions: 2,
  scanEverySeconds: 300,
  autoResearch: true,
  autoPaper: false,
  minQuality: 82,
  minConfidence: 80,
  maxPairsToResearch: 6,
  universe: 'BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT,ADAUSDT,DOGEUSDT,AVAXUSDT,LINKUSDT,SUIUSDT',
  learningEnabled: true,
  maxRiskPerTradePct: 4,
  minRiskPerTradePct: 0.5
};

const DEFAULT_LEARNED: LearnedProfile = {
  effectiveRiskPerTradePct: DEFAULT_SETTINGS.riskPerTradePct,
  effectiveMinQuality: DEFAULT_SETTINGS.minQuality,
  effectiveMinConfidence: DEFAULT_SETTINGS.minConfidence,
  state: 'learning',
  reason: 'Waiting for enough closed paper trades before adjusting controls.'
};

const STORAGE_KEY = 'onyx-v2-autonomous-state';
const OnyxContext = createContext<RuntimeState | null>(null);

export function gbp(value: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(value || 0);
}

export function pct(value: number) {
  return `${(value || 0).toFixed(2)}%`;
}

export function num(value: number, digits = 2) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: digits });
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sideFromSignal(signal: TradeSignal): 'LONG' | 'SHORT' {
  return signal.side === 'SHORT' ? 'SHORT' : 'LONG';
}

function fallbackMetrics(cash: number, positions: PaperPosition[], trades: PaperTrade[], positionPnl: (p: PaperPosition) => number, startingBalance: number): OnyxMetrics {
  const openPnl = positions.reduce((sum, p) => sum + positionPnl(p), 0);
  const exposure = positions.reduce((sum, p) => sum + p.notional, 0);
  const equity = cash + exposure + openPnl;
  const closedTrades = trades.filter(t => t.type === 'CLOSE');
  const winners = closedTrades.filter(t => t.pnl > 0);
  const losers = closedTrades.filter(t => t.pnl < 0);
  const realisedPnl = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = closedTrades.length ? (winners.length / closedTrades.length) * 100 : 0;
  const avgWin = winners.length ? winners.reduce((s, t) => s + t.pnl, 0) / winners.length : 0;
  const avgLoss = losers.length ? Math.abs(losers.reduce((s, t) => s + t.pnl, 0) / losers.length) : 0;
  const expectancy = closedTrades.length ? realisedPnl / closedTrades.length : 0;
  const grossWin = winners.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losers.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = grossLoss ? grossWin / grossLoss : grossWin > 0 ? 99 : 0;
  const pairPnls = new Map<string, number>();
  closedTrades.forEach(t => pairPnls.set(t.symbol, (pairPnls.get(t.symbol) || 0) + t.pnl));
  const pairs = Array.from(pairPnls.entries()).sort((a, b) => b[1] - a[1]);
  return {
    equity,
    exposure,
    openPnl,
    realisedPnl,
    closedTrades,
    winners,
    losers,
    winRate,
    avgWin,
    avgLoss,
    expectancy,
    profitFactor,
    bestPair: pairs[0]?.[0] || 'None yet',
    weakestPair: pairs.at(-1)?.[0] || 'None yet',
    totalTrades: trades.length
  };
}

function buildLearnedProfile(settings: OnyxSettings, trades: PaperTrade[]): LearnedProfile {
  if (!settings.learningEnabled) {
    return {
      effectiveRiskPerTradePct: settings.riskPerTradePct,
      effectiveMinQuality: settings.minQuality,
      effectiveMinConfidence: settings.minConfidence,
      state: 'paused',
      reason: 'Learning is disabled. ONYX is using your manual controls only.'
    };
  }

  const closed = trades.filter(t => t.type === 'CLOSE').slice(0, 60);
  if (closed.length < 12) {
    return {
      effectiveRiskPerTradePct: settings.riskPerTradePct,
      effectiveMinQuality: settings.minQuality,
      effectiveMinConfidence: settings.minConfidence,
      state: 'learning',
      reason: `${closed.length}/12 closed paper trades collected. ONYX is observing before adjusting risk.`
    };
  }

  const winners = closed.filter(t => t.pnl > 0);
  const losers = closed.filter(t => t.pnl < 0);
  const realised = closed.reduce((sum, t) => sum + t.pnl, 0);
  const expectancy = realised / closed.length;
  const winRate = (winners.length / closed.length) * 100;
  const grossWin = winners.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losers.reduce((s, t) => s + t.pnl, 0));
  const pf = grossLoss ? grossWin / grossLoss : grossWin > 0 ? 99 : 0;
  const chopDamage = closed.filter(t => /CHOP|FLIP|STOP/i.test(t.reason) && t.pnl < 0).length / closed.length;

  if (expectancy < 0 || pf < 1 || winRate < 38 || chopDamage > 0.45) {
    return {
      effectiveRiskPerTradePct: clamp(settings.riskPerTradePct * 0.55, settings.minRiskPerTradePct, settings.maxRiskPerTradePct),
      effectiveMinQuality: clamp(settings.minQuality + 6, 78, 96),
      effectiveMinConfidence: clamp(settings.minConfidence + 6, 76, 96),
      state: 'tightening',
      reason: `Negative or weak edge detected. Expectancy ${gbp(expectancy)}, PF ${pf.toFixed(2)}, WR ${winRate.toFixed(1)}%. Tightening entries and cutting size.`
    };
  }

  if (expectancy > 0 && pf >= 1.15 && winRate >= 42) {
    return {
      effectiveRiskPerTradePct: clamp(settings.riskPerTradePct * 1.15, settings.minRiskPerTradePct, settings.maxRiskPerTradePct),
      effectiveMinQuality: clamp(settings.minQuality - 1, 76, 94),
      effectiveMinConfidence: clamp(settings.minConfidence - 1, 74, 94),
      state: 'expanding',
      reason: `Paper edge improving. Expectancy ${gbp(expectancy)}, PF ${pf.toFixed(2)}, WR ${winRate.toFixed(1)}%. Allowing slightly more opportunity.`
    };
  }

  return {
    effectiveRiskPerTradePct: settings.riskPerTradePct,
    effectiveMinQuality: settings.minQuality,
    effectiveMinConfidence: settings.minConfidence,
    state: 'learning',
    reason: `Edge is neutral. Expectancy ${gbp(expectancy)}, PF ${pf.toFixed(2)}, WR ${winRate.toFixed(1)}%. Keeping controls steady.`
  };
}

export function OnyxRuntimeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<OnyxSettings>(DEFAULT_SETTINGS);
  const [learned, setLearned] = useState<LearnedProfile>(DEFAULT_LEARNED);
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState(DEFAULT_SETTINGS.startingBalance);
  const [positions, setPositions] = useState<PaperPosition[]>([]);
  const [trades, setTrades] = useState<PaperTrade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastResearchAt, setLastResearchAt] = useState<string | null>(null);
  const [nextResearchIn, setNextResearchIn] = useState(DEFAULT_SETTINGS.scanEverySeconds);
  const positionsRef = useRef<PaperPosition[]>([]);
  const tradesRef = useRef<PaperTrade[]>([]);
  const cashRef = useRef(DEFAULT_SETTINGS.startingBalance);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const learnedRef = useRef(DEFAULT_LEARNED);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<{
        settings: OnyxSettings;
        learned: LearnedProfile;
        cash: number;
        positions: PaperPosition[];
        trades: PaperTrade[];
        lastResearchAt: string | null;
      }>;
      if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      if (parsed.learned) setLearned({ ...DEFAULT_LEARNED, ...parsed.learned });
      if (typeof parsed.cash === 'number') setCash(parsed.cash);
      if (Array.isArray(parsed.positions)) setPositions(parsed.positions);
      if (Array.isArray(parsed.trades)) setTrades(parsed.trades);
      if (parsed.lastResearchAt) setLastResearchAt(parsed.lastResearchAt);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => { positionsRef.current = positions; }, [positions]);
  useEffect(() => { tradesRef.current = trades; }, [trades]);
  useEffect(() => { cashRef.current = cash; }, [cash]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { learnedRef.current = learned; }, [learned]);

  useEffect(() => {
    const next = buildLearnedProfile(settings, trades);
    setLearned(next);
  }, [settings, trades]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, learned, cash, positions, trades, lastResearchAt }));
  }, [settings, learned, cash, positions, trades, lastResearchAt]);

  const positionPnl = useCallback((position: PaperPosition) => {
    if (position.side === 'LONG') return (position.lastPrice - position.entryPrice) * position.units;
    return (position.entryPrice - position.lastPrice) * position.units;
  }, []);

  const metrics = useMemo(
    () => fallbackMetrics(cash, positions, trades, positionPnl, settings.startingBalance),
    [cash, positions, trades, positionPnl, settings.startingBalance]
  );

  function addTrades(items: PaperTrade[]) {
    setTrades(prev => [...items, ...prev].slice(0, 500));
  }

  function markPositionsToMarket(signals: TradeSignal[]) {
    const priceMap = new Map(signals.map(s => [s.symbol, s.lastPrice]));
    setPositions(prev => prev.map(p => {
      const nextPrice = priceMap.get(p.symbol) || p.lastPrice;
      return { ...p, lastPrice: nextPrice };
    }));

    const toClose: { position: PaperPosition; price: number; reason: string }[] = [];
    positionsRef.current.forEach(position => {
      const price = priceMap.get(position.symbol) || position.lastPrice;
      const hitStop = position.side === 'LONG' ? price <= position.stopPrice : price >= position.stopPrice;
      const hitTake = position.side === 'LONG' ? price >= position.takeProfitPrice : price <= position.takeProfitPrice;
      if (hitStop) toClose.push({ position: { ...position, lastPrice: price }, price, reason: 'AUTO STOP LOSS' });
      if (hitTake) toClose.push({ position: { ...position, lastPrice: price }, price, reason: 'AUTO TAKE PROFIT' });
    });

    if (toClose.length) {
      toClose.forEach(({ position, reason }) => closePosition(position.id, reason, position));
    }
  }

  function signalToPosition(signal: TradeSignal): PaperPosition {
    const currentMetrics = fallbackMetrics(cashRef.current, positionsRef.current, tradesRef.current, positionPnl, settingsRef.current.startingBalance);
    const notional = Math.max(5, currentMetrics.equity * (learnedRef.current.effectiveRiskPerTradePct / 100));
    const side = sideFromSignal(signal);

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

  function canOpen(signal: TradeSignal) {
    const openSymbols = new Set(positionsRef.current.map(p => p.symbol));
    if (signal.action === 'HOLD') return false;
    if (openSymbols.has(signal.symbol)) return false;
    if (positionsRef.current.length >= settingsRef.current.maxOpenPositions) return false;
    if (signal.quality < learnedRef.current.effectiveMinQuality) return false;
    if (signal.confidence < learnedRef.current.effectiveMinConfidence) return false;
    return true;
  }

  function openFromSignal(signal: TradeSignal, reason: 'AUTO PAPER ENTRY' | 'MANUAL PAPER ENTRY') {
    if (!canOpen(signal) && reason === 'AUTO PAPER ENTRY') return;
    if (positionsRef.current.some(p => p.symbol === signal.symbol)) return;
    if (positionsRef.current.length >= settingsRef.current.maxOpenPositions) return;

    const pos = signalToPosition(signal);
    setCash(c => c - pos.notional);
    setPositions(prev => [...prev, pos]);
    addTrades([{
      id: uid(),
      symbol: pos.symbol,
      side: pos.side,
      type: 'OPEN',
      price: pos.entryPrice,
      notional: pos.notional,
      pnl: 0,
      pnlPct: 0,
      reason,
      createdAt: new Date().toISOString(),
      quality: pos.quality,
      confidence: pos.confidence,
      openedAt: pos.openedAt
    }]);
  }

  function autoPaperTrade(data: MarketSnapshot) {
    const candidates = data.signals
      .filter(canOpen)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(0, settingsRef.current.maxOpenPositions - positionsRef.current.length));

    candidates.forEach(signal => openFromSignal(signal, 'AUTO PAPER ENTRY'));
  }

  const fetchSnapshot = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        interval: '15m',
        pairs: String(settingsRef.current.maxPairsToResearch),
        universe: settingsRef.current.universe
      });
      const res = await fetch(`/api/market/snapshot?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Snapshot failed');
      const marketSnapshot = data as MarketSnapshot;
      setSnapshot(marketSnapshot);
      setLastResearchAt(new Date().toISOString());
      markPositionsToMarket(marketSnapshot.signals);
      if (settingsRef.current.autoPaper) autoPaperTrade(marketSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not research market');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (settings.autoResearch) fetchSnapshot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!settings.autoResearch) return;
    const timer = window.setInterval(fetchSnapshot, settings.scanEverySeconds * 1000);
    return () => window.clearInterval(timer);
  }, [settings.autoResearch, settings.scanEverySeconds, fetchSnapshot]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!lastResearchAt) {
        setNextResearchIn(settingsRef.current.scanEverySeconds);
        return;
      }
      const elapsed = Math.floor((Date.now() - new Date(lastResearchAt).getTime()) / 1000);
      setNextResearchIn(Math.max(0, settingsRef.current.scanEverySeconds - elapsed));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lastResearchAt]);

  function openManual(signal: TradeSignal) {
    openFromSignal(signal, 'MANUAL PAPER ENTRY');
  }

  function closePosition(id: string, reason = 'MANUAL PAPER EXIT', override?: PaperPosition) {
    const pos = override || positionsRef.current.find(p => p.id === id);
    if (!pos) return;
    const pnl = positionPnl(pos);
    const pnlPct = pos.notional ? (pnl / pos.notional) * 100 : 0;
    setCash(c => c + pos.notional + pnl);
    setPositions(prev => prev.filter(p => p.id !== id));
    addTrades([{
      id: uid(),
      symbol: pos.symbol,
      side: pos.side,
      type: 'CLOSE',
      price: pos.lastPrice,
      notional: pos.notional,
      pnl,
      pnlPct,
      reason,
      createdAt: new Date().toISOString(),
      openedAt: pos.openedAt,
      closedAt: new Date().toISOString(),
      quality: pos.quality,
      confidence: pos.confidence
    }]);
  }

  function updateSettings(next: Partial<OnyxSettings>) {
    setSettings(prev => ({ ...prev, ...next }));
  }

  function resetPaper() {
    setCash(settings.startingBalance);
    setPositions([]);
    setTrades([]);
  }

  function resetLearning() {
    setLearned({
      effectiveRiskPerTradePct: settings.riskPerTradePct,
      effectiveMinQuality: settings.minQuality,
      effectiveMinConfidence: settings.minConfidence,
      state: 'learning',
      reason: 'Learning reset. ONYX is observing fresh paper trade data.'
    });
  }

  const value: RuntimeState = {
    settings,
    learned,
    snapshot,
    loading,
    error,
    cash,
    positions,
    trades,
    lastResearchAt,
    nextResearchIn,
    updateSettings,
    fetchSnapshot,
    openManual,
    closePosition,
    resetPaper,
    resetLearning,
    positionPnl,
    metrics
  };

  return <OnyxContext.Provider value={value}>{children}</OnyxContext.Provider>;
}

export function useOnyxRuntime() {
  const ctx = useContext(OnyxContext);
  if (!ctx) throw new Error('useOnyxRuntime must be used inside OnyxRuntimeProvider');
  return ctx;
}
