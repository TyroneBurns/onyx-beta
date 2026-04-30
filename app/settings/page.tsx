import { AppShell } from '@/components/layout/app-shell';
import { SettingsLive } from '@/components/onyx/settings-live';

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Real autonomous paper controls, learning, risk and market universe settings.">
      <SettingsLive />
    </AppShell>
  );
}
