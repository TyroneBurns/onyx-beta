import { Banknote, BriefcaseBusiness, Clock3 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { TradesTable } from '@/components/table/trades-table';
import { Card } from '@/components/ui/card';

const stats = [
  {
    label: 'Realised today',
    value: '£6,120',
    note: '+18.4% vs yesterday',
    positive: true,
    icon: Banknote
  },
  {
    label: 'Open positions',
    value: '8',
    note: '2 runners still live',
    positive: true,
    icon: BriefcaseBusiness
  },
  {
    label: 'Avg trade duration',
    value: '2h 14m',
    note: '-11m from prior week',
    positive: false,
    icon: Clock3
  }
];

export default function TradesPage() {
  return (
    <AppShell title="Trades" subtitle="Execution history, trade reasons, and live exposure across ONYX.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading
          eyebrow="Execution layer"
          title="Trade ledger"
          description="Cleaner trade states, clearer icons, and stronger positive and negative visual cues for every position."
        />

        <div className="grid gap-4 xl:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className={item.positive ? 'p-5 shadow-[0_0_44px_rgba(16,185,129,0.08)]' : 'p-5 shadow-[0_0_44px_rgba(244,63,94,0.06)]'}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-4 font-mono text-3xl text-white">{item.value}</p>
                  </div>
                  <div className={`rounded-2xl p-2.5 ring-1 ${item.positive ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/15' : 'bg-rose-500/10 text-rose-300 ring-rose-500/15'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className={`mt-4 text-sm ${item.positive ? 'text-emerald-300' : 'text-rose-300'}`}>{item.note}</p>
              </Card>
            );
          })}
        </div>

        <TradesTable />
      </section>
    </AppShell>
  );
}
