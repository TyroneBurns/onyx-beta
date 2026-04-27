import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { SignalGrid } from '@/components/dashboard/signal-grid';
import { Card } from '@/components/ui/card';

export default function SignalsPage() {
  return (
    <AppShell title="Signals" subtitle="Entry queue, confidence scoring, and regime filtering for ONYX.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading
          eyebrow="Decision engine"
          title="Signal queue"
          description="Every card should feel sharp, readable, and clearly ranked for action."
        />

        <SignalGrid />

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="p-6">
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
                <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/4 px-4 py-3">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="font-mono text-sm text-white">{value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Signal notes</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Current interpretation</h3>
            <div className="mt-6 rounded-[24px] border border-emerald-500/20 bg-emerald-500/8 p-5 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <p className="text-sm leading-7 text-slate-200">
                The ONYX stack is currently favouring cleaner continuation setups after reducing sensitivity to low-quality regime changes. Higher-quality long continuation trades are now ranking ahead of unstable flip signals, while weaker short attempts are being filtered earlier.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
