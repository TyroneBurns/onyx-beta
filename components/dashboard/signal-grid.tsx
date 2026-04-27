import { ArrowDownRight, ArrowUpRight, Radar, Sparkles } from 'lucide-react';
import { signalCards } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { MarketIcon } from '@/components/ui/market-icon';
import { cn } from '@/lib/utils';

export function SignalGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {signalCards.map((signal) => {
        const longBias = signal.bias === 'Long';
        const statusTone: 'positive' | 'info' | 'warning' = signal.status === 'Live' ? 'positive' : signal.status === 'Queued' ? 'info' : 'warning';
        const confidenceValue = Number.parseInt(signal.confidence, 10);
        const qualityValue = Number.parseInt(signal.quality, 10);

        return (
          <Card
            key={signal.pair}
            className={cn(
              'overflow-hidden p-5',
              longBias ? 'shadow-[0_0_40px_rgba(16,185,129,0.06)]' : 'shadow-[0_0_40px_rgba(34,211,238,0.06)]'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <MarketIcon market={signal.pair} className="h-11 w-11 rounded-2xl" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-500">{signal.pair}</p>
                    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">{signal.conviction}</span>
                  </div>
                  <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                    {longBias ? <ArrowUpRight className="h-4 w-4 text-emerald-300" /> : <ArrowDownRight className="h-4 w-4 text-cyan-300" />}
                    {signal.bias} bias
                  </h3>
                </div>
              </div>
              <StatusPill label={signal.status} tone={statusTone} pulse={signal.status === 'Live'} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/6 bg-white/4 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">Confidence</p>
                  <p className="font-mono text-sm text-white">{signal.confidence}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
                  <div className={cn('h-full rounded-full', longBias ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-300/70' : 'bg-gradient-to-r from-cyan-500/80 to-sky-300/70')} style={{ width: `${confidenceValue}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/4 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">Quality</p>
                  <p className="font-mono text-sm text-white">{signal.quality}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
                  <div className={cn('h-full rounded-full', qualityValue >= 82 ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-300/70' : 'bg-gradient-to-r from-amber-400/80 to-rose-400/60')} style={{ width: `${qualityValue}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/6 bg-black/18 p-3.5">
              <div className="flex items-start gap-2 text-sm text-slate-300">
                <Sparkles className={cn('mt-0.5 h-4 w-4 shrink-0', longBias ? 'text-emerald-300' : 'text-cyan-300')} />
                <p>{signal.note}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Radar className="h-4 w-4 text-slate-500" />
              <span>{signal.regime}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
