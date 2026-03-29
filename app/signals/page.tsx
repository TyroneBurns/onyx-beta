import { AppShell } from '@/components/layout/app-shell';
import { SignalGrid } from '@/components/dashboard/signal-grid';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';

export default function SignalsPage() {
  return (
    <AppShell title="Signals" subtitle="Queue, rank, and inspect current signal candidates after quality, confidence, and tradability checks.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading eyebrow="Decision engine" title="Signal queue" description="Every card ranks a setup after expected execution costs, not just raw directional confidence." />
        <SignalGrid />
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Entry rules</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Qualification matrix</h3>
            <div className="mt-6 space-y-3">
              {[
                ['Quality threshold', '>= 82'],
                ['Confidence floor', '>= 85%'],
                ['Volatility filter', 'Pass'],
                ['Market structure', 'Aligned'],
                ['Spread / slippage', 'Within bounds']
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/18 px-4 py-4">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-mono text-white">{value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Signal notes</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Current interpretation</h3>
            <div className="mt-6 rounded-[24px] border border-emerald-500/12 bg-emerald-500/[0.03] p-6 shadow-[0_0_36px_rgba(16,185,129,0.08)]">
              <p className="text-lg leading-8 text-slate-200">The ONYX stack is currently favouring cleaner continuation setups after reducing sensitivity to low-quality regime changes. Higher-quality long continuation trades are now ranking ahead of unstable flip signals, while weaker short attempts are being filtered earlier.</p>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
