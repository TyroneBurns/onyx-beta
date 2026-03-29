import { liveOrders } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { MarketIcon } from '@/components/ui/market-icon';

export function OrdersPanel() {
  return (
    <Card className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Live orders</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Working queue</h3>
      <div className="mt-6 space-y-4">
        {liveOrders.map((order) => (
          <div key={`${order.market}-${order.type}`} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
            <div className="flex items-center gap-3">
              <MarketIcon market={order.market} className="h-11 w-11" />
              <div>
                <p className="font-medium text-white">{order.market}</p>
                <p className="mt-1 text-sm text-slate-500">{order.type}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ['Price', order.price],
                ['Qty', order.qty],
                ['Queue', order.queue],
                ['ETA', order.eta]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
                  <p className="mt-2 font-mono text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
