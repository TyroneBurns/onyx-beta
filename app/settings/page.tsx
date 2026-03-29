import { AppShell } from '@/components/layout/app-shell';
import { settingsGroups } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Risk limits, execution policies, and deployment notes for turning this beta into a real stack.">
      <section className="space-y-8 overflow-safe">
        <SectionHeading eyebrow="Control plane" title="Core configuration" description="This beta keeps everything mocked, but the groups below mirror the real controls you would expose later." />
        <div className="grid gap-4 xl:grid-cols-3">
          {settingsGroups.map((group) => (
            <Card key={group.title} className="p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Group</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{group.title}</h3>
              <div className="mt-6 space-y-3">
                {group.items.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/18 px-4 py-4">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-mono text-white">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
