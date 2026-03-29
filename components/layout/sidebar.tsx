'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, CandlestickChart, LayoutDashboard, Radar, RadioTower, Settings2 } from 'lucide-react';
import { sidebarItems } from '@/data/mock';
import { cn } from '@/lib/utils';
import { OnyxLogo } from '@/components/layout/onyx-logo';
import { StatusPill } from '@/components/ui/status-pill';

const icons = {
  '/': LayoutDashboard,
  '/research': BarChart3,
  '/shadow': Radar,
  '/live': RadioTower,
  '/signals': Activity,
  '/trades': CandlestickChart,
  '/settings': Settings2
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[292px] shrink-0 border-r border-white/6 bg-black/20 px-5 py-6 lg:flex lg:flex-col">
      <OnyxLogo />

      <div className="mt-8">
        <StatusPill label="Beta deploy" tone="positive" />
      </div>

      <nav className="mt-6 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = icons[item.href as keyof typeof icons] ?? LayoutDashboard;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-2xl px-3 py-3 transition-all duration-200',
                active ? 'bg-white/8 text-white ring-1 ring-white/10' : 'text-slate-400 hover:bg-white/4 hover:text-white'
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn('rounded-xl p-2', active ? 'bg-emerald-500/12 text-emerald-300' : 'bg-white/5 text-slate-500 group-hover:text-slate-300')}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </span>
              {active ? <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-glow" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-white/8 bg-white/4 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Deployment</p>
        <div className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-300">
            <span>UI</span>
            <span className="text-emerald-300">Vercel-ready</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>API</span>
            <span className="text-cyan-300">Mock routes</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Execution</span>
            <span className="text-amber-300">Scaffolded</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
