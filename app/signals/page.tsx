import { AppShell } from '@/components/layout/app-shell';
import { SignalsLive } from '@/components/onyx/signals-live';

export default function SignalsPage() {
  return (
    <AppShell title="Signals" subtitle="Live entry queue, learned gates and real market candidates.">
      <SignalsLive />
    </AppShell>
  );
}
