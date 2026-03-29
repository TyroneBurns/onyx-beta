import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PnlChip({ value }: { value: string }) {
  const positive = value.startsWith('+');
  const negative = value.startsWith('-');

  return (
    <span className={cn('inline-flex items-center gap-2 rounded-[20px] border px-3 py-2 text-base font-medium', positive && 'border-emerald-500/18 bg-emerald-500/8 text-emerald-300 shadow-glow', negative && 'border-rose-500/20 bg-rose-500/8 text-rose-300 shadow-danger', !positive && !negative && 'border-white/10 bg-white/5 text-slate-300')}>
      {positive ? <ArrowUpRight className="h-4 w-4" /> : negative ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      {value}
    </span>
  );
}
