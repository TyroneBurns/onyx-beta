import { AppShell } from '@/components/layout/app-shell';
import { PerformanceChart } from '@/components/charts/performance-chart';
import { EquityChart } from '@/components/charts/equity-chart';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { kpis } from '@/data/mock';
import { KpiCard } from '@/components/ui/kpi-card';

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="Performance, equity behaviour, and regime quality across the ONYX stack.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading
          eyebrow="Insight layer"
          title="Performance and capital analytics"
          description="A more premium, investor-grade analytics view with cleaner hierarchy and chart presentation."
        />

        <div className="grid gap-4 xl:grid-cols-4">
          {kpis.map((item, index) => (
            <KpiCard key={item.label} index={index} {...item} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <PerformanceChart />
          <EquityChart />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-6 xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Breakdown</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Regime contribution</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ['Trend expansion', '41.8%', 'Best performer'],
                ['Controlled breakout', '32.1%', 'Consistent'],
                ['Chop avoidance', '26.1%', 'Loss reducer']
              ].map(([title, value, note]) => (
                <div key={title} className="rounded-2xl border border-white/6 bg-white/4 p-4">
                  <p className="text-sm text-slate-400">{title}</p>
                  <p className="mt-3 font-mono text-2xl text-white">{value}</p>
                  <p className="mt-2 text-xs text-slate-500">{note}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Risk state</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Drawdown controls</h3>
            <div className="mt-6 space-y-4">
              {[
                ['Current drawdown', '2.1%'],
                ['Max drawdown', '6.4%'],
                ['Trade suppression', 'Active'],
                ['Noise filter', 'Tightened']
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/4 px-4 py-3">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="font-mono text-sm text-white">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
