import { cn } from '@/lib/utils';

const config: Record<string, { bg: string; label: string }> = {
  BTC: { bg: 'from-orange-400 to-orange-500', label: '₿' },
  ETH: { bg: 'from-slate-400 to-indigo-300', label: 'Ξ' },
  SOL: { bg: 'from-violet-400 to-cyan-300', label: 'S' },
  NAS: { bg: 'from-sky-500 to-blue-400', label: 'N' },
  XAU: { bg: 'from-yellow-400 to-amber-300', label: 'Au' }
};

function resolveToken(market: string) {
  if (market.startsWith('BTC')) return config.BTC;
  if (market.startsWith('ETH')) return config.ETH;
  if (market.startsWith('SOL')) return config.SOL;
  if (market.startsWith('NAS')) return config.NAS;
  if (market.startsWith('XAU')) return config.XAU;
  return { bg: 'from-emerald-400 to-emerald-500', label: 'O' };
}

export function MarketIcon({ market, className }: { market: string; className?: string }) {
  const token = resolveToken(market);
  return (
    <div className={cn('grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(255,255,255,0.06)]', token.bg, className)}>
      {token.label}
    </div>
  );
}
