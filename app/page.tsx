import { AppShell } from '@/components/layout/app-shell';
import { OnyxPaperTrader } from '@/components/onyx/paper-trader';

export default function OverviewPage() {
  return (
    <AppShell
      title="ONYX Paper Trader"
      subtitle="Research-first paper trading platform. Set & Forget is retired to paper research only."
    >
      <OnyxPaperTrader />
    </AppShell>
  );
}
