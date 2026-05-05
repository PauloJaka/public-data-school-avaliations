import './style.css';
import { TrendPill } from '../TrendPill/TrendPill';
import { InfoTooltip } from '@/components/ui/InfoTooltip/InfoTooltip';

export interface KpiCardProps {
  label: string;
  value: string;
  trend: { dir: 'up' | 'down'; delta: string };
  icon: 'chart' | 'map' | 'alert';
  tooltip?: string;
}

export function KpiCard({ label, value, trend, icon, tooltip }: KpiCardProps) {
  return (
    <div className="kpi relative rounded-2xl border border-border bg-surface p-5
                    shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between">
        <span className="flex items-center font-mono text-[11px] uppercase tracking-wider text-muted">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-soft text-primary">{iconFor(icon)}</span>
      </div>
      <div className="mt-3 font-mono text-[2.4rem] leading-none text-text">{value}</div>
      <div className="mt-3"><TrendPill {...trend} /></div>
    </div>
  );
}

function iconFor(k: KpiCardProps['icon']) {
  if (k === 'chart') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/><path d="M7 14l4-4 3 3 5-7" stroke="currentColor" strokeWidth="2"/></svg>;
  if (k === 'map')   return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z" stroke="currentColor" strokeWidth="2"/></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2"/></svg>;
}
