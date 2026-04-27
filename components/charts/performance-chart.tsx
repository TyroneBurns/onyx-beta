'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { performanceSeries } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PerformanceChart() {
  return (
    <Card className="min-w-0 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Performance</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Weekly realised P&L</h3>
          <p className="mt-2 text-sm text-slate-400">Trend quality is improving with fewer unstable regime flips.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" className="text-xs">7D</Button>
          <Button variant="ghost" className="text-xs">30D</Button>
          <Button variant="ghost" className="text-xs">90D</Button>
        </div>
      </div>

      <div className="h-[320px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceSeries}>
            <defs>
              <linearGradient id="onyxPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,197,94,0.7)" />
                <stop offset="100%" stopColor="rgba(34,197,94,0.02)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" />
            <XAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dataKey="day" />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: 'rgba(34,197,94,0.28)', strokeWidth: 1 }}
              contentStyle={{
                background: 'rgba(7,11,17,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="pnl" stroke="#22C55E" strokeWidth={2.5} fill="url(#onyxPnl)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
