import { AppShell } from '@/components/layout/app-shell';
import { ModelsLive } from '@/components/onyx/models-live';

export default function ModelsPage() {
  return (
    <AppShell title="Models" subtitle="Research, execution and learning layers powered by live paper data.">
      <ModelsLive />
    </AppShell>
  );
}
