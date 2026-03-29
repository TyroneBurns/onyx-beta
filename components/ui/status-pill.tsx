import { cn } from '@/lib/utils';

export function StatusPill({ label, tone = 'neutral', pulse = false }: { label: string; tone?: 'positive' | 'warning' | 'info' | 'neutral'; pulse?: boolean }) {
  const tones = {
    positive: 'border-emerald-500/18 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    info: 'border-cyan-500/18 bg-cyan-500/10 text-cyan-300',
    neutral: 'border-white/10 bg-white/5 text-slate-300'
  };

  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]', tones[tone])}>
      <span className={cn('h-2 w-2 rounded-full', tone === 'positive' && 'bg-emerald-400', tone === 'warning' && 'bg-amber-400', tone === 'info' && 'bg-cyan-400', tone === 'neutral' && 'bg-slate-400', pulse && 'animate-pulse')} />
      {label}
    </span>
  );
}
