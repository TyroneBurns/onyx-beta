'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, CandlestickChart, LayoutDashboard, Radar, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/research', label: 'Research', icon: BarChart3 },
  { href: '/shadow', label: 'Shadow', icon: Radar },
  { href: '/signals', label: 'Signals', icon: Activity },
  { href: '/trades', label: 'Trades', icon: CandlestickChart },
  { href: '/settings', label: 'Settings', icon: Settings2 }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-3 bottom-3 z-30 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-6 rounded-[24px] border border-white/10 bg-[rgba(7,11,17,0.94)] p-2 shadow-panel backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] transition', active ? 'bg-white/8 text-white' : 'text-slate-500 hover:text-white')}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active && 'text-emerald-300')} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
