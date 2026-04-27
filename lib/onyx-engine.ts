import type { Candle, MarketCandidate, TradeSignal } from '@/lib/onyx-types';

export const DEFAULT_UNIVERSE = [
  'BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','ADAUSDT','DOGEUSDT','AVAXUSDT','LINKUSDT','TRXUSDT',
  'TONUSDT','DOTUSDT','SUIUSDT','LTCUSDT','BCHUSDT','NEARUSDT','APTUSDT','ARBUSDT','OPUSDT','INJUSDT'
];

export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function ema(values: number[], period: number): number[] {
  if (!values.length) return [];
  const k = 2 / (period + 1);
  const out: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) out.push(values[i] * k + out[i - 1] * (1 - k));
  return out;
}

export function atr(candles: Candle[], period = 14): number[] {
  if (!candles.length) return [];
  const trs = candles.map((c, index) => {
    const prev = candles[index - 1]?.close ?? c.close;
    return Math.max(c.high - c.low, Math.abs(c.high - prev), Math.abs(c.low - prev));
  });
  return ema(trs, period);
}

export function normalise(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

export function candidateFromTicker(ticker: Record<string, unknown>): MarketCandidate | null {
  const symbol = String(ticker.symbol || '');
  if (!symbol.endsWith('USDT')) return null;
  if (symbol.includes('UPUSDT') || symbol.includes('DOWNUSDT') || symbol.includes('BULL') || symbol.includes('BEAR')) return null;

  const lastPrice = toNumber(ticker.lastPrice);
  const quoteVolume = toNumber(ticker.quoteVolume);
  const high = toNumber(ticker.highPrice);
  const low = toNumber(ticker.lowPrice);
  const priceChangePct24h = toNumber(ticker.priceChangePercent);
  if (!lastPrice || !quoteVolume) return null;

  const volatilityPct = lastPrice ? ((high - low) / lastPrice) * 100 : 0;
  const liquidityScore = normalise(Math.log10(Math.max(quoteVolume, 1)), 6, 10.5);
  const momentumScore = Math.min(100, Math.abs(priceChangePct24h) * 8);
  const volatilityScore = volatilityPct >= 1.2 && volatilityPct <= 9 ? 100 - Math.abs(volatilityPct - 4.2) * 13 : 35;
  const researchScore = Math.round(liquidityScore * 0.45 + momentumScore * 0.28 + volatilityScore * 0.27);
  const baseAsset = symbol.replace('USDT', '');
  const direction = priceChangePct24h >= 0 ? 'positive 24h momentum' : 'negative 24h momentum';

  return {
    symbol,
    baseAsset,
    lastPrice,
    priceChangePct24h,
    quoteVolume,
    volatilityPct,
    liquidityScore: Math.round(liquidityScore),
    momentumScore: Math.round(momentumScore),
    volatilityScore: Math.round(volatilityScore),
    researchScore,
    reason: `${direction}, ${volatilityPct.toFixed(2)}% range, strong liquidity`
  };
}

export function signalFromCandles(symbol: string, candles: Candle[]): TradeSignal {
  const closes = candles.map(c => c.close);
  const last = closes.at(-1) ?? 0;
  const fast = ema(closes, 9);
  const slow = ema(closes, 21);
  const fastLast = fast.at(-1) ?? last;
  const slowLast = slow.at(-1) ?? last;
  const fastPrev = fast.at(-4) ?? fastLast;
  const atrValues = atr(candles, 14);
  const atrLast = atrValues.at(-1) ?? 0;
  const atrPrev = atrValues.at(-10) ?? atrLast;
  const atrPct = last ? (atrLast / last) * 100 : 0;
  const high20 = Math.max(...candles.slice(-20).map(c => c.high));
  const low20 = Math.min(...candles.slice(-20).map(c => c.low));
  const rangePct = last ? ((high20 - low20) / last) * 100 : 0;
  const breakoutUp = last > high20 * 0.995;
  const breakoutDown = last < low20 * 1.005;
  const trendUp = fastLast > slowLast && fastLast > fastPrev;
  const trendDown = fastLast < slowLast && fastLast < fastPrev;
  const atrExpanding = atrLast > atrPrev * 1.02;
  const compressionScore = rangePct < 1.4 ? 85 : rangePct < 2.2 ? 55 : 15;

  const trendScore = Math.min(100, Math.abs((fastLast - slowLast) / Math.max(last, 1)) * 3500 + (atrExpanding ? 18 : 0));
  const structureScore = breakoutUp || breakoutDown ? 88 : 58;
  const quality = Math.round(trendScore * 0.45 + structureScore * 0.25 + Math.min(100, atrPct * 22) * 0.2 + (100 - compressionScore) * 0.1);
  const confidence = Math.round(Math.min(99, 55 + trendScore * 0.35 + (atrExpanding ? 10 : 0) + (breakoutUp || breakoutDown ? 9 : 0)));

  let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let side: 'LONG' | 'SHORT' | 'FLAT' = 'FLAT';
  let reason = 'No trade: waiting for cleaner trend and volatility expansion.';

  const cleanEnough = quality >= 78 && confidence >= 76 && atrPct >= 0.25 && compressionScore < 80;
  if (cleanEnough && trendUp && (breakoutUp || last > fastLast)) {
    action = 'BUY';
    side = 'LONG';
    reason = 'Long candidate: trend aligned, volatility acceptable, structure supportive.';
  } else if (cleanEnough && trendDown && (breakoutDown || last < fastLast)) {
    action = 'SELL';
    side = 'SHORT';
    reason = 'Short candidate: trend aligned, volatility acceptable, structure supportive.';
  }

  const stopDistance = Math.max(atrLast * 1.6, last * 0.012);
  const takeDistance = stopDistance * 2;
  const stopPrice = side === 'LONG' ? last - stopDistance : side === 'SHORT' ? last + stopDistance : null;
  const takeProfitPrice = side === 'LONG' ? last + takeDistance : side === 'SHORT' ? last - takeDistance : null;

  return {
    symbol,
    action,
    side,
    status: action === 'HOLD' ? 'WATCH' : 'READY',
    lastPrice: last,
    quality,
    confidence,
    trendScore: Math.round(trendScore),
    atrPct,
    compressionScore,
    score: Math.round(quality * 0.58 + confidence * 0.42),
    reason,
    stopPrice,
    takeProfitPrice,
    candlesAnalysed: candles.length
  };
}

export function parseKlines(rows: unknown[]): Candle[] {
  return rows.map((row) => {
    const r = row as unknown[];
    return {
      openTime: toNumber(r[0]),
      open: toNumber(r[1]),
      high: toNumber(r[2]),
      low: toNumber(r[3]),
      close: toNumber(r[4]),
      volume: toNumber(r[5]),
      closeTime: toNumber(r[6])
    };
  }).filter(c => c.close > 0);
}
