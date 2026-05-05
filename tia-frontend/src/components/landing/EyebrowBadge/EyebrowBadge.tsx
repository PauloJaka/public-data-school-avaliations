import './style.css';

export interface EyebrowBadgeProps { label: string }

export function EyebrowBadge({ label }: EyebrowBadgeProps) {
  return (
    <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border
                     bg-surface px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted shadow-sm">
      <span className="dot h-1.5 w-1.5 rounded-full bg-primary" />
      {label}
    </span>
  );
}
