import './style.css';

export interface StatItemProps { value: string; label: string; progress: number }

export function StatItem({ value, label, progress }: StatItemProps) {
  return (
    <div className="stat rounded-2xl border border-border bg-surface p-6 shadow-sm backdrop-blur">
      <div className="font-mono text-3xl font-semibold text-text">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-soft">
        <div
          className="bar h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ ['--target' as string]: `${progress * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
