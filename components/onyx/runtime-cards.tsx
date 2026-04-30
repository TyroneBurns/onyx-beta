'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function RuntimeStat({ label, value, note, tone = 'neutral' }: { label: string; value: string; note?: string; tone?: 'good' | 'bad' | 'neutral' | 'warn' }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className={cn(
        'mt-3 text-3xl font-semibold',
        tone === 'good' && 'text-emerald-300',
        tone === 'bad' && 'text-rose-300',
        tone === 'warn' && 'text-amber-200',
        tone === 'neutral' && 'text-white'
      )}>{value}</div>
      {note ? <p className="mt-2 text-sm text-slate-400">{note}</p> : null}
    </Card>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'good' | 'bad' | 'neutral' | 'warn' | 'cyan' }) {
  return (
    <span className={cn(
      'rounded-full border px-3 py-1 text-xs font-semibold',
      tone === 'good' && 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200',
      tone === 'bad' && 'border-rose-300/25 bg-rose-400/10 text-rose-200',
      tone === 'warn' && 'border-amber-300/25 bg-amber-400/10 text-amber-100',
      tone === 'cyan' && 'border-cyan-300/25 bg-cyan-400/10 text-cyan-100',
      tone === 'neutral' && 'border-white/10 bg-white/5 text-slate-300'
    )}>
      {children}
    </span>
  );
}
