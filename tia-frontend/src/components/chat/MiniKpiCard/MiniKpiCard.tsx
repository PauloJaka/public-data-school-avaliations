import { cn } from '@/lib/utils/cn';

export interface MiniKpiCardProps {
  label: string; value: string; delta: string; dir: 'up' | 'down';
}

export function MiniKpiCard({ label, value, delta, dir }: MiniKpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="font-mono text-[10px] uppercase text-muted">{label}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="font-mono text-lg text-text">{value}</span>
        <span className={cn(
          'font-mono text-[10px]',
          dir === 'up' ? 'text-emerald-600' : 'text-rose-600'
        )}>
          {dir === 'up' ? '▲' : '▼'} {delta}
        </span>
      </div>
    </div>
  );
}
