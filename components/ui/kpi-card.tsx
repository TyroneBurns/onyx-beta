import { BrainCircuit, Gauge, Radar, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function resolveIcon(label: string) {
  if (label.toLowerCase().includes('p&l')) return Wallet;
  if (label.toLowerCase().includes('shadow')) return Radar;
  if (label.toLowerCase().includes('latency')) return Gauge;
  return BrainCircuit;
}

export function KpiCard({ label, value, delta, detail, tone, progress, footnote }: { label: string; value: string; delta: string; detail: string; tone: 'positive' | 'warning' | 'info'; progress?: number; footnote?: string }) {
  const positive = delta.startsWith('+');
  const Icon = resolveIcon(label);
  return (
    <Card className={cn('p-5', positive && 'shadow-[0_0_44px_rgba(16,185,129,0.09)]', !positive && tone === 'warning' && 'shadow-[0_0_44px_rgba(244,63,94,0.08)]', tone === 'info' && 'shadow-[0_0_44px_rgba(34,211,238,0.08)]')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <h3 className="mt-4 truncate text-3xl font-semibold tracking-[-0.04em] text-white">{value}</h3>
        </div>
        <div className={cn('rounded-2xl p-3 ring-1', positive ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/15' : tone === 'warning' ? 'bg-rose-500/10 text-rose-300 ring-rose-500/15' : 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/15')}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-300">
        <span className={cn('rounded-full px-2.5 py-1 ring-1', positive ? 'bg-emerald-500/12 text-emerald-300 ring-emerald-500/20' : tone === 'warning' ? 'bg-rose-500/12 text-rose-300 ring-rose-500/20' : 'bg-cyan-500/12 text-cyan-300 ring-cyan-500/20')}>
          {delta}
        </span>
        <span className="text-slate-500">•</span>
        <span className="min-w-0 truncate text-slate-400">{detail}</span>
      </div>
      {typeof progress === 'number' ? (
        <div className="mt-5 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-white/6">
            <div className={cn('h-full rounded-full', tone === 'warning' ? 'bg-gradient-to-r from-rose-500/80 to-amber-400/70' : tone === 'info' ? 'bg-gradient-to-r from-cyan-500/80 to-sky-300/70' : 'bg-gradient-to-r from-emerald-500/80 to-emerald-300/70')} style={{ width: `${progress}%` }} />
          </div>
          {footnote ? <p className="text-xs text-slate-500">{footnote}</p> : null}
        </div>
      ) : null}
    </Card>
  );
}
