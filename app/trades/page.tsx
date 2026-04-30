import { AppShell } from '@/components/layout/app-shell';
import { TradesLive } from '@/components/onyx/trades-live';

export default function TradesPage() {
  return (
    <AppShell title="Trades" subtitle="Live paper positions, execution history and realised outcomes.">
      <TradesLive />
    </AppShell>
  );
}
