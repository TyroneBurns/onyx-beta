export type Side = 'LONG' | 'SHORT';
export type SignalAction = 'BUY' | 'SELL' | 'HOLD';
export type StrategyStatus = 'READY' | 'WATCH' | 'NO_TRADE' | 'IN_TRADE';

export type Candle = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
};

export type MarketCandidate = {
  symbol: string;
  baseAsset: string;
  lastPrice: number;
  priceChangePct24h: number;
  quoteVolume: number;
  volatilityPct: number;
  liquidityScore: number;
  momentumScore: number;
  volatilityScore: number;
  researchScore: number;
  reason: string;
};

export type TradeSignal = {
  symbol: string;
  action: SignalAction;
  side: Side | 'FLAT';
  status: StrategyStatus;
  lastPrice: number;
  quality: number;
  confidence: number;
  trendScore: number;
  atrPct: number;
  compressionScore: number;
  score: number;
  reason: string;
  stopPrice: number | null;
  takeProfitPrice: number | null;
  candlesAnalysed: number;
};

export type MarketSnapshot = {
  ok: true;
  generatedAt: string;
  mode: string;
  interval: string;
  source: string;
  universeSize: number;
  selectedPairs: MarketCandidate[];
  signals: TradeSignal[];
  notes: string[];
};
