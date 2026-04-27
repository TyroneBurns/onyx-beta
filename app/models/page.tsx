import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { modelCards } from '@/data/mock';
import { StatusPill } from '@/components/ui/status-pill';

export default function ModelsPage() {
  return (
    <AppShell title="Models" subtitle="Regime models, confirm layers, and risk compression in the ONYX stack.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading
          eyebrow="Model layer"
          title="Model registry and confidence view"
          description="A focused control surface for versioning, confidence, and signal quality across model families."
        />

        <div className="grid gap-4 xl:grid-cols-3">
          {modelCards.map((model) => (
            <Card key={model.name} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{model.version}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{model.name}</h3>
                </div>
                <StatusPill label="Stable" tone="positive" pulse />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/6 bg-white/4 p-4">
                  <p className="text-xs text-slate-500">Confidence</p>
                  <p className="mt-2 font-mono text-xl text-white">{model.confidence}</p>
                </div>
                <div className="rounded-2xl border border-white/6 bg-white/4 p-4">
                  <p className="text-xs text-slate-500">Accuracy</p>
                  <p className="mt-2 font-mono text-xl text-white">{model.accuracy}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">{model.notes}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Deployment protocol</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Release gating</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['Backtest pass', 'Required'],
              ['Walk-forward pass', 'Required'],
              ['Max instability', '< 5%'],
              ['Shadow period', '14 days']
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/6 bg-white/4 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-3 font-mono text-lg text-white">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
