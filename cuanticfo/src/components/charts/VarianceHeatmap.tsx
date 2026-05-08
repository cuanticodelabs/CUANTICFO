'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCLP } from '@/lib/utils/format';
import ChartDataTable from './ChartDataTable';

export interface VarianceCell {
  /** Actual amount in CLP. */
  actual: number;
  /** Budgeted amount in CLP. */
  budget: number;
}

export interface VarianceRow {
  category: string;
  /** Cell per month, in column order matching `months`. */
  cells: VarianceCell[];
}

interface VarianceHeatmapProps {
  /** Month labels in column order. */
  months: string[];
  rows: VarianceRow[];
  /** Click handler for drill-down. */
  onCellClick?: (category: string, month: string) => void;
}

/**
 * Compute variance percentage. Positive = over budget. Negative = under budget.
 */
function variancePct(c: VarianceCell): number {
  if (c.budget === 0) return c.actual > 0 ? 100 : 0;
  return ((c.actual - c.budget) / c.budget) * 100;
}

/**
 * Bucket the variance:
 *  - 'good'   : ≤ -5%      under budget
 *  - 'ok'     : -5..+5     on budget
 *  - 'warn'   : +5..+15    slightly over
 *  - 'bad'    : > +15      heavily over
 */
function bucket(pct: number): 'good' | 'ok' | 'warn' | 'bad' {
  if (pct <= -5) return 'good';
  if (pct <= 5) return 'ok';
  if (pct <= 15) return 'warn';
  return 'bad';
}

const bucketStyle: Record<
  ReturnType<typeof bucket>,
  { bg: string; color: string; ring: string }
> = {
  good: {
    bg: 'var(--color-income-tint)',
    color: 'var(--color-income)',
    ring: 'rgba(74,222,128,0.18)',
  },
  ok: {
    bg: 'rgba(255,255,255,0.02)',
    color: 'var(--color-text-muted)',
    ring: 'var(--color-border)',
  },
  warn: {
    bg: 'var(--color-warning-tint)',
    color: 'var(--color-warning)',
    ring: 'rgba(251,146,60,0.18)',
  },
  bad: {
    bg: 'var(--color-expense-tint)',
    color: 'var(--color-expense)',
    ring: 'rgba(248,113,113,0.22)',
  },
};

