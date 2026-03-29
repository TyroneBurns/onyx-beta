'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { performanceSeries } from '@/data/mock';
import { Card } from '@/components/ui/card';

export function PerformanceChart() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Performance</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Weekly realised vs shadow P&L</h3>
      <p className="mt-2 text-sm text-slate-400">Shows where execution quality is still leaking edge relative to shadow assumptions.</p>
      <div className="mt-6 h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceSeries}>
            <defs>
              <linearGradient id="liveFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="shadowFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="day" tick={{ fill: '#6B7785', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7785', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0F1722', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }} />
            <Area type="monotone" dataKey="shadow" stroke="#22D3EE" fill="url(#shadowFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="live" stroke="#22C55E" fill="url(#liveFill)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
