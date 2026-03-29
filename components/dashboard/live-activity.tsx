import { AlertTriangle, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import { activityFeed } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';

const iconMap = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  info: Sparkles
};

export function LiveActivity() {
  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Activity</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Live decision feed</h3>
        </div>
        <StatusPill label="Streaming" tone="positive" pulse />
      </div>
      <div className="mt-6 space-y-4">
        {activityFeed.map((item) => {
          const Icon = iconMap[item.tone];
          return (
            <div key={item.title} className="flex gap-3 rounded-[22px] border border-white/8 bg-black/18 p-4">
              <div className="mt-0.5 rounded-2xl border border-white/8 bg-white/5 p-2 text-emerald-300">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
