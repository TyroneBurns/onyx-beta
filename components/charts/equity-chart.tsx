'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { equitySeries } from '@/data/mock';
import { Card } from '@/components/ui/card';

export function EquityChart() {
  return (
    <Card className="min-w-0 p-5 md:p-6">
      <div className="mb-6 min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Equity curve</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Capital growth trajectory</h3>
      </div>
      <div className="h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equitySeries}>
            <XAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dataKey="point" />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'rgba(7,11,17,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                color: '#fff'
              }}
            />
            <Line type="monotone" dataKey="equity" stroke="#22D3EE" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#22D3EE' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
