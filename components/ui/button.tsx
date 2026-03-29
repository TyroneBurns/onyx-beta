import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, variant = 'default', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'ghost' | 'secondary' }) {
  const variants = {
    default: 'bg-emerald-500/90 text-slate-950 shadow-glow hover:bg-emerald-400 active:translate-y-px',
    secondary: 'bg-white/8 text-white ring-1 ring-white/10 hover:bg-white/12 active:translate-y-px',
    ghost: 'bg-transparent text-slate-300 hover:bg-white/6 hover:text-white active:translate-y-px'
  };
  return <button className={cn('inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:pointer-events-none disabled:opacity-50', variants[variant], className)} {...props} />;
}
