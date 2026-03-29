import { AppShell } from '@/components/layout/app-shell';
import { KpiCard } from '@/components/ui/kpi-card';
import { overviewKpis, heroStats } from '@/data/mock';
import { PerformanceChart } from '@/components/charts/performance-chart';
import { EquityChart } from '@/components/charts/equity-chart';
import { LiveActivity } from '@/components/dashboard/live-activity';
import { SignalGrid } from '@/components/dashboard/signal-grid';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { SystemHealth } from '@/components/dashboard/system-health';
import { TradesTable } from '@/components/table/trades-table';
import { Card } from '@/components/ui/card';

export default function OverviewPage() {
  return (
    <AppShell title="ONYX Control Centre" subtitle="Beta control plane for research, shadow, and live trading workflows with a clean Vercel-ready deployment path.">
      <section className="space-y-8 overflow-safe">
        <Card className="p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {heroStats.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 xl:grid-cols-4">
          {overviewKpis.map((item) => <KpiCard key={item.label} {...item} />)}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.6fr_0.95fr]">
          <PerformanceChart />
          <LiveActivity />
        </div>

        <div className="space-y-4">
          <SectionHeading eyebrow="Signal board" title="High-conviction opportunities" description="Signals are ranked by confidence, quality, and tradability after expected execution costs." action={<Button>View signal queue</Button>} />
          <SignalGrid />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <EquityChart />
          <SystemHealth />
        </div>

        <TradesTable />
      </section>
    </AppShell>
  );
}
