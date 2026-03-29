'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { latencySeries } from '@/data/mock';
import { Card } from '@/components/ui/card';

export function LatencyChart() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Execution latency</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Median round-trip by hour</h3>
      <div className="mt-6 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={latencySeries}>
            <XAxis dataKey="bucket" tick={{ fill: '#6B7785', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7785', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0F1722', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }} />
            <Bar dataKey="latency" fill="#22D3EE" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
