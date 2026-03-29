import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { signalCards } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { MarketIcon } from '@/components/ui/market-icon';
import { StatusPill } from '@/components/ui/status-pill';

export function SignalGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {signalCards.map((signal) => (
        <Card key={signal.pair} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <MarketIcon market={signal.pair} className="h-12 w-12" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{signal.pair}</p>
                <div className="mt-1 flex items-center gap-2 text-2xl font-semibold text-white">
                  {signal.bias === 'Long' ? <ArrowUpRight className="h-5 w-5 text-emerald-300" /> : <ArrowDownRight className="h-5 w-5 text-cyan-300" />}
                  {signal.bias} bias
                </div>
              </div>
            </div>
            <StatusPill label={signal.status} tone={signal.status === 'Live' ? 'positive' : signal.status === 'Queued' ? 'info' : 'warning'} pulse={signal.status === 'Live'} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-white/8 bg-black/18 p-4">
              <p className="text-sm text-slate-500">Confidence</p>
              <p className="mt-3 text-3xl font-semibold text-white">{signal.confidence}%</p>
            </div>
            <div className="rounded-[20px] border border-white/8 bg-black/18 p-4">
              <p className="text-sm text-slate-500">Quality</p>
              <p className="mt-3 text-3xl font-semibold text-white">{signal.quality}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[20px] border border-emerald-500/12 bg-emerald-500/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">Tradability</p>
              <span className="font-mono text-sm text-emerald-300">{signal.tradability}/100</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/80 to-cyan-300/80" style={{ width: `${signal.tradability}%` }} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">{signal.note}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
            <span>{signal.regime}</span>
            <span>•</span>
            <span>{signal.conviction}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
