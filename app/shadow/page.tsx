import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { DiscrepancyList } from '@/components/dashboard/discrepancy-list';
import { PerformanceChart } from '@/components/charts/performance-chart';
import { Card } from '@/components/ui/card';

export default function ShadowPage() {
  return (
    <AppShell title="Shadow" subtitle="The safest place to harden tradability: compare expected edge, fills, and adverse selection before scaling live.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading eyebrow="Shadow engine" title="Expected vs realised execution" description="The core loop is simple: predict what should happen, measure what actually happened, then tighten the model." />
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <DiscrepancyList />
          <PerformanceChart />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ['Fill match rate', '89%', 'How often the shadow fill logic lines up with live market behaviour.'],
            ['Adverse selection', '1.3 bps', 'Average post-fill move against the entry.'],
            ['Passive capture', '63%', 'Share of filled entries that did not need crossing.']
          ].map(([title, value, text]) => (
            <Card key={title} className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Metric</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-slate-400">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
