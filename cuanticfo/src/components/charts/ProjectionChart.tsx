'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { formatCLP } from '@/lib/utils/format';
import ChartDataTable from './ChartDataTable';

export interface ProjectionPoint {
  month: string;
  /** Primary projection (the active scenario). */
  value: number;
  /** Optional comparison series (e.g., base case when viewing optimist). */
  baseline?: number;
  /** Optional confidence band. */
  low?: number;
  high?: number;
}

interface ProjectionChartProps {
  data: ProjectionPoint[];
  /** Label for the primary line, e.g., "Caja proyectada". */
  primaryLabel: string;
  /** Optional baseline label. */
  baselineLabel?: string;
  /** Y-axis title. */
  yLabel?: string;
  height?: number;
}

interface ProjectionTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{
    payload?: ProjectionPoint & { band?: number };
  }>;
  label?: string | number;
}

function ProjectionTooltip({ active, payload, label }: ProjectionTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
  return (
    <div
      className="rounded-lg p-3 text-xs"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border-strong)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <p
        className="font-semibold mb-2 uppercase tracking-[0.06em]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: 'var(--color-text-secondary)' }}>Escenario</span>
          <span
            className="font-semibold tabular"
            style={{ color: 'var(--color-accent)' }}
          >
            {formatCLP(p.value, true)}
          </span>
        </div>
        {p.baseline !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: 'var(--color-text-muted)' }}>Base</span>
            <span
              className="font-semibold tabular"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatCLP(p.baseline, true)}
            </span>
          </div>
        )}
        {p.low !== undefined && p.high !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: 'var(--color-text-muted)' }}>Rango</span>
            <span
              className="tabular"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatCLP(p.low, true)} – {formatCLP(p.high, true)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ProjectionChart — primary scenario line + optional baseline and confidence band.
 * Last point gets a glowing endpoint to read as "futuro".
 */
export default function ProjectionChart({
  data,
  primaryLabel,
  baselineLabel,
  yLabel,
  height = 280,
}: ProjectionChartProps) {
  const banded = data.map((d) => ({
    ...d,
    band: d.high !== undefined && d.low !== undefined ? d.high - d.low : 0,
  }));

  const last = data[data.length - 1];

  return (
    <div className="w-full" role="img" aria-label="Proyección a 12 meses">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={banded} margin={{ top: 16, right: 36, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="projBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCLP(v, true)}
            width={60}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'var(--color-text-muted)',
                    fontSize: 11,
                  }
                : undefined
            }
          />
          <Tooltip
            content={<ProjectionTooltip />}
            cursor={{
              stroke: 'var(--color-border-strong)',
              strokeWidth: 1,
              strokeDasharray: '2 2',
            }}
          />

          {/* Confidence band */}
          {data[0]?.low !== undefined && (
            <>
              <Area
                type="monotone"
                dataKey="low"
                stackId="band"
                stroke="none"
                fill="transparent"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="band"
                stackId="band"
                stroke="none"
                fill="url(#projBand)"
                isAnimationActive={false}
              />
            </>
          )}

          {/* Baseline line — dashed muted */}
          {data[0]?.baseline !== undefined && (
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="var(--color-text-muted)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
          )}

          {/* Primary projection */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-accent)', r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: 'var(--color-accent)',
              stroke: 'var(--color-app-bg)',
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />

          {/* End-of-projection marker */}
          {last && (
            <ReferenceLine
              x={last.month}
              stroke="var(--color-accent)"
              strokeDasharray="2 4"
              strokeOpacity={0.4}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
            aria-hidden="true"
          />
          {primaryLabel}
        </span>
        {data[0]?.baseline !== undefined && baselineLabel && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-px"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, var(--color-text-muted) 0 4px, transparent 4px 8px)',
                height: 1.5,
              }}
              aria-hidden="true"
            />
            {baselineLabel}
          </span>
        )}
        {data[0]?.low !== undefined && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-2 rounded-sm"
              style={{ backgroundColor: 'var(--color-accent)', opacity: 0.18 }}
              aria-hidden="true"
            />
            Rango de confianza
          </span>
        )}
      </div>

      <ChartDataTable
        caption={`Proyección a ${data.length} meses`}
        headers={
          data[0]?.baseline !== undefined
            ? ['Mes', primaryLabel, baselineLabel ?? 'Base']
            : ['Mes', primaryLabel]
        }
        rows={data.map((d) =>
          d.baseline !== undefined
            ? [d.month, formatCLP(d.value), formatCLP(d.baseline)]
            : [d.month, formatCLP(d.value)]
        )}
      />
    </div>
  );
}
