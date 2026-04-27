import { NextResponse } from 'next/server';
import { DEFAULT_UNIVERSE, candidateFromTicker, parseKlines, signalFromCandles } from '@/lib/onyx-engine';
import type { MarketSnapshot } from '@/lib/onyx-types';

export const dynamic = 'force-dynamic';

let cache: { at: number; data: MarketSnapshot } | null = null;
const CACHE_MS = 1000 * 60 * 2;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'user-agent': 'ONYX-paper-trader/1.0' },
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error(`Market fetch failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

export async function GET(request: Request) {
  try {
    const now = Date.now();
    const url = new URL(request.url);
    const interval = url.searchParams.get('interval') || '15m';
    const limit = Number(url.searchParams.get('limit') || 120);
    const maxPairs = Math.min(Number(url.searchParams.get('pairs') || 6), 10);
    const universeParam = url.searchParams.get('universe');

    if (cache && now - cache.at < CACHE_MS && cache.data.interval === interval) {
      return NextResponse.json({ ...cache.data, cached: true });
    }

    const tickers = await fetchJson<Record<string, unknown>[]>('https://api.binance.com/api/v3/ticker/24hr');
    const requestedUniverse = universeParam
      ? universeParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      : DEFAULT_UNIVERSE;
    const universeSet = new Set(requestedUniverse);

    const selectedPairs = tickers
      .map(candidateFromTicker)
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .filter(x => universeSet.has(x.symbol))
      .sort((a, b) => b.researchScore - a.researchScore)
      .slice(0, maxPairs);

    const signals = await Promise.all(selectedPairs.map(async (pair) => {
      try {
        const klines = await fetchJson<unknown[]>(`https://api.binance.com/api/v3/klines?symbol=${pair.symbol}&interval=${interval}&limit=${limit}`);
        return signalFromCandles(pair.symbol, parseKlines(klines));
      } catch {
        return {
          symbol: pair.symbol,
          action: 'HOLD' as const,
          side: 'FLAT' as const,
          status: 'WATCH' as const,
          lastPrice: pair.lastPrice,
          quality: 0,
          confidence: 0,
          trendScore: 0,
          atrPct: 0,
          compressionScore: 100,
          score: 0,
          reason: 'Market candles unavailable, keeping pair on watch only.',
          stopPrice: null,
          takeProfitPrice: null,
          candlesAnalysed: 0
        };
      }
    }));

    const ready = signals.filter(s => s.action !== 'HOLD').length;
    const mode = ready > 0 ? 'Opportunity scan' : 'Research / watch only';

    const data: MarketSnapshot = {
      ok: true,
      generatedAt: new Date().toISOString(),
      mode,
      interval,
      source: 'Binance public market data, no API key required',
      universeSize: requestedUniverse.length,
      selectedPairs,
      signals: signals.sort((a, b) => b.score - a.score),
      notes: [
        'ONYX researches a defined USDT universe, ranks pairs by liquidity, volatility and 24h momentum, then only paper-trades signals that pass trend, volatility and structure checks.',
        'This replaces the Set & Forget Northflank worker approach and should use far fewer external calls.',
        'Keep this in paper mode until expectancy is positive over a proper forward test.'
      ]
    };

    cache = { at: now, data };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown market snapshot error' },
      { status: 500 }
    );
  }
}
