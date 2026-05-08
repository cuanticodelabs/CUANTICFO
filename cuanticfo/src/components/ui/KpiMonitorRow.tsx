'use client';

import Sparkline from '@/components/charts/Sparkline';
import { Check, AlertTriangle, AlertCircle } from 'lucide-react';

export type KpiStatus = 'on-target' | 'near-target' | 'off-target';

export interface KpiMonitorData {
  id: string;
  label: string;
  /** Display string for current value, e.g., "32%", "$13,2M/mo", "47 días". */
  display: string;
  /** Numeric current value for sparkline scaling (optional). */
  value?: number;
  /** 30/60-day sparkline data. */
  sparkline: number[];
  /** Threshold display, e.g., "≥ 25%", "≤ 45 días". */
  target: string;
  /** Whether the metric is currently in/near/out of target. */
  status: KpiStatus;
  /** Optional grouping label, e.g., "Rentabilidad", "Liquidez", "Eficiencia". */
  group?: string;
  /** Trend direction relative to target: 'good' | 'bad' direction colors the spark. */
  trend?: 'good' | 'bad' | 'neutral';
}

interface KpiMonitorRowProps {
  kpi: KpiMonitorData;
}

const statusConfig: Record<
  KpiStatus,
  { label: string; color: string; bg: string; ring: string; Icon: React.ComponentType<{ size?: number }> }
> = {
  'on-target': {
    label: 'En meta',
    color: 'var(--color-income)',
    bg: 'var(--color-income-tint)',
    ring: 'rgba(74,222,128,0.2)',
    Icon: Check,
  },
  'near-target': {
    label: 'Cerca',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-tint)',
    ring: 'rgba(251,146,60,0.2)',
    Icon: AlertTriangle,
  },
  'off-target': {
    label: 'Fuera',
    color: 'var(--color-expense)',
    bg: 'var(--color-expense-tint)',
    ring: 'rgba(248,113,113,0.2)',
    Icon: AlertCircle,
  },
};

/**
 * KpiMonitorRow — single KPI row in the monitoring table.
 * Sparkline tells trend; threshold tells health; status badge tells action.
 * No gauges — gauges look impressive and convey nothing precise.
 */
export default function KpiMonitorRow({ kpi }: KpiMonitorRowProps) {
  const cfg = statusConfig[kpi.status];
  const sparkColor =
    kpi.trend === 'bad'
      ? 'var(--color-expense)'
      : kpi.trend === 'good'
      ? 'var(--color-income)'
      : 'var(--color-text-muted)';

  return (
    <div
      className="grid items-center gap-4 py-3 px-4 transition-colors"
      style={{
        gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(120px, 1fr) 100px 120px 100px',
      }}
    >
      {/* Label */}
      <div className="min-w-0">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {kpi.label}
        </p>
        {kpi.group && (
          <p
            className="text-[11px] mt-0.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {kpi.group}
          </p>
        )}
      </div>

      {/* Current value */}
      <div>
        <p
          className="text-base font-semibold tabular font-mono"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {kpi.display}
        </p>
      </div>

      {/* Sparkline */}
      <div className="h-8">
        <Sparkline
          data={kpi.sparkline}
          color={sparkColor}
          height={32}
          ariaLabel={`Tendencia de ${kpi.label}`}
        />
      </div>

      {/* Target */}
      <div>
        <p
          className="text-xs tabular"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Objetivo
        </p>
        <p
          className="text-sm font-semibold tabular font-mono"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {kpi.target}
        </p>
      </div>

      {/* Status */}
      <div className="flex justify-end">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold"
          style={{
            color: cfg.color,
            backgroundColor: cfg.bg,
            border: `1px solid ${cfg.ring}`,
          }}
        >
          <cfg.Icon size={11} aria-hidden="true" />
          {cfg.label}
        </span>
      </div>
    </div>
  );
}
