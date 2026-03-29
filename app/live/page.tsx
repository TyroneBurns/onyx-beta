import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { LivePositions } from '@/components/dashboard/live-positions';
import { OrdersPanel } from '@/components/dashboard/orders-panel';
import { SystemHealth } from '@/components/dashboard/system-health';
import { LatencyChart } from '@/components/charts/latency-chart';

export default function LivePage() {
  return (
    <AppShell title="Live" subtitle="Current exposure, working orders, and infrastructure status. In this beta, the data is mocked but the control-centre structure is ready.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading eyebrow="Live state" title="Execution cockpit" description="In production, this page would read from real collectors, brokers, risk services, and shadow/live comparison jobs." />
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <LivePositions />
          <OrdersPanel />
        </div>
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SystemHealth />
          <LatencyChart />
        </div>
      </section>
    </AppShell>
  );
}
