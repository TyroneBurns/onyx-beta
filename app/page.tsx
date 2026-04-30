import { AppShell } from '@/components/layout/app-shell';
import { OnyxPaperTrader } from '@/components/onyx/paper-trader';

export default function OverviewPage() {
  return (
    <AppShell
      title="ONYX Paper Trader"
      subtitle="Autonomous research-first paper trading app. Researches every 5 minutes, learns from paper outcomes, and blocks live trading until edge is proven."
    >
      <OnyxPaperTrader />
    </AppShell>
  );
}
