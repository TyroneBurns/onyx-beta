import { systemHealth } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';

export function SystemHealth() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">System</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Infrastructure health</h3>
      <div className="mt-6 space-y-4">
        {systemHealth.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="mt-1 text-xs text-slate-500">{item.value}</p>
              </div>
              <StatusPill label={item.status} tone={item.status === 'Healthy' ? 'positive' : 'warning'} pulse={item.status === 'Healthy'} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
