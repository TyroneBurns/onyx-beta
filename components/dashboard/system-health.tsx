import { systemHealth } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';

export function SystemHealth() {
  return (
    <Card className="p-5 md:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">System</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Infrastructure health</h3>
      </div>
      <div className="space-y-3">
        {systemHealth.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/4 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="mt-1 text-xs text-slate-400">{item.value}</p>
            </div>
            <StatusPill label={item.status} tone={item.status === 'Healthy' ? 'positive' : 'warning'} />
          </div>
        ))}
      </div>
    </Card>
  );
}
