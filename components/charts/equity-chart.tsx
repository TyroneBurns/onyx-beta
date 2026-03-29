'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { equitySeries } from '@/data/mock';
import { Card } from '@/components/ui/card';

export function EquityChart() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Equity curve</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Capital growth trajectory</h3>
      <div className="mt-6 h-[240px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equitySeries}>
            <XAxis dataKey="point" tick={{ fill: '#6B7785', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7785', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0F1722', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }} />
            <Line type="monotone" dataKey="shadow" stroke="#22D3EE" strokeDasharray="6 6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="equity" stroke="#22C55E" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
