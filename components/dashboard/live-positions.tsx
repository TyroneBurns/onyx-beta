import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { livePositions } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { MarketIcon } from '@/components/ui/market-icon';
import { PnlChip } from '@/components/ui/pnl-chip';
import { StatusPill } from '@/components/ui/status-pill';

export function LivePositions() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Live positions</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Open exposure</h3>
      <div className="mt-6 space-y-4">
        {livePositions.map((position) => (
          <div key={position.market} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <MarketIcon market={position.market} className="h-12 w-12" />
                <div>
                  <p className="font-medium text-white">{position.market}</p>
                  <p className="mt-1 text-xs text-slate-500">{position.exposure} exposure</p>
                </div>
              </div>
              <StatusPill label={position.status} tone="info" pulse />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ${position.side === 'Long' ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/15' : 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/15'}`}>
                {position.side === 'Long' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {position.side}
              </span>
              <PnlChip value={position.pnl} />
            </div>
            <p className="mt-4 text-sm text-slate-400">{position.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
