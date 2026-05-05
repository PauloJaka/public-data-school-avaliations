'use client';

import { useTranslations } from 'next-intl';
import { InfoTooltip } from '@/components/ui/InfoTooltip/InfoTooltip';

export interface RiskItem {
  uf: string;
  nome: string;
  score: number;
  pctCritico: number;
}

export function RiskAlertsList({ items = [] }: { items?: RiskItem[] }) {
  const t = useTranslations('dashboard.risk');
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{t('title')}</h3>
        <span className="flex items-center gap-1 font-mono text-[10px] text-muted">
          {t('badge')}
          <InfoTooltip text={t('mlRiskTooltip')} />
        </span>
      </header>
      <ul className="divide-y divide-border">
        {items.map(it => (
          <li key={it.uf} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-text w-8">{it.uf}</span>
              <span className="text-sm text-muted truncate max-w-[160px]">{it.nome}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">{(it.score * 100).toFixed(0)}%</span>
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  it.score >= 0.83 ? 'bg-red-500' :
                  it.score >= 0.70 ? 'bg-orange-400' : 'bg-amber-400'
                }`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
