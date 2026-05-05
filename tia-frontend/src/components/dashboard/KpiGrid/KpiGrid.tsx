'use client';

import { useTranslations } from 'next-intl';
import { KpiCard } from '../KpiCard/KpiCard';

interface KpiGridProps {
  kpi: { idebLabel: string; statesLabel: string; riskCount: string };
}

export function KpiGrid({ kpi }: KpiGridProps) {
  const t = useTranslations('dashboard.kpi');
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard label={t('idebLabel')}   value={kpi.idebLabel}   trend={{ dir: 'up',   delta: '+0.3' }} icon="chart" tooltip={t('idebTooltip')}   />
      <KpiCard label={t('statesLabel')} value={kpi.statesLabel} trend={{ dir: 'up',   delta: '100%' }} icon="map"   tooltip={t('statesTooltip')} />
      <KpiCard label={t('riskLabel')}   value={kpi.riskCount}   trend={{ dir: 'down', delta: '-2'   }} icon="alert" tooltip={t('riskTooltip')}   />
    </div>
  );
}
