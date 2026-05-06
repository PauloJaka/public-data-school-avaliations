'use client';

import { useState } from 'react';
import { FilterChips } from '../FilterChips/FilterChips';
import { MapCard } from '../MapCard/MapCard';
import { BarChartCard } from '../BarChartCard/BarChartCard';
import { SVGLineChart } from '../SVGLineChart/SVGLineChart';
import { SVGRadarChart } from '../SVGRadarChart/SVGRadarChart';
import { RiskAlertsList } from '../RiskAlertsList/RiskAlertsList';
import { KpiGrid } from '../KpiGrid/KpiGrid';
import { BRAZIL_REGIONS } from '@/lib/data/brazil-paths';
import { InfoTooltip } from '@/components/ui/InfoTooltip/InfoTooltip';

export interface RiskItem {
  uf: string;
  nome: string;
  score: number;
  pctCritico: number;
}
export interface SeriesItem {
  key: string;
  label: string;
  color: string;
}
export interface RadarPoint {
  label: string;
  value: number;
  tooltip: string;
  [key: string]: string | number | undefined;
}
export interface KpiValues {
  idebLabel: string;
  statesLabel: string;
  riskCount: string;
}

export interface DashboardBodyProps {
  pageTitle: string;
  lastUpdatedText: string;
  regions: string[];
  regionKeys: string[];
  idebMap: Record<string, number>;
  top5Items: { uf: string; ideb: number }[];
  riskItems: RiskItem[];
  lineData: Record<string, unknown>[];
  lineSeries: SeriesItem[];
  equityData: RadarPoint[];
  kpi: KpiValues;
  mapTitle: string;
  mapLabelMin: string;
  mapLabelMax: string;
  lineTitle: string;
  radarTitle: string;
  radarTooltipText?: string;
}

export function DashboardBody({
  pageTitle,
  lastUpdatedText,
  regions,
  regionKeys,
  idebMap,
  top5Items,
  riskItems,
  lineData,
  lineSeries,
  equityData,
  kpi,
  mapTitle,
  mapLabelMin,
  mapLabelMax,
  lineTitle,
  radarTitle,
  radarTooltipText,
}: DashboardBodyProps) {
  const [activeRegion, setActiveRegion] = useState(regions[0]);

  const isAllRegions = activeRegion === regions[0];
  const activeStates: string[] | null = isAllRegions
    ? null
    : BRAZIL_REGIONS[regionKeys[regions.indexOf(activeRegion) - 1] as keyof typeof BRAZIL_REGIONS] ?? null;

  const filteredIdebMap = activeStates
    ? Object.fromEntries(Object.entries(idebMap).filter(([uf]) => activeStates.includes(uf)))
    : idebMap;

  const filteredTop5 = activeStates
    ? top5Items.filter(s => activeStates.includes(s.uf))
    : top5Items;

  const filteredRisk = activeStates
    ? riskItems.filter(s => activeStates.includes(s.uf))
    : riskItems;

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text">{pageTitle}</h1>
          <p className="font-mono text-xs text-muted">{lastUpdatedText}</p>
        </div>
        <FilterChips items={regions} activeItem={activeRegion} onChange={setActiveRegion} />
      </header>

      <KpiGrid kpi={kpi} />

      {/* Row 1: Map + Charts */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <MapCard
          data={filteredIdebMap}
          minVal={3.5}
          maxVal={5.5}
          title={mapTitle}
          labelMin={mapLabelMin}
          labelMax={mapLabelMax}
        />

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              {lineTitle}
            </h3>
            <SVGLineChart
              data={lineData}
              series={lineSeries}
              width={520}
              height={240}
              xKey="region"
            />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted flex items-center gap-1">
              {radarTitle}
              {radarTooltipText && <InfoTooltip text={radarTooltipText} />}
            </h3>
            <SVGRadarChart
              data={equityData}
              width={340}
              height={240}
              color="#3B82F6"
            />
          </div>
        </div>
      </section>

      {/* Row 2: Top 5 bar chart + Risk list */}
      <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChartCard items={filteredTop5} />
        <RiskAlertsList items={filteredRisk} />
      </section>
    </div>
  );
}
