import { NextResponse } from 'next/server';
import { DEFAULT_UNIVERSE, candidateFromTicker, parseKlines, signalFromCandles, toNumber, normalise } from '@/lib/onyx-engine';
import type { Candle, MarketCandidate, MarketSnapshot, TradeSignal } from '@/lib/onyx-types';

export const dynamic = 'force-dynamic';

type CacheEntry = { at: number; data: MarketSnapshot };
const cache = new Map<string, CacheEntry>();
const CACHE_MS = 1000 * 60 * 3;

const BINANCE_BASES = [
  'https://api.binance.com',
  'https://api1.binance.com',
  'https://api2.binance.com',
  'https://api3.binance.com',
  'https://data-api.binance.vision'
];

const COINBASE_BASE = 'https://api.exchange.coinbase.com';

function timeoutSignal(ms = 8500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

async function fetchJson<T>(url: string): Promise<T> {
  const timeout = timeoutSignal();
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': 'ONYX-paper-trader/1.1',
        'accept': 'application/json'
      },
      signal: timeout.signal,
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Market fetch failed: ${res.status} ${url}${text ? ` — ${text.slice(0, 120)}` : ''}`);
    }

    return res.json() as Promise<T>;
  } finally {
    timeout.cancel();
  }
}

async function tryFetchJson<T>(urls: string[]): Promise<{ data: T; url: string }> {
  let lastError: unknown = null;
  for (const url of urls) {
    try {
      return { data: await fetchJson<T>(url), url };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('All market sources failed');
}

function requestedUniverseFromParam(param: string | null) {
  const list = param
    ? param.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : DEFAULT_UNIVERSE;

  return Array.from(new Set(list));
}

function symbolToBase(symbol: string) {
  return symbol.replace(/USDT$|USD$|USDC$/g, '');
}

function coinbaseProductForSymbol(symbol: string) {
  const base = symbolToBase(symbol);
  return `${base}-USD`;
}

function coinbaseSymbolForProduct(productId: string) {
  return productId.replace('-USD', 'USDT');
}

function candidateFromCoinbase(symbol: string, ticker: Record<string, unknown>, stats: Record<string, unknown>): MarketCandidate | null {
  const lastPrice = toNumber(ticker.price || stats.last);
  const open = toNumber(stats.open);
  const high = toNumber(stats.high);
  const low = toNumber(stats.low);
  const volume = toNumber(stats.volume);
  if (!lastPrice || !volume) return null;

  const priceChangePct24h = open ? ((lastPrice - open) / open) * 100 : 0;
  const volatilityPct = lastPrice ? ((high - low) / lastPrice) * 100 : 0;
  const quoteVolume = volume * lastPrice;

  const liquidityScore = normalise(Math.log10(Math.max(quoteVolume, 1)), 5.5, 10.2);
  const momentumScore = Math.min(100, Math.abs(priceChangePct24h) * 8);
  const volatilityScore = volatilityPct >= 1.2 && volatilityPct <= 9 ? 100 - Math.abs(volatilityPct - 4.2) * 13 : 35;
  const researchScore = Math.round(liquidityScore * 0.45 + momentumScore * 0.28 + volatilityScore * 0.27);
  const direction = priceChangePct24h >= 0 ? 'positive 24h momentum' : 'negative 24h momentum';

  return {
    symbol,
    baseAsset: symbolToBase(symbol),
    lastPrice,
    priceChangePct24h,
    quoteVolume,
    volatilityPct,
    liquidityScore: Math.round(liquidityScore),
    momentumScore: Math.round(momentumScore),
    volatilityScore: Math.round(volatilityScore),
    researchScore,
    reason: `${direction}, ${volatilityPct.toFixed(2)}% range, Coinbase public liquidity`
  };
}

function parseCoinbaseCandles(rows: unknown[]): Candle[] {
  return rows.map((row) => {
    const r = row as unknown[];
    const time = toNumber(r[0]) * 1000;
    return {
      openTime: time,
      low: toNumber(r[1]),
      high: toNumber(r[2]),
      open: toNumber(r[3]),
      close: toNumber(r[4]),
      volume: toNumber(r[5]),
      closeTime: time
    };
  }).filter(c => c.close > 0).sort((a, b) => a.openTime - b.openTime);
}

function coinbaseGranularity(interval: string) {
  if (interval === '5m') return 300;
  if (interval === '15m') return 900;
  if (interval === '1h') return 3600;
  if (interval === '4h') return 21600;
  return 900;
}

function holdSignal(symbol: string, lastPrice = 0, reason = 'Market candles unavailable, keeping pair on watch only.'): TradeSignal {
  return {
    symbol,
    action: 'HOLD',
    side: 'FLAT',
    status: 'WATCH',
    lastPrice,
    quality: 0,
    confidence: 0,
    trendScore: 0,
    atrPct: 0,
    compressionScore: 100,
    score: 0,
    reason,
    stopPrice: null,
    takeProfitPrice: null,
    candlesAnalysed: 0
  };
}

async function buildFromBinance(interval: string, limit: number, maxPairs: number, requestedUniverse: string[]): Promise<MarketSnapshot> {
  const tickerUrls = BINANCE_BASES.map(base => `${base}/api/v3/ticker/24hr`);
  const tickerResult = await tryFetchJson<Record<string, unknown>[]>(tickerUrls);

  const universeSet = new Set(requestedUniverse);
  const selectedPairs = tickerResult.data
    .map(candidateFromTicker)
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .filter(x => universeSet.has(x.symbol))
    .sort((a, b) => b.researchScore - a.researchScore)
    .slice(0, maxPairs);

  const signals = await Promise.all(selectedPairs.map(async (pair) => {
    try {
      const klineUrls = BINANCE_BASES.map(base => `${base}/api/v3/klines?symbol=${pair.symbol}&interval=${interval}&limit=${limit}`);
      const klines = await tryFetchJson<unknown[]>(klineUrls);
      return signalFromCandles(pair.symbol, parseKlines(klines.data));
    } catch {
      return holdSignal(pair.symbol, pair.lastPrice);
    }
  }));

  return snapshotPayload({
    interval,
    source: `Binance public market data via ${new URL(tickerResult.url).host}`,
    requestedUniverse,
    selectedPairs,
    signals
  });
}

async function buildFromCoinbase(interval: string, limit: number, maxPairs: number, requestedUniverse: string[]): Promise<MarketSnapshot> {
  const productIds = requestedUniverse
    .map(coinbaseProductForSymbol)
    .filter((value, index, arr) => arr.indexOf(value) === index);

  const candidates: MarketCandidate[] = [];

  await Promise.all(productIds.map(async (productId) => {
    try {
      const [ticker, stats] = await Promise.all([
        fetchJson<Record<string, unknown>>(`${COINBASE_BASE}/products/${productId}/ticker`),
        fetchJson<Record<string, unknown>>(`${COINBASE_BASE}/products/${productId}/stats`)
      ]);
      const candidate = candidateFromCoinbase(coinbaseSymbolForProduct(productId), ticker, stats);
      if (candidate) candidates.push(candidate);
    } catch {
      // Some requested coins, e.g. BNB, are not listed on Coinbase. Ignore them.
    }
  }));

  const selectedPairs = candidates
    .sort((a, b) => b.researchScore - a.researchScore)
    .slice(0, maxPairs);

  const granularity = coinbaseGranularity(interval);
  const signals = await Promise.all(selectedPairs.map(async (pair) => {
    try {
      const productId = coinbaseProductForSymbol(pair.symbol);
      const candles = await fetchJson<unknown[]>(`${COINBASE_BASE}/products/${productId}/candles?granularity=${granularity}`);
      return signalFromCandles(pair.symbol, parseCoinbaseCandles(candles).slice(-limit));
    } catch {
      return holdSignal(pair.symbol, pair.lastPrice);
    }
  }));

  return snapshotPayload({
    interval,
    source: 'Coinbase Exchange public market data fallback, no API key required',
    requestedUniverse,
    selectedPairs,
    signals
  });
}

function snapshotPayload(input: {
  interval: string;
  source: string;
  requestedUniverse: string[];
  selectedPairs: MarketCandidate[];
  signals: TradeSignal[];
}): MarketSnapshot {
  const ready = input.signals.filter(s => s.action !== 'HOLD').length;
  const mode = ready > 0 ? 'Opportunity scan' : 'Research / watch only';

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    mode,
    interval: input.interval,
    source: input.source,
    universeSize: input.requestedUniverse.length,
    selectedPairs: input.selectedPairs,
    signals: input.signals.sort((a, b) => b.score - a.score),
    notes: [
      'ONYX researches the market first, then filters for trend, volatility and structure before allowing paper trades.',
      'Set & Forget stayed too chop-dominated, so ONYX now avoids being locked to one fixed strategy or one fixed group of pairs.',
      'This scan uses public market data only. Keep it paper mode until expectancy and profit factor prove themselves.'
    ]
  };
}

export async function GET(request: Request) {
  const now = Date.now();
  const url = new URL(request.url);
  const interval = url.searchParams.get('interval') || '15m';
  const limit = Number(url.searchParams.get('limit') || 120);
  const maxPairs = Math.min(Math.max(Number(url.searchParams.get('pairs') || 6), 1), 10);
  const requestedUniverse = requestedUniverseFromParam(url.searchParams.get('universe'));
  const cacheKey = `${interval}:${limit}:${maxPairs}:${requestedUniverse.join(',')}`;

  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (now - entry.at < CACHE_MS) {
      return NextResponse.json({ ...entry.data, cached: true });
    }
  }

  try {
    let data: MarketSnapshot;

    try {
      data = await buildFromBinance(interval, limit, maxPairs, requestedUniverse);
    } catch {
      data = await buildFromCoinbase(interval, limit, maxPairs, requestedUniverse);
    }

    cache.set(cacheKey, { at: now, data });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown market snapshot error',
        hint: 'Binance can return 451 from some regions. ONYX now falls back to Coinbase, but all public market sources failed on this request.'
      },
      { status: 500 }
    );
  }
}
