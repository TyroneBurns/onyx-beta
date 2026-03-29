import { Bell, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 overflow-hidden rounded-[28px] border border-white/8 bg-[rgba(15,23,34,0.74)] p-5 shadow-panel backdrop-blur-sm md:p-6">
      <div className="relative">
        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-2xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-36 overflow-hidden rounded-[26px] bg-gradient-to-b from-emerald-400/90 to-emerald-500/85 opacity-90">
          <div className="absolute inset-y-0 left-[-30%] w-[72%] rounded-full bg-black/30" />
        </div>
        <div className="relative z-10 flex flex-col gap-5 pr-0 sm:pr-36">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live metrics
            </div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white">{title}</h1>
            <p className="mt-2 max-w-2xl text-balance text-lg text-slate-400">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary"><Search className="mr-2 h-4 w-4" />Search</Button>
            <Button variant="secondary"><Sparkles className="mr-2 h-4 w-4" />Quick actions</Button>
            <Button variant="ghost" className="rounded-2xl border border-white/10"><Bell className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
