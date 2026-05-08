'use client';

import { useState } from 'react';
import { formatCLP } from '@/lib/utils/format';
import ChartDataTable from './ChartDataTable';

export interface WaterfallItem {
  label: string;
  /** For 'total' items: absolute value. For 'delta': signed delta. */
  value: number;
  type: 'total' | 'delta';
}

interface WaterfallProps {
  items: WaterfallItem[];
  /** Chart height in px. Default 280. */
  height?: number;
  /** Show value labels above each bar. Default true. */
  showLabels?: boolean;
  /** Caption for the accessible data-table fallback. */
  dataTableCaption?: string;
}

/**
 * Waterfall — cash movement visualization.
 *
 * Each delta bar is anchored to the running cumulative total.
 * Token-driven colors: income green / expense red / accent for totals.
 * Connector lines (dashed) link bar tops, no surface chrome.
 */
export default function Waterfall({
  items,
  height = 280,
  showLabels = true,
  dataTableCaption = 'Movimientos de caja en el período',
}: WaterfallProps) {
  const [hover, setHover] = useState<number | null>(null);

  // Compute running totals so each delta bar is anchored to the cumulative.
  // For 'total' items, the bar starts at 0 and goes up to `value`.
  const { points } = items.reduce<{
    points: Array<WaterfallItem & { start: number; end: number }>;
    running: number;
  }>(
    (acc, it) => {
      if (it.type === 'total') {
        return {
          points: [...acc.points, { ...it, start: 0, end: it.value }],
          running: it.value,
        };
      }
      const start = acc.running;
      const end = acc.running + it.value;
      return {
        points: [...acc.points, { ...it, start, end }],
        running: end,
      };
    },
    { points: [], running: 0 }
  );

  // Y-axis domain: include 0 and max top, with 10% headroom.
  const allYs = points.flatMap((p) => [p.start, p.end, 0]);
  const yMin = Math.min(...allYs);
  const yMax = Math.max(...allYs);
  const range = yMax - yMin;
  const pad = range * 0.12 || 1;
  const domainMin = yMin < 0 ? yMin - pad : 0;
  const domainMax = yMax + pad;

  // Layout
  const W = 800;
  const H = height;
  const padding = { top: 24, right: 24, bottom: 56, left: 80 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;
  const slotW = innerW / points.length;
  const barW = Math.min(slotW * 0.55, 88);

  const yScale = (v: number) =>
    padding.top + innerH - ((v - domainMin) / (domainMax - domainMin)) * innerH;

  // Y-axis ticks (4)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(
    (t) => domainMin + t * (domainMax - domainMin)
  );

  return (
    <div
      className="w-full"
      role="img"
      aria-label="Gráfico de cascada de movimientos de caja"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
      >
        {/* Y grid */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              x2={W - padding.right}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-border)"
              strokeDasharray="2 4"
            />
            <text
              x={padding.left - 10}
              y={yScale(t)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="11"
              fill="var(--color-text-muted)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCLP(t, true)}
            </text>
          </g>
        ))}

        {/* Bars */}
        {points.map((p, i) => {
          const xCenter = padding.left + slotW * i + slotW / 2;
          const x = xCenter - barW / 2;

          const isTotal = p.type === 'total';
          const isPositive = p.value >= 0;
          const fill = isTotal
            ? 'var(--color-accent)'
            : isPositive
            ? 'var(--color-income)'
            : 'var(--color-expense)';
          const fillOpacity = hover === null || hover === i ? 0.95 : 0.4;

          const top = yScale(Math.max(p.start, p.end));
          const bot = yScale(Math.min(p.start, p.end));
          const h = Math.max(bot - top, 2);

          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Connector to next */}
              {i < points.length - 1 && !isTotal && (
                <line
                  x1={x + barW}
                  x2={padding.left + slotW * (i + 1) + slotW / 2 - barW / 2}
                  y1={yScale(p.end)}
                  y2={yScale(p.end)}
                  stroke="var(--color-border-strong)"
                  strokeDasharray="2 3"
                  strokeWidth={1}
                />
              )}

              <rect
                x={x}
                y={top}
                width={barW}
                height={h}
                fill={fill}
                fillOpacity={fillOpacity}
                rx={3}
                style={{ transition: 'fill-opacity 150ms ease' }}
              />

              {/* Value label above bar */}
              {showLabels && (
                <text
                  x={xCenter}
                  y={top - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={
                    isTotal
                      ? 'var(--color-text-primary)'
                      : isPositive
                      ? 'var(--color-income)'
                      : 'var(--color-expense)'
                  }
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {isTotal
                    ? formatCLP(p.value, true)
                    : `${p.value > 0 ? '+' : '−'}${formatCLP(Math.abs(p.value), true)}`}
                </text>
              )}

              {/* X label */}
              <text
                x={xCenter}
                y={H - padding.bottom + 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--color-text-muted)"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hover !== null && (
          <g pointerEvents="none">
            {(() => {
              const p = points[hover];
              const xCenter = padding.left + slotW * hover + slotW / 2;
              const top = yScale(Math.max(p.start, p.end));
              const tipW = 160;
              const tipH = 56;
              const tipX = Math.min(
                Math.max(xCenter - tipW / 2, padding.left),
                W - padding.right - tipW
              );
              const tipY = Math.max(top - tipH - 14, padding.top);
              return (
                <g>
                  <rect
                    x={tipX}
                    y={tipY}
                    width={tipW}
                    height={tipH}
                    rx={6}
                    fill="var(--color-card)"
                    stroke="var(--color-border-strong)"
                  />
                  <text
                    x={tipX + 12}
                    y={tipY + 20}
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--color-text-muted)"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
                  >
                    {p.label}
                  </text>
                  <text
                    x={tipX + 12}
                    y={tipY + 40}
                    fontSize="13"
                    fontWeight="700"
                    fill="var(--color-text-primary)"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {p.type === 'total'
                      ? formatCLP(p.value)
                      : `${p.value > 0 ? '+' : '−'}${formatCLP(Math.abs(p.value))}`}
                  </text>
                </g>
              );
            })()}
          </g>
        )}
      </svg>

      <ChartDataTable
        caption={dataTableCaption}
        headers={['Concepto', 'Tipo', 'Monto']}
        rows={items.map((it) => [
          it.label,
          it.type === 'total' ? 'Saldo' : it.value >= 0 ? 'Entrada' : 'Salida',
          it.type === 'total'
            ? formatCLP(it.value)
            : `${it.value > 0 ? '+' : '−'}${formatCLP(Math.abs(it.value))}`,
        ])}
      />
    </div>
  );
}
