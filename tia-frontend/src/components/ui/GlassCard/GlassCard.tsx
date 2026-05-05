import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function GlassCard({ className, ...p }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...p}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl',
        'shadow-[var(--shadow-glass)]',
        className
      )}
    />
  );
}
