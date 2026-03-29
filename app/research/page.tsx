import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { ResearchRuns } from '@/components/dashboard/research-runs';
import { LatencyChart } from '@/components/charts/latency-chart';
import { Card } from '@/components/ui/card';

export default function ResearchPage() {
  return (
    <AppShell title="Research" subtitle="Backtests, replays, walk-forward results, and calibration work before anything touches real money.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading eyebrow="Research engine" title="Execution-aware strategy validation" description="This beta view is where hftbacktest-backed workflows would surface their replay and calibration results." />
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <ResearchRuns />
          <LatencyChart />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ['Collector', 'Capture full depth, trades, and local timestamps.'],
            ['Replay engine', 'Replay historical order-book events with queue and latency assumptions.'],
            ['Walk-forward', 'Keep parameters honest with rolling out-of-sample checks.']
          ].map(([title, text]) => (
            <Card key={title} className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Pipeline</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-slate-400">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
