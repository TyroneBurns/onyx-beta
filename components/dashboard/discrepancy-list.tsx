import { shadowComparisons } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { PnlChip } from '@/components/ui/pnl-chip';

export function DiscrepancyList() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Shadow vs live</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Execution discrepancies</h3>
      <div className="mt-6 space-y-4">
        {shadowComparisons.map((item) => (
          <div key={item.symbol} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{item.symbol}</p>
                <p className="mt-1 text-sm text-slate-500">{item.action} · {item.cause}</p>
              </div>
              <PnlChip value={item.discrepancy} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Expected</p>
                <p className="mt-2 font-mono text-white">{item.expected}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Realised</p>
                <p className="mt-2 font-mono text-white">{item.realised}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
