import { ReactNode } from 'react';
import { StatusPill } from '@/components/ui/status-pill';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <StatusPill label={eyebrow} tone="info" />
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
