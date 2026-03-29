import { researchRuns } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';

export function ResearchRuns() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Research runs</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Latest replay and walk-forward results</h3>
      <div className="mt-6 space-y-4">
        {researchRuns.map((run) => (
          <div key={run.name} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-xl">
                <p className="font-medium text-white">{run.name}</p>
                <p className="mt-1 text-sm text-slate-500">{run.venue} · {run.window}</p>
              </div>
              <StatusPill label={run.status} tone={run.status === 'Healthy' ? 'positive' : run.status === 'Monitoring' ? 'warning' : 'warning'} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Sharpe</p>
                <p className="mt-2 font-mono text-white">{run.sharpe}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">P&L</p>
                <p className="mt-2 font-mono text-white">{run.pnl}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">{run.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
