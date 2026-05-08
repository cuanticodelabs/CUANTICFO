'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import { formatCLP } from '@/lib/utils/format';
import ChartDataTable from './ChartDataTable';

export interface ForecastPoint {
  /** Week label e.g. "Sem 21" or ISO */
  week: string;
  /** Best estimate */
  value: number;
  /** Lower confidence bound */
  low: number;
  /** Upper confidence bound */
  high: number;
  /** Optional annotation, e.g. "Punto de tensión" */
  annotation?: string;
}

interface CashForecastProps {
  data: ForecastPoint[];
  /** Confidence (0-1) shown as a label */
  confidence?: number;
  height?: number;
  /** Optional label for warning threshold (line drawn at this value) */
  threshold?: { value: number; label: string };
}

interface ForecastTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ForecastPoint & { band?: number } }>;
  label?: string | number;
}

function ForecastTooltip({ active, payload, label }: ForecastTooltipProps) {
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
          <span style={{ color: 'var(--color-text-secondary)' }}>Estimado</span>
          <span
            className="font-semibold tabular"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {formatCLP(p.value, true)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: 'var(--color-text-muted)' }}>Rango</span>
          <span className="tabular" style={{ color: 'var(--color-text-muted)' }}>
            {formatCLP(p.low, true)} – {formatCLP(p.high, true)}
          </span>
        </div>
        {p.annotation && (
          <p
            className="mt-2 pt-2"
            style={{
              color: 'var(--color-warning)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            {p.annotation}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * CashForecast — projected cash with explicit confidence band.
 * Forecast confidence is shown explicitly. Otherwise users believe the line is fact.
 */
export default function CashForecast({
  data,
  confidence = 0.8,
  height = 280,
  threshold,
}: CashForecastProps) {
  // Recharts shaded band — render high as Area with stack, low as Area with negative offset.
  // Trick: produce a "band" series of (high - low) stacked on low.
  const banded = data.map((d) => ({
    ...d,
    low: d.low,
    band: d.high - d.low,
  }));

  // Find the lowest point — used to annotate the cash dip.
  const lowestIdx = data.reduce(
    (best, d, i) => (d.value < data[best].value ? i : best),
    0
  );
  const lowest = data[lowestIdx];

  return (
    <div className="w-full" role="img" aria-label="Pronóstico de caja a 13 semanas">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={banded} margin={{ top: 16, right: 24, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="2 4"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
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
          />
          <Tooltip
            content={<ForecastTooltip />}
            cursor={{
              stroke: 'var(--color-border-strong)',
              strokeWidth: 1,
              strokeDasharray: '2 2',
            }}
          />

          {/* Confidence band: invisible "low" + visible "band" stacked on top */}
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
            fill="url(#bandGrad)"
            isAnimationActive={false}
          />

          {/* Threshold line */}
          {threshold && (
            <ReferenceLine
              y={threshold.value}
              stroke="var(--color-warning)"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: threshold.label,
                position: 'right',
                fill: 'var(--color-warning)',
                fontSize: 10,
              }}
            />
          )}

          {/* Estimated line */}
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

          {/* Cash dip annotation */}
          <ReferenceDot
            x={lowest.week}
            y={lowest.value}
            r={6}
            fill="var(--color-warning)"
            stroke="var(--color-app-bg)"
            strokeWidth={2}
            ifOverflow="visible"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Footer: legend + confidence */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div
          className="flex items-center gap-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            Caja estimada
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-2 rounded-sm"
              style={{
                backgroundColor: 'var(--color-accent)',
                opacity: 0.18,
              }}
              aria-hidden="true"
            />
            Rango de confianza
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-warning)' }}
              aria-hidden="true"
            />
            Punto de tensión
          </span>
        </div>

        <div
          className="flex items-center gap-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>Confianza</span>
          <div
            className="w-20 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--color-border)' }}
          >
            <div
              className="h-full"
              style={{
                width: `${Math.round(confidence * 100)}%`,
                backgroundColor: 'var(--color-accent)',
              }}
            />
          </div>
          <span
            className="font-semibold tabular"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      <ChartDataTable
        caption="Pronóstico semanal de caja"
        summary={`Proyección de ${data.length} semanas con banda de confianza al ${Math.round(
          confidence * 100
        )}%.`}
        headers={['Semana', 'Estimado', 'Mínimo', 'Máximo', 'Nota']}
        rows={data.map((d) => [
          d.week,
          formatCLP(d.value),
          formatCLP(d.low),
          formatCLP(d.high),
          d.annotation ?? '—',
        ])}
      />
    </div>
  );
}
