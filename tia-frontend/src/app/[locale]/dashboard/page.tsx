import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/nav/Navbar/Navbar';
import { DashboardBody } from '@/components/dashboard/DashboardBody/DashboardBody';
import {
  IDEB_MAP,
  TOP5_IDEB,
  REGIONAL_IDEB,
  EQUITY_DATA_NATIONAL,
  NATIONAL_KPI,
  RISK_RANKING,
} from '@/lib/data/neo4j-snapshot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — T.I.A',
  description: 'Painel de indicadores educacionais: IDEB por estado, municípios em risco e tendências históricas.',
};

export default async function DashboardPage() {
  const tPage   = await getTranslations('dashboard.page');
  const tMap    = await getTranslations('dashboard.map');
  const tLine   = await getTranslations('dashboard.lineChart');
  const tRadar  = await getTranslations('dashboard.radar');

  const regions = tPage.raw('regions') as string[];

  const LINE_SERIES = [
    { key: 'ideb_ai', label: tLine('ef1'), color: '#3B82F6' },
    { key: 'ideb_af', label: tLine('ef2'), color: '#60A5FA' },
    { key: 'ideb_em', label: tLine('em'),  color: '#A78BFA' },
  ];

  const equityData = EQUITY_DATA_NATIONAL.map(e => ({
    label:   tRadar(`labels.${e.labelKey}`),
    value:   e.value,
    tooltip: tRadar(`tooltips.${e.labelKey}`),
  }));

  const top5Items = TOP5_IDEB.map(s => ({ uf: s.sigla, ideb: s.ideb_af }));

  const riskItems = RISK_RANKING.slice(0, 5).map(s => ({
    uf:         s.sigla,
    nome:       s.nome,
    score:      s.pub_media_score_evasao ?? 0,
    pctCritico: s.pub_pct_risco_critico ?? 0,
  }));

  const PT_REGION_ORDER = ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'];
  const translatedLineData = REGIONAL_IDEB.map(r => ({
    ...r,
    region: regions[PT_REGION_ORDER.indexOf(r.region) + 1] ?? r.region,
  }));

  return (
    <main className="min-h-[100dvh] bg-bg pb-16">
      <Navbar floating />
      <DashboardBody
        pageTitle={tPage('title')}
        lastUpdatedText={tPage('lastUpdated', { date: '21/04/2026' })}
        regions={regions}
        regionKeys={PT_REGION_ORDER}
        idebMap={IDEB_MAP}
        top5Items={top5Items}
        riskItems={riskItems}
        lineData={translatedLineData}
        lineSeries={LINE_SERIES}
        equityData={equityData}
        kpi={NATIONAL_KPI}
        mapTitle={tMap('title')}
        mapLabelMin={tMap('legendLow')}
        mapLabelMax={tMap('legendHigh')}
        lineTitle={tLine('title')}
        radarTitle={tRadar('title')}
      />
    </main>
  );
}
