'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BrainCircuit, ShieldAlert, Trophy, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function resolveIcon(label: string) {
  if (label.toLowerCase().includes('p&l')) return Wallet;
  if (label.toLowerCase().includes('win')) return Trophy;
  if (label.toLowerCase().includes('exposure')) return ShieldAlert;
  return BrainCircuit;
}

export function KpiCard({
  label,
  value,
  delta,
  detail,
  tone,
  progress,
  footnote,
  index = 0
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
  tone: 'positive' | 'warning' | 'info';
  progress?: number;
  footnote?: string;
  index?: number;
}) {
  const positive = delta.startsWith('+');
  const Icon = resolveIcon(label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: index * 0.06 }}
      className="min-w-0"
    >
      <Card
        className={cn(
          'group relative overflow-hidden p-5 transition-transform duration-200 hover:-translate-y-0.5',
          positive && 'shadow-[0_0_48px_rgba(16,185,129,0.08)]',
          !positive && tone === 'warning' && 'shadow-[0_0_48px_rgba(244,63,94,0.07)]',
          tone === 'info' && 'shadow-[0_0_48px_rgba(34,211,238,0.06)]'
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <div className="mt-4 flex items-end gap-2">
              <h3 className="truncate text-3xl font-semibold tracking-[-0.04em] text-white">{value}</h3>
            </div>
          </div>
          <div
            className={cn(
              'rounded-2xl p-2.5 ring-1',
              positive && 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/15',
              !positive && tone === 'warning' && 'bg-rose-500/10 text-rose-300 ring-rose-500/15',
              tone === 'info' && 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/15'
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1', positive ? 'bg-emerald-500/12 text-emerald-300 ring-emerald-500/20' : tone === 'warning' ? 'bg-rose-500/12 text-rose-300 ring-rose-500/20' : 'bg-cyan-500/12 text-cyan-300 ring-cyan-500/20')}>
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {delta}
          </span>
          <span className="text-slate-500">•</span>
          <span className="min-w-0 truncate text-slate-400">{detail}</span>
        </div>

        {typeof progress === 'number' ? (
          <div className="mt-5 space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-white/6">
              <div
                className={cn(
                  'h-full rounded-full',
                  tone === 'warning' ? 'bg-gradient-to-r from-rose-500/80 to-amber-400/70' : tone === 'info' ? 'bg-gradient-to-r from-cyan-500/80 to-sky-300/70' : 'bg-gradient-to-r from-emerald-500/80 to-emerald-300/70'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            {footnote ? <p className="text-xs text-slate-500">{footnote}</p> : null}
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
