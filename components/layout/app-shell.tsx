import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';

export function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.06),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-grid-fade bg-[size:52px_52px] opacity-[0.08] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] overflow-x-hidden">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-4 pb-28 md:px-6 lg:px-8 lg:pb-8">
          <Topbar title={title} subtitle={subtitle} />
          <div className="overflow-safe">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
