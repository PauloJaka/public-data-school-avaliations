'use client';

import { useState, useRef } from 'react';
import { BRAZIL_STATE_PATHS, BRAZIL_STATE_LABELS, lerpColor, STATE_REGION, REGION_COLORS } from '@/lib/data/brazil-paths';

// ── Default tooltip ─────────────────────────────────────────────────────────
function DefaultTooltip({ uf, value, dark }: { uf: string; value?: number; dark: boolean }) {
  return (
    <div style={{
      background: dark ? '#0f1a2e' : '#ffffff',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      minWidth: 130, fontFamily: "'Fira Sans', system-ui, sans-serif",
    }}>
      <div style={{ fontFamily: "'Fira Code', monospace", fontWeight: 700, fontSize: '1rem', color: dark ? '#f1f5f9' : '#1e293b' }}>{uf}</div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
        Value: <strong style={{ color: dark ? '#93c5fd' : '#2563eb' }}>{value ?? '—'}</strong>
      </div>
    </div>
  );
}

// ── BrazilMap component ─────────────────────────────────────────────────────
export interface BrazilMapProps {
  data?: Record<string, number>;
  minVal?: number;
  maxVal?: number;
  colorFrom?: string;
  colorTo?: string;
  highlightColor?: string;
  strokeColor?: string;
  dark?: boolean;
  showLabels?: boolean;
  colorMode?: 'ideb' | 'region';
  onStateHover?: (uf: string, value: number | undefined, event: React.MouseEvent) => void;
  onStateLeave?: (uf: string) => void;
  onStateClick?: (uf: string, value: number | undefined) => void;
  renderTooltip?: (uf: string, value: number | undefined) => React.ReactNode;
  width?: string;
  height?: string;
}

export function BrazilMap({
  data = {},
  minVal = 3.0,
  maxVal = 6.0,
  colorFrom,
  colorTo,
  highlightColor = '#60A5FA',
  strokeColor,
  dark = false,
  showLabels = true,
  colorMode = 'ideb',
  onStateHover,
  onStateLeave,
  onStateClick,
  renderTooltip,
  width = '100%',
  height = 'auto',
}: BrazilMapProps) {
  const resolvedFrom   = colorFrom  || (dark ? '#ca8a04' : '#fde68a'); // yellow-600 vs amber-200
  const resolvedTo     = colorTo    || (dark ? '#3b82f6' : '#1e40af'); // blue-500 vs blue-800
  const resolvedStroke = strokeColor || (dark ? '#0b1224' : '#ffffff');
  const labelColor     = dark ? '#e2e8f0' : '#0f172a';

  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  function getFill(uf: string) {
    if (hovered === uf) return highlightColor;
    if (colorMode === 'region') {
      const region = STATE_REGION[uf];
      if (!region) return dark ? '#111827' : '#f1f5f9';
      return dark ? REGION_COLORS[region].dark : REGION_COLORS[region].light;
    }
    const val = data[uf];
    if (val == null) return dark ? '#111827' : '#f1f5f9';
    const t = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal)));
    return lerpColor(resolvedFrom, resolvedTo, t);
  }

  function handleEnter(e: React.MouseEvent, uf: string) {
    setHovered(uf);
    setTooltipPos({ x: e.clientX, y: e.clientY });
    onStateHover?.(uf, data[uf], e);
  }

  function handleMove(e: React.MouseEvent) {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }

  function handleLeave(uf: string) {
    setHovered(null);
    onStateLeave?.(uf);
  }

  function handleClick(uf: string) {
    onStateClick?.(uf, data[uf]);
  }

  const tooltip = hovered
    ? (renderTooltip
        ? renderTooltip(hovered, data[hovered])
        : <DefaultTooltip uf={hovered} value={data[hovered]} dark={dark}/>)
    : null;

  return (
    <div ref={wrapRef} style={{ position: 'relative', width, display: 'inline-block' }}>
      <svg
        viewBox="0 0 600 680"
        style={{ width: '100%', height, display: 'block' }}
        aria-label="Mapa do Brasil por estado"
      >
        {Object.entries(BRAZIL_STATE_PATHS).map(([uf, d]) => (
          <path
            key={uf}
            d={d}
            fill={getFill(uf)}
            stroke={resolvedStroke}
            strokeWidth={1.2}
            style={{ cursor: onStateClick ? 'pointer' : 'default', transition: 'fill .15s' }}
            onMouseEnter={e => handleEnter(e, uf)}
            onMouseMove={handleMove}
            onMouseLeave={() => handleLeave(uf)}
            onClick={() => handleClick(uf)}
          />
        ))}
        {showLabels && Object.entries(BRAZIL_STATE_LABELS).map(([uf, [lx, ly]]) => (
          <text
            key={`lbl-${uf}`}
            x={lx} y={ly}
            textAnchor="middle"
            fontSize="9.5"
            fontFamily="'Fira Code', monospace"
            fontWeight="700"
            fill={labelColor}
            pointerEvents="none"
          >
            {uf}
          </text>
        ))}
      </svg>

      {/* Floating tooltip — fixed to viewport */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x + 14,
          top: tooltipPos.y - 10,
          pointerEvents: 'none',
          zIndex: 9999,
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ── Color scale legend helper ───────────────────────────────────────────────
export function BrazilMapLegend({
  colorFrom,
  colorTo,
  minVal = 3.0,
  maxVal = 6.0,
  labelMin = 'Low',
  labelMax = 'High',
  dark = false,
  width = 200,
}: {
  colorFrom?: string;
  colorTo?: string;
  minVal?: number;
  maxVal?: number;
  labelMin?: string;
  labelMax?: string;
  dark?: boolean;
  width?: number;
}) {
  const resolvedFrom = colorFrom || (dark ? '#ca8a04' : '#fde68a');
  const resolvedTo   = colorTo   || (dark ? '#3b82f6' : '#1e40af');
  const muted = dark ? '#64748b' : '#94a3b8';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', color: muted }}>
      <span>{labelMin} ({minVal})</span>
      <div style={{
        width, height: 8, borderRadius: 4,
        background: `linear-gradient(90deg, ${resolvedFrom}, ${resolvedTo})`,
      }}/>
      <span>{labelMax} ({maxVal})</span>
    </div>
  );
}

// ── Region color legend ───────────────────────────────────────────────────────
export function BrazilMapRegionLegend({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontFamily: "'Fira Code', monospace", fontSize: '0.7rem' }}>
      {Object.entries(REGION_COLORS).map(([region, colors]) => (
        <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            display: 'inline-block', width: 10, height: 10, borderRadius: 3, flexShrink: 0,
            background: dark ? colors.dark : colors.light,
            border: `1px solid ${dark ? colors.dark : '#cbd5e1'}`,
          }} />
          <span style={{ color: dark ? '#94a3b8' : '#64748b' }}>{region}</span>
        </div>
      ))}
    </div>
  );
}
