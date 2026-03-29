import { ReactNode } from 'react';

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">• {eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        <p className="mt-2 text-lg text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
