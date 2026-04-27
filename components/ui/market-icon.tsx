import { cn } from '@/lib/utils';

function baseMarket(market: string) {
  const normalized = market.toUpperCase();
  if (normalized.startsWith('BTC')) return 'btc';
  if (normalized.startsWith('ETH')) return 'eth';
  if (normalized.startsWith('SOL')) return 'sol';
  if (normalized.startsWith('XAU')) return 'xau';
  if (normalized.startsWith('NAS')) return 'nas';
  return 'generic';
}

export function MarketIcon({ market, className }: { market: string; className?: string }) {
  const kind = baseMarket(market);

  return (
    <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1522] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]', className)}>
      {kind === 'btc' ? (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
          <circle cx="20" cy="20" r="18" fill="#F7931A" />
          <path d="M23.8 11.8c2.2.5 3.5 1.9 3.8 4.1.3 2.6-1 4.2-3.1 5 2.8.7 4.4 2.6 4 5.8-.5 3.6-3.6 5.4-7.8 5.4h-2v2.7h-2.3v-2.7h-2V12.3h2v-2.6h2.3v2.6h1.1V9.7h2.3v2.1Zm-2.8 8c1.8 0 3-.7 3-2.2 0-1.6-1.2-2.2-3-2.2h-2.3v4.4Zm.5 8.7c2.2 0 3.6-.8 3.6-2.5 0-1.9-1.4-2.6-3.6-2.6h-2.8v5.1Z" fill="white" opacity="0.96" />
        </svg>
      ) : kind === 'eth' ? (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
          <defs>
            <linearGradient id="ethTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9CA3FF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="18" fill="#0F172A" />
          <path d="M20 8.5 12.8 20 20 16.2 27.2 20Z" fill="url(#ethTop)" />
          <path d="M20 17.7 12.8 21.5 20 31.5 27.2 21.5Z" fill="#94A3B8" />
          <path d="M20 8.5v7.7L27.2 20Z" fill="#CBD5E1" opacity="0.9" />
        </svg>
      ) : kind == 'sol' ? (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
          <defs>
            <linearGradient id="solGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="36" height="36" rx="18" fill="#0B1020" />
          <path d="M13 12.5h14l-2.7 3.2H10.3Z" fill="url(#solGrad)" />
          <path d="M16 18.5h14l-2.7 3.2H13.3Z" fill="url(#solGrad)" />
          <path d="M13 24.5h14l-2.7 3.2H10.3Z" fill="url(#solGrad)" />
        </svg>
      ) : kind === 'xau' ? (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
          <circle cx="20" cy="20" r="18" fill="#EAB308" />
          <text x="20" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#111827">Au</text>
        </svg>
      ) : kind === 'nas' ? (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
          <rect x="2" y="2" width="36" height="36" rx="18" fill="#0F2A4D" />
          <path d="M11 24.5 16.5 19 20 22.2 28 14" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="14" r="2.2" fill="#BFDBFE" />
        </svg>
      ) : (
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">{market.slice(0, 3)}</span>
      )}
    </span>
  );
}
