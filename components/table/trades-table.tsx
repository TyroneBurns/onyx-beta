import { ArrowDownRight, ArrowUpRight, CircleDot, ShieldAlert, Target, TrendingUp } from 'lucide-react';
import { trades } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { MarketIcon } from '@/components/ui/market-icon';
import { PnlChip } from '@/components/ui/pnl-chip';
import { cn } from '@/lib/utils';

function reasonIcon(reason: string) {
  if (reason.toLowerCase().includes('target')) return <Target className="h-4 w-4 text-emerald-300" />;
  if (reason.toLowerCase().includes('risk')) return <ShieldAlert className="h-4 w-4 text-rose-300" />;
  if (reason.toLowerCase().includes('momentum')) return <TrendingUp className="h-4 w-4 text-cyan-300" />;
  return <CircleDot className="h-4 w-4 text-amber-300" />;
}

export function TradesTable() {
  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4 md:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trades</p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">Execution log</h3>
        </div>
        <StatusPill label="5 rows" tone="neutral" />
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {trades.map((trade) => {
          const positive = trade.pnl.startsWith('+');
          const open = trade.status === 'Open';
          return (
            <div key={`${trade.market}-${trade.entry}-mobile`} className={cn('rounded-[24px] border p-4', positive && 'border-emerald-500/14 bg-emerald-500/[0.03] shadow-[0_0_30px_rgba(16,185,129,0.08)]', !positive && 'border-rose-500/12 bg-rose-500/[0.03] shadow-[0_0_30px_rgba(244,63,94,0.08)]', open && 'border-cyan-500/16 bg-cyan-500/[0.04] shadow-[0_0_30px_rgba(34,211,238,0.08)]')}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <MarketIcon market={trade.market} className="h-11 w-11 rounded-2xl" />
                  <div className="min-w-0">
                    <p className="font-medium text-white">{trade.market}</p>
                    <p className="text-xs text-slate-500">{trade.marketType}</p>
                  </div>
                </div>
                <StatusPill label={trade.status} tone={trade.status === 'Open' ? 'info' : 'neutral'} pulse={trade.status === 'Open'} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1', trade.side === 'Long' ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/15' : 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/15')}>
                  {trade.side === 'Long' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {trade.side}
                </span>
                <PnlChip value={trade.pnl} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/6 bg-black/18 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Entry</p>
                  <p className="mt-1 font-mono text-sm text-white">{trade.entry}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Exit</p>
                  <p className="mt-1 font-mono text-sm text-white">{trade.exit}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/6 bg-black/18 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Expectancy</p>
                  <p className="mt-1 font-mono text-sm text-white">{trade.expectancy}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Reason</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-200">{reasonIcon(trade.reason)}{trade.reason}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden max-w-full overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              {['Market', 'Side', 'Entry', 'Exit', 'P&L', 'Status', 'Expectancy', 'Reason'].map((head) => (
                <th key={head} className="px-5 py-4 font-medium md:px-6">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const positive = trade.pnl.startsWith('+');
              const open = trade.status === 'Open';
              return (
                <tr key={`${trade.market}-${trade.entry}`} className={cn('border-t border-white/6 text-sm text-slate-300 transition hover:bg-white/[0.03]', positive && 'bg-emerald-500/[0.02] shadow-[inset_3px_0_0_rgba(16,185,129,0.55)]', !positive && 'bg-rose-500/[0.02] shadow-[inset_3px_0_0_rgba(244,63,94,0.5)]', open && 'bg-cyan-500/[0.03] shadow-[inset_3px_0_0_rgba(34,211,238,0.55)]')}>
                  <td className="px-5 py-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <MarketIcon market={trade.market} className="h-10 w-10 rounded-2xl" />
                      <div>
                        <p className="font-medium text-white">{trade.market}</p>
                        <p className="text-xs text-slate-500">{trade.marketType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 md:px-6">
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1', trade.side === 'Long' ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/15' : 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/15')}>
                      {trade.side === 'Long' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />} {trade.side}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono md:px-6">{trade.entry}</td>
                  <td className="px-5 py-4 font-mono md:px-6">{trade.exit}</td>
                  <td className="px-5 py-4 md:px-6"><PnlChip value={trade.pnl} /></td>
                  <td className="px-5 py-4 md:px-6"><StatusPill label={trade.status} tone={trade.status === 'Open' ? 'info' : 'neutral'} pulse={trade.status === 'Open'} /></td>
                  <td className="px-5 py-4 font-mono md:px-6">{trade.expectancy}</td>
                  <td className="px-5 py-4 md:px-6"><div className="flex items-center gap-2 text-slate-300">{reasonIcon(trade.reason)}<span>{trade.reason}</span></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
