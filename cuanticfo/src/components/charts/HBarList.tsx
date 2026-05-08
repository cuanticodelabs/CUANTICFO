'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCLP } from '@/lib/utils/format';
import ChartDataTable from './ChartDataTable';

export interface HBarItem {
  name: string;
  value: number;
  /** Percent (0–100). If omitted, computed from total of values. */
  pct?: number;
  /** Trend vs previous period in pp or %. Optional. */
  variation?: number;
  /** Optional custom color; defaults to neutral bar. */
  color?: string;
}

interface HBarListProps {
  items: HBarItem[];
  totalLabel?: string;
  /** When true, shows CLP total on right; when false, shows percentages only. */
  showAmount?: boolean;
  /** Caption for the accessible data-table fallback. */
  dataTableCaption?: string;
}

/**
 * HBarList — horizontal sorted bars. Replaces donut for "Distribución de gastos".
 * Sorting + linear scale = the eye can compare. Donuts can't.
 */
export default function HBarList({
  items,
  totalLabel,
  showAmount = true,
  dataTableCaption = 'Desglose por categoría',
}: HBarListProps) {
  const total = items.reduce((s, it) => s + it.value, 0);
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((i) => i.pct ?? (i.value / total) * 100), 1);

  return (
    <div className="space-y-3">
      {sorted.map((it) => {
        const pct = it.pct ?? (it.value / total) * 100;
        const widthPct = (pct / max) * 100;
        return (
          <div key={it.name} className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
            <span
              className="text-sm truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {it.name}
            </span>

            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-app-bg)' }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: it.color ?? 'var(--color-accent)',
                  }}
                />
              </div>
              {it.variation !== undefined && (
                <span
                  className="inline-flex items-center gap-0.5 text-xs font-semibold tabular"
                  style={{
                    color: it.variation > 0 ? 'var(--color-expense)' : 'var(--color-income)',
                  }}
                  title={`Variación ${it.variation > 0 ? '+' : ''}${it.variation.toFixed(1)}%`}
                >
                  {it.variation > 0 ? (
                    <TrendingUp size={11} aria-hidden="true" />
                  ) : (
                    <TrendingDown size={11} aria-hidden="true" />
                  )}
                  {Math.abs(it.variation).toFixed(0)}%
                </span>
              )}
            </div>

            <div className="text-right">
              <span
                className="text-sm font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {pct.toFixed(0)}%
              </span>
              {showAmount && (
                <span
                  className="block text-xs tabular"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {formatCLP(it.value, true)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {totalLabel && (
        <div
          className="pt-3 mt-1 flex items-center justify-between text-xs"
          style={{
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>{totalLabel}</span>
          <span
            className="font-semibold tabular"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {formatCLP(total)}
          </span>
        </div>
      )}

      <ChartDataTable
        caption={dataTableCaption}
        headers={
          showAmount ? ['Categoría', 'Monto', '%', 'Δ vs ant.'] : ['Categoría', '%', 'Δ vs ant.']
        }
        rows={sorted.map((it) => {
          const pct = it.pct ?? (it.value / total) * 100;
          const delta =
            it.variation !== undefined
              ? `${it.variation > 0 ? '+' : ''}${it.variation.toFixed(0)}%`
              : '—';
          return showAmount
            ? [it.name, formatCLP(it.value), `${pct.toFixed(0)}%`, delta]
            : [it.name, `${pct.toFixed(0)}%`, delta];
        })}
      />
    </div>
  );
}
