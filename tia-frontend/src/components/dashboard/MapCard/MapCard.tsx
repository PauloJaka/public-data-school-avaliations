'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { BrazilMap, BrazilMapLegend, BrazilMapRegionLegend } from '../BrazilMap/BrazilMap';

interface MapCardProps {
  data: Record<string, number>;
  minVal?: number;
  maxVal?: number;
  labelMin: string;
  labelMax: string;
  title: string;
}

export function MapCard({
  data,
  minVal = 3.5,
  maxVal = 5.5,
  labelMin,
  labelMax,
  title,
}: MapCardProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [mode, setMode] = useState<'ideb' | 'region'>('ideb');

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{title}</h3>
          <div className="flex gap-1">
            {(['ideb', 'region'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={[
                  'font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md transition',
                  mode === m
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-soft',
                ].join(' ')}
              >
                {m === 'ideb' ? 'IDEB' : 'Regiões'}
              </button>
            ))}
          </div>
        </div>
        {mode === 'ideb'
          ? <BrazilMapLegend minVal={minVal} maxVal={maxVal} labelMin={labelMin} labelMax={labelMax} dark={dark} />
          : <BrazilMapRegionLegend dark={dark} />
        }
      </header>
      <BrazilMap data={data} minVal={minVal} maxVal={maxVal} colorMode={mode} dark={dark} />
    </div>
  );
}
