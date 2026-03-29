import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-w-0 overflow-hidden rounded-[24px] border border-white/8 bg-[rgba(15,23,34,0.78)] shadow-panel backdrop-blur-sm', className)} {...props} />;
}
