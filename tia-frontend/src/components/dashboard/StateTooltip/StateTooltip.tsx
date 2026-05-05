import './style.css';

export interface StateTooltipProps { uf: string; value?: number; x: number; y: number }

export function StateTooltip({ uf, value, x, y }: StateTooltipProps) {
  return (
    <div
      role="tooltip"
      style={{ left: x + 12, top: y + 12 }}
      className="pointer-events-none fixed z-50 rounded-xl border border-border bg-surface px-3 py-2 shadow-md"
    >
      <div className="font-mono text-xs text-muted">{uf}</div>
      <div className="font-mono text-sm text-text">IDEB {value?.toFixed(1) ?? '—'}</div>
    </div>
  );
}
