'use client';

import { useState } from 'react';

export interface RadarDataPoint {
  [key: string]: string | number | undefined;
  tooltip?: string;
}

export interface SVGRadarChartTheme {
  chartGrid?: string;
  muted?: string;
  cardBg?: string;
}

export interface SVGRadarChartProps {
  data?: RadarDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  fillFrom?: string;
  fillTo?: string;
  fillOpacity?: number;
  rings?: number[];
  theme?: SVGRadarChartTheme;
  labelKey?: string;
  valueKey?: string;
  minVal?: number;
  maxVal?: number;
}

export function SVGRadarChart({
  data = [],
  width = 340,
  height = 240,
  color = '#3B82F6',
  fillFrom,
  fillTo,
  fillOpacity = 0.2,
  rings = [0.25, 0.5, 0.75, 1.0],
  theme = {},
  labelKey = 'label',
  valueKey = 'value',
  minVal = 0,
  maxVal = 1,
}: SVGRadarChartProps) {
  const chartGrid = theme.chartGrid || '#e2e8f0';
  const muted     = theme.muted     || '#94a3b8';
  const cardBg    = theme.cardBg    || '#ffffff';
  const gradFrom  = fillFrom || color;
  const gradTo    = fillTo   || (color === '#3B82F6' ? '#60A5FA' : color);

  const cx  = width  / 2;
  const cy  = height / 2 - 8;
  const r   = Math.min(width, height) * 0.33;
  const n   = data.length;

  if (!n) return null;

  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const norm  = (v: number) => Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal || 1)));
  const pt    = (i: number, ratio: number): [number, number] => [
    cx + Math.cos(angle(i)) * r * ratio,
    cy + Math.sin(angle(i)) * r * ratio,
  ];

  const polyPts = data
    .map((d, i) => pt(i, norm(Number(d[valueKey]))).join(','))
    .join(' ');

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const gradId = `src-fill-${color.replace('#','')}`;

  function handleMove(e: React.MouseEvent) {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={gradFrom} stopOpacity={fillOpacity * 1.8}/>
          <stop offset="100%" stopColor={gradTo}   stopOpacity={fillOpacity * 0.4}/>
        </linearGradient>
      </defs>

      {/* Grid rings */}
      {rings.map((rv, ri) => (
        <polygon key={ri}
          points={data.map((_,i) => pt(i, rv).join(',')).join(' ')}
          fill="none" stroke={chartGrid} strokeWidth={1}/>
      ))}

      {/* Ring value labels (innermost and outermost) */}
      {[rings[0], rings[rings.length-1]].map((rv, ri) => {
        const val = (minVal + rv * (maxVal - minVal)).toFixed(ri === 0 ? 2 : 1);
        const [lx, ly] = pt(0, rv);
        return (
          <text key={ri} x={lx+4} y={ly-3} fontSize={8}
            fontFamily="'Fira Code',monospace" fill={muted} opacity={0.6}>{val}</text>
        );
      })}

      {/* Spokes */}
      {data.map((_, i) => (
        <line key={i}
          x1={cx} y1={cy}
          x2={pt(i,1)[0]} y2={pt(i,1)[1]}
          stroke={chartGrid} strokeWidth={1}/>
      ))}

      {/* Data polygon */}
      <polygon points={polyPts}
        fill={`url(#${gradId})`}
        stroke={color} strokeWidth={2} strokeLinejoin="round"/>

      {/* Dots */}
      {data.map((d, i) => {
        const v   = norm(Number(d[valueKey]));
        const [px, py] = pt(i, v);
        const isH = hoveredIdx === i;
        return (
          <circle key={i}
            cx={px} cy={py} r={isH ? 6 : 4}
            fill={color} stroke={cardBg} strokeWidth={1.5}
            style={{ transition:'r .12s', cursor:'pointer' }}
            onMouseEnter={(e) => { setHoveredIdx(i); handleMove(e); }}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoveredIdx(null)}/>
        );
      })}

      {/* Axis labels */}
      {data.map((d, i) => {
        const [lx, ly] = pt(i, 1.3);
        const anchor = lx < cx - 12 ? 'end' : lx > cx + 12 ? 'start' : 'middle';
        const val    = Number(d[valueKey]);
        const isH    = hoveredIdx === i;
        return (
          <g key={i} style={{ cursor: d.tooltip ? 'help' : 'default' }}>
            {d.tooltip && <title>{d.tooltip}</title>}
            <text x={lx} y={ly + 3} textAnchor={anchor}
              fontSize={10.5} fontFamily="'Fira Code',monospace"
              fill={isH ? color : muted}
              style={{ transition:'fill .12s' }}>
              {String(d[labelKey])}
            </text>
            <text x={lx} y={ly + 15} textAnchor={anchor}
              fontSize={10} fontFamily="'Fira Code',monospace"
              fontWeight="700" fill={color}
              opacity={isH ? 1 : 0.7}>
              {val.toFixed ? val.toFixed(2) : val}
            </text>
          </g>
        );
      })}
      </svg>

      {/* Floating tooltip */}
      {hoveredIdx !== null && data[hoveredIdx]?.tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x + 14,
          top: tooltipPos.y - 10,
          pointerEvents: 'none',
          zIndex: 9999,
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: 8, padding: '8px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          maxWidth: 240, fontFamily: "'Fira Sans', system-ui, sans-serif",
          fontSize: '0.8rem', color: 'var(--text, #334155)',
          lineHeight: 1.4
        }}>
          <div style={{ fontFamily: "'Fira Code', monospace", fontWeight: 700, marginBottom: 4, color: color }}>
            {String(data[hoveredIdx][labelKey])}: {Number(data[hoveredIdx][valueKey]).toFixed(2)}
          </div>
          <div style={{ color: 'var(--text-muted, #64748b)' }}>{data[hoveredIdx].tooltip}</div>
        </div>
      )}
    </div>
  );
}
