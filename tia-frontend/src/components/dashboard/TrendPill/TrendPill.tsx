import { cn } from '@/lib/utils/cn';

export interface TrendPillProps { dir: 'up' | 'down'; delta: string }

export function TrendPill({ dir, delta }: TrendPillProps) {
  const up = dir === 'up';
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-mono',
      up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
    )}>
      <span aria-hidden>{up ? '▲' : '▼'}</span>{delta}
    </span>
  );
}
