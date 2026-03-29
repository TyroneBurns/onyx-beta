import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { TradesTable } from '@/components/table/trades-table';
import { SectionHeading } from '@/components/ui/section-heading';

export default function TradesPage() {
  return (
    <AppShell title="Trades" subtitle="Execution history, trade reasons, and expectancy after costs across ONYX.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading eyebrow="Execution layer" title="Trade ledger" description="Cleaner states, clearer icons, and stronger positive and negative cues for every position." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Realised today', '£6,120', '+18.4% vs yesterday'],
            ['Open positions', '8', '2 runners still live'],
            ['Avg trade duration', '2h 14m', '-11m from prior week']
          ].map(([label, value, detail]) => (
            <Card key={label} className="p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
              <p className="mt-4 text-lg text-emerald-300">{detail}</p>
            </Card>
          ))}
        </div>
        <TradesTable />
      </section>
    </AppShell>
  );
}