export default function VarianceHeatmap({
  months,
  rows,
  onCellClick,
}: VarianceHeatmapProps) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

  // YTD variance per row.
  const ytd = rows.map((r) => {
    const totalActual = r.cells.reduce((s, c) => s + c.actual, 0);
    const totalBudget = r.cells.reduce((s, c) => s + c.budget, 0);
    if (totalBudget === 0) return { actual: totalActual, budget: 0, pct: 0 };
    return {
      actual: totalActual,
      budget: totalBudget,
      pct: ((totalActual - totalBudget) / totalBudget) * 100,
    };
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th
                className="text-left text-[10px] font-semibold uppercase tracking-[0.09em] py-2 pr-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Categoría
              </th>
              {months.map((m) => (
                <th
                  key={m}
                  className="text-center text-[10px] font-semibold uppercase tracking-[0.09em] py-2 px-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {m}
                </th>
              ))}
              <th
                className="text-right text-[10px] font-semibold uppercase tracking-[0.09em] py-2 pl-4 pr-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                YTD
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const ytdRow = ytd[ri];
              const ytdBucket = bucket(ytdRow.pct);
              const ytdStyle = bucketStyle[ytdBucket];
              const ytdAlarm = ytdBucket === 'bad';
              return (
                <tr key={r.category}>
                  <td
                    className="py-2 pr-4 text-sm font-medium whitespace-nowrap"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {r.category}
                  </td>
                  {r.cells.map((c, ci) => {
                    const pct = variancePct(c);
                    const b = bucket(pct);
                    const s = bucketStyle[b];
                    const isHover = hover?.row === ri && hover?.col === ci;
                    return (
                      <td key={ci} className="py-1 px-1">
                        <button
                          type="button"
                          onMouseEnter={() => setHover({ row: ri, col: ci })}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => onCellClick?.(r.category, months[ci])}
                          aria-label={`${r.category} ${months[ci]}: ${pct >= 0 ? '+' : ''}${pct.toFixed(0)}% vs presupuesto`}
                          className="w-full h-9 rounded-md text-[11px] font-semibold tabular cursor-pointer transition-all"
                          style={{
                            backgroundColor: s.bg,
                            color: s.color,
                            border: `1px solid ${isHover ? s.color : s.ring}`,
                            transform: isHover ? 'scale(1.04)' : 'scale(1)',
                          }}
                        >
                          {b === 'ok'
                            ? '·'
                            : `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`}
                        </button>
                      </td>
                    );
                  })}
                  <td
                    className="py-1 pl-4 pr-2 text-right whitespace-nowrap"
                    style={{ color: ytdStyle.color }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold tabular">
                      {ytdRow.pct >= 0 ? (
                        <TrendingUp size={13} aria-hidden="true" />
                      ) : (
                        <TrendingDown size={13} aria-hidden="true" />
                      )}
                      {ytdRow.pct >= 0 ? '+' : ''}
                      {ytdRow.pct.toFixed(0)}%
                      {ytdAlarm && (
                        <AlertTriangle
                          size={13}
                          style={{ color: 'var(--color-expense)' }}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        className="mt-4 pt-4 flex flex-wrap items-center gap-4 text-[11px]"
        style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
      >
        {(['good', 'ok', 'warn', 'bad'] as const).map((b) => {
          const labels = {
            good: 'Bajo presupuesto',
            ok: 'En presupuesto (±5%)',
            warn: 'Sobre 5–15%',
            bad: 'Sobre >15%',
          };
          const s = bucketStyle[b];
          return (
            <span key={b} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3.5 h-3.5 rounded"
                style={{ backgroundColor: s.bg, border: `1px solid ${s.ring}` }}
                aria-hidden="true"
              />
              {labels[b]}
            </span>
          );
        })}
      </div>

      {/* Accessible flat fallback */}
      <ChartDataTable
        caption="Variación presupuestaria por categoría y mes"
        headers={['Categoría', ...months, 'YTD %']}
        rows={rows.map((r, ri) => [
          r.category,
          ...r.cells.map((c) => {
            const pct = variancePct(c);
            return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}% (${formatCLP(c.actual, true)} / ${formatCLP(c.budget, true)})`;
          }),
          `${ytd[ri].pct >= 0 ? '+' : ''}${ytd[ri].pct.toFixed(1)}%`,
        ])}
      />

      {/* Detail tooltip — pulled out of the cells so it doesn't reflow them */}
      {hover && (
        <div
          className="mt-4 p-3 rounded-lg text-xs"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border-strong)',
          }}
          aria-live="polite"
        >
          <p
            className="font-semibold mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {rows[hover.row].category} · {months[hover.col]}
          </p>
          <div
            className="flex flex-wrap gap-x-4 gap-y-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span>
              Real:{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatCLP(rows[hover.row].cells[hover.col].actual)}
              </span>
            </span>
            <span>
              Presupuesto:{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatCLP(rows[hover.row].cells[hover.col].budget)}
              </span>
            </span>
            <span>
              Variación:{' '}
              <span
                className="font-semibold tabular"
                style={{
                  color:
                    variancePct(rows[hover.row].cells[hover.col]) > 5
                      ? 'var(--color-expense)'
                      : variancePct(rows[hover.row].cells[hover.col]) < -5
                      ? 'var(--color-income)'
                      : 'var(--color-text-primary)',
                }}
              >
                {variancePct(rows[hover.row].cells[hover.col]) >= 0 ? '+' : ''}
                {variancePct(rows[hover.row].cells[hover.col]).toFixed(1)}%
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
