import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { settingsGroups } from '@/data/mock';

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Controls, thresholds, integrations, and sandbox environment parameters.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading
          eyebrow="Control layer"
          title="Execution and system settings"
          description="Grouped settings cards with cleaner hierarchy and more premium control treatment."
        />

        <div className="grid gap-4 xl:grid-cols-2">
          {settingsGroups.map((group) => (
            <Card key={group.title} className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Configuration</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{group.title}</h3>
              <div className="mt-6 space-y-3">
                {group.items.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/4 px-4 py-3">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="font-mono text-sm text-white">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Environment</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Sandbox release checklist</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['App shell', 'Complete'],
              ['Dashboard views', 'Complete'],
              ['Motion layer', 'Complete'],
              ['Responsive pass', 'Ready'],
              ['Mock data', 'Included'],
              ['Design tokens', 'Included']
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
