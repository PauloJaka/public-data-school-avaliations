'use client';

import './style.css';
import { useTranslations } from 'next-intl';

interface BarItem { uf: string; ideb: number }

interface BarChartCardProps {
  items?: BarItem[];
}

export function BarChartCard({ items = [] }: BarChartCardProps) {
  const t = useTranslations('dashboard.chart');
  const max = items.length > 0 ? Math.max(...items.map(row => row.ideb)) : 1;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{t('title')}</h3>
      </header>
      <div className="space-y-3">
        {items.map((row, i) => (
          <div key={row.uf} className="bar-row grid grid-cols-[36px_1fr_44px] items-center gap-3">
            <span className="font-mono text-xs text-muted">{row.uf}</span>
            <div className="track h-2 rounded-full bg-soft overflow-hidden">
              <div
                className="fill h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{
                  ['--target' as string]: `${(row.ideb / max) * 100}%`,
                  animationDelay: `${i * 80}ms`,
                } as React.CSSProperties}
              />
            </div>
            <span className="font-mono text-xs text-text text-right">{row.ideb.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
