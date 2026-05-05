'use client';

import { useState } from 'react';

export interface SVGLineChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface SVGLineChartTheme {
  chartGrid?: string;
  muted?: string;
  cardBg?: string;
  border?: string;
  text?: string;
}

export interface SVGLineChartProps {
  data?: Record<string, unknown>[];
  series?: SVGLineChartSeries[];
  width?: number;
  height?: number;
  theme?: SVGLineChartTheme;
  xKey?: string;
  gridLines?: number;
}

export function SVGLineChart({
  data = [],
  series = [],
  width = 520,
  height = 240,
  theme = {},
  xKey = 'year',
  gridLines = 4,
}: SVGLineChartProps) {
  const PL = 40, PR = 14, PT = 14, PB = 32;
  const W  = width  - PL - PR;
  const H  = height - PT - PB;

  const chartGrid = theme.chartGrid || '#e2e8f0';
  const muted     = theme.muted     || '#94a3b8';
  const cardBg    = theme.cardBg    || '#ffffff';
  const border    = theme.border    || '#e2e8f0';
  const textColor = theme.text      || '#1e293b';

  const allVals = series.flatMap(s => data.map(d => Number(d[s.key]) || 0));
  const minV = allVals.length ? Math.floor(Math.min(...allVals) * 10) / 10 - 0.2 : 0;
  const maxV = allVals.length ? Math.ceil( Math.max(...allVals) * 10) / 10 + 0.2 : 10;

  const scaleX = (i: number) => PL + (data.length > 1 ? (i / (data.length - 1)) * W : W / 2);
  const scaleY = (v: number) => PT + H - ((v - minV) / (maxV - minV || 1)) * H;

  const [hover, setHover] = useState<number | null>(null);

  if (!data.length || !series.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width:'100%', height:'100%' }}>
        <text x={width/2} y={height/2} textAnchor="middle" fontSize={12}
          fontFamily="'Fira Code',monospace" fill={muted}>No data</text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width:'100%', height:'100%', overflow:'visible' }}>
      <defs>
        {series.map(s => (
          <linearGradient key={`grad-${s.key}`} id={`slc-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={s.color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={s.color} stopOpacity="0"/>
          </linearGradient>
        ))}
      </defs>

      {/* Horizontal grid lines */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const v = minV + (i / gridLines) * (maxV - minV);
        const y = scaleY(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL+W} y2={y} stroke={chartGrid} strokeWidth={1}/>
            <text x={PL-6} y={y+4} textAnchor="end" fontSize={10}
              fontFamily="'Fira Code',monospace" fill={muted}>{v.toFixed(1)}</text>
          </g>
        );
      })}

      {/* Area fills */}
      {series.map(s => {
        const areaD =
          `M ${scaleX(0)},${scaleY(Number(data[0][s.key]))} ` +
          data.slice(1).map((d,i) => `L ${scaleX(i+1)},${scaleY(Number(d[s.key]))}`).join(' ') +
          ` L ${scaleX(data.length-1)},${PT+H} L ${scaleX(0)},${PT+H} Z`;
        return <path key={`area-${s.key}`} d={areaD} fill={`url(#slc-grad-${s.key})`}/>;
      })}

      {/* Lines */}
      {series.map(s => {
        const d = data.map((pt,i) => `${i===0?'M':'L'} ${scaleX(i)},${scaleY(Number(pt[s.key]))}`).join(' ');
        return (
          <path key={`line-${s.key}`} d={d} fill="none" stroke={s.color}
            strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray="2000" style={{ animation:'slcDrawLine 1.4s ease-out forwards' }}/>
        );
      })}

      {/* X-axis labels */}
      {data.map((d,i) => (
        <text key={i} x={scaleX(i)} y={PT+H+18} textAnchor="middle" fontSize={10}
          fontFamily="'Fira Code',monospace" fill={muted}>{String(d[xKey])}</text>
      ))}

      {/* Dots with hover interaction */}
      {data.map((d,i) =>
        series.map(s => (
          <circle key={`dot-${s.key}-${i}`}
            cx={scaleX(i)} cy={scaleY(Number(d[s.key]))}
            r={hover === i ? 5 : 3}
            fill={s.color} stroke={cardBg} strokeWidth={1.5}
            style={{ transition:'r .1s', cursor:'default' }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}/>
        ))
      )}

      {/* Hover tooltip */}
      {hover !== null && (() => {
        const d    = data[hover];
        const x    = scaleX(hover);
        const boxW = 128, boxH = series.length * 18 + 26;
        const bx   = Math.max(PL, Math.min(x - boxW/2, PL + W - boxW));
        const by   = Math.max(4, PT - boxH - 10);
        return (
          <g style={{ pointerEvents:'none' }}>
            <rect x={bx} y={by} width={boxW} height={boxH} rx={7}
              fill={cardBg} stroke={border} strokeWidth={1}
              filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))"/>
            <text x={bx+10} y={by+16} fontSize={10} fontFamily="'Fira Code',monospace"
              fontWeight="700" fill={textColor}>{String(d[xKey])}</text>
            {series.map((s,si) => (
              <g key={si}>
                <circle cx={bx+14} cy={by+28+si*18} r={4} fill={s.color}/>
                <text x={bx+23} y={by+32+si*18} fontSize={9.5}
                  fontFamily="'Fira Code',monospace" fill={muted}>{s.label}:</text>
                <text x={bx+boxW-8} y={by+32+si*18} textAnchor="end" fontSize={10}
                  fontFamily="'Fira Code',monospace" fontWeight="700" fill={textColor}>
                  {Number(d[s.key]).toFixed(1)}
                </text>
              </g>
            ))}
          </g>
        );
      })()}

      {/* Legend */}
      {series.map((s, i) => (
        <g key={`leg-${i}`} transform={`translate(${PL + i * 130}, ${height - 2})`}>
          <line x1={0} y1={0} x2={14} y2={0} stroke={s.color} strokeWidth={2.5} strokeLinecap="round"/>
          <text x={18} y={4} fontSize={10} fontFamily="'Fira Code',monospace" fill={muted}>{s.label}</text>
        </g>
      ))}

      <style>{`@keyframes slcDrawLine{from{stroke-dashoffset:2000}to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}
