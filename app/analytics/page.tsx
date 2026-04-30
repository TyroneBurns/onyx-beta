import { AppShell } from '@/components/layout/app-shell';
import { AnalyticsLive } from '@/components/onyx/analytics-live';

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="Live paper performance, realised edge and learning diagnostics.">
      <AnalyticsLive />
    </AppShell>
  );
}
