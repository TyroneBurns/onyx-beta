import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PnlChip({ value, className }: { value: string; className?: string }) {
  const positive = value.trim().startsWith('+');
  const negative = value.trim().startsWith('-');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-sm ring-1',
        positive && 'bg-emerald-500/12 text-emerald-300 ring-emerald-500/20 shadow-[0_0_26px_rgba(16,185,129,0.12)]',
        negative && 'bg-rose-500/12 text-rose-300 ring-rose-500/20 shadow-[0_0_26px_rgba(244,63,94,0.12)]',
        !positive && !negative && 'bg-white/6 text-slate-200 ring-white/10',
        className
      )}
    >
      {positive ? <ArrowUpRight className="h-4 w-4" /> : negative ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      {value}
    </span>
  );
}
