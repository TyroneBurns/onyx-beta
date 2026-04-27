import { activityFeed } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { MarketIcon } from '@/components/ui/market-icon';

export function LiveActivity() {
  return (
    <Card className="p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Activity</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Live decision feed</h3>
        </div>
        <StatusPill label="Streaming" tone="positive" pulse />
      </div>
      <div className="space-y-4">
        {activityFeed.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/6 bg-white/4 p-4">
            <div className="flex items-start gap-3">
              <MarketIcon market={item.market} className="h-10 w-10 rounded-2xl" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      item.tone === 'positive'
                        ? 'bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.4)]'
                        : item.tone === 'warning'
                          ? 'bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.35)]'
                          : 'bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]'
                    }`}
                  />
                  <p className="text-sm font-medium text-white">{item.title}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.meta}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
